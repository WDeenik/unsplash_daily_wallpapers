import * as fs from "fs";
import * as yaml from "js-yaml";
import { promisify } from "util";

const readFile  = promisify(fs.readFile);
const maxWallpapers = 20;
const configPath = "./config.yml";

export interface IConfig {
  folder: string;
  max_wallpapers: number;
  unsplash_appId: string;
  unsplash_appSecret: string;
  width?: number;
  height?: number;
}

export async function loadConfig(): Promise<IConfig> {
  if (!fs.existsSync(configPath)) {
    throw new Error(`'${configPath}' does not exist`);
  }
  const configYml = await readFile(configPath, "utf8");
  const config = yaml.safeLoad(configYml) as IConfig;
  // Limit no. of wallpapers we get from Unsplashed
  config.max_wallpapers = config.max_wallpapers > maxWallpapers ? maxWallpapers : config.max_wallpapers;
  return config;
}

export function loadConfigSync(): IConfig {
  const configYml = fs.readFileSync("./config.yml", "utf8");
  const config = yaml.safeLoad(configYml) as IConfig;
  return validate(config);
}

function validate(config: IConfig): IConfig {
  if (!config.unsplash_appId || !config.unsplash_appSecret) {
    throw new Error("Please add your Unsplash app ID and Secret to the config");
  }
  if (!config.folder) {
    throw new Error("Wallpaper download folder undefined in config");
  }
  // Limit no. of wallpapers we get from Unsplashed
  config.max_wallpapers = !config.max_wallpapers || config.max_wallpapers > maxWallpapers
    ? maxWallpapers
    : config.max_wallpapers;

  config.width = config.width ? config.width : 1920;
  config.height = config.height ? config.height : 1080;
  return config;
}
