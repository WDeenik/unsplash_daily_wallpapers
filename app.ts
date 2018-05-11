import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as request from "request";
import { toJson } from "unsplash-js";
import { IConfig, loadConfigSync } from "./lib/config";
import * as unsplash from "./lib/unsplash";

const config = loadConfigSync();
const unsplashInstance = unsplash.init(config);

downloadWallpapers(unsplashInstance);
// cleanUpWallpapers(config);

async function downloadWallpapers(us: unsplash.IUnsplash) {
  // Create folder if it does not exist yet
  mkdirp.sync(config.folder);

  const currentWallpaperIds = fs.readdirSync(config.folder)
    .map((filename) => filename.substr(0, filename.lastIndexOf(".")));

  const latest = await us.collections.getCollectionPhotos(1065396, 1, config.max_wallpapers, "latest")
    .then(toJson);

  const toDownload = latest.filter((wallpaper) => currentWallpaperIds.indexOf(wallpaper.id) < 0);
  toDownload.forEach(async (wallpaper) => {
    const { url } = await us.photos.downloadPhoto(wallpaper).then(toJson);
    download(url, `${config.folder}/${wallpaper.id}.jpg`);
  });
  // TODO: resize & watermark (use jimp module!)
}

async function download(url: string, savePath: string) {
  const options = {
    headers: {
      Authorization: `Client-ID ${config.unsplash_appId}`,
    },
    url,
  };
  request(options).pipe(fs.createWriteStream(savePath));
}
