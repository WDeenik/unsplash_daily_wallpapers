import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as request from "request";
import { toJson } from "unsplash-js";
import { IConfig, loadConfigSync } from "./lib/config";
import * as unsplash from "./lib/unsplash";
// Jimp has an incomplete d.ts, so we sadly have to do it like this
// tslint:disable-next-line:no-var-requires
const jimp = require("jimp");

const config = loadConfigSync();
const fontSize = calcFontSize();
const unsplashInstance = unsplash.init(config);

downloadWallpapers(unsplashInstance).then(cleanUpWallpapers);

async function downloadWallpapers(us: unsplash.IUnsplash): Promise<string[]> {
  // Create folder if it does not exist yet
  mkdirp.sync(config.folder);

  const currentWallpaperIds = fs.readdirSync(config.folder)
    .map((filename) => filename.substr(0, filename.lastIndexOf(".")));

  const latest = await us.collections.getCollectionPhotos(1065396, 1, config.max_wallpapers, "latest")
    .then(toJson);

  const toDownload = latest.filter((wallpaper) => currentWallpaperIds.indexOf(wallpaper.id) < 0);

  await Promise.all(toDownload.map(async (wallpaper) => {
    const file = `${config.folder}/${wallpaper.id}.jpg`;
    const { url } = await us.photos.downloadPhoto(wallpaper).then(toJson);
    await download(url, file);
    await process(file, wallpaper.user.name);
  }));
  return latest.map( ({ id }) => id);
}

async function cleanUpWallpapers(toKeep: string[]) {
  if (config.delete_more_than_max) {
    const keepFns = toKeep.map((id) => id + ".jpg");
    const del = fs.readdirSync(config.folder)
    .filter((fn) => fn.search(/\.jpg$/) >= 0)
    .filter((fn) => keepFns.indexOf(fn) < 0);

    del.forEach((fn) => fs.unlinkSync(`${config.folder}/${fn}`));
  }
}

async function download(url: string, savePath: string) {
  const options = {
    headers: {
      Authorization: `Client-ID ${config.unsplash_appKey}`,
    },
    url,
  };
  return new Promise(async (resolve, reject) => {
    request(options).pipe(
      fs.createWriteStream(savePath)
        .on("finish", () => resolve())
        .on("error", (err) => reject(err)));
  });
}

async function process(file: string, photographer: string) {
  try {
    const img = await jimp.read(file);
    await img.cover(config.width, config.height);
    await img.quality(100);
    const font = await jimp.loadFont(`./fonts/Sans_Shadow_White_${fontSize}.fnt`);
    const text = `By: ${photographer}`;
    const offset = measureText(font, text) + 0.25 * fontSize;
    img.print(font, config.width - offset, 0, text);
    await img.write(file);
  } catch (e) {
    throw(e);
  }
}

// Borrowed this one from Jimp so we can make our own right-aligned text
function measureText(font, text): number {
  let x = 0;
  for (let i = 0; i < text.length; i++) {
      if (font.chars[text[i]]) {
          // x += font.chars[text[i]].xoffset // Jimp does not use this when rendering
          x += (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0)
            + (font.chars[text[i]].xadvance || 0);
      }
  }
  return x;
}

function calcFontSize(): number {
  const sizes = getFontSizes();
  const prefSize = config.height / 64;
  return sizes.reduce((bestFit, curr) => {
    return (Math.abs(curr - prefSize) < Math.abs(bestFit - prefSize))
      ? curr
      : bestFit;
  });
}

function getFontSizes(): number[] {
  return fs.readdirSync("./fonts")
    .filter((fn) => fn.search(/\d+\.fnt$/) >= 0)
    .map((fn) => parseInt(fn.match(/(\d+).fnt$/)[0], 10));
}
