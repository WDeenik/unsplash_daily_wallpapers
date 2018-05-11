import Unsplash from "unsplash-js";
import { IConfig } from "./config";
// The unsplash library assumes 'fetch()' is available. Ugly solution:
// tslint:disable-next-line:no-var-requires
(global as any).fetch = require("node-fetch");

export interface IUnsplash {
  photos: IPhotos;
  collections: ICollections;
}

interface IPhotos {
  getPhoto: (id: string, width?: number, height?: number, rectangle?: number[]) => Promise<any>;
  downloadPhoto: (photo: any) => any;
}

interface ICollections {
  listCollections: (page?: number, perPage?: number, orderBy?: string) => Promise<any>;
  listCuratedCollections: (page?: number, perPage?: number) => Promise<any>;
  getCollection: (id: number) => Promise<any>;
  getCollectionPhotos: (id: number, page?: number, perPage?: number, orderBy?: string) => Promise<Request>;
}

export function init(config: IConfig): IUnsplash {
  return new Unsplash({
    applicationId: config.unsplash_appId,
    callbackUrl: "",
    secret: config.unsplash_appSecret,
  }) as IUnsplash;
}
