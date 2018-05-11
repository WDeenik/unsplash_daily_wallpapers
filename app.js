"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var mkdirp = require("mkdirp");
var request = require("request");
var unsplash_js_1 = require("unsplash-js");
var config_1 = require("./lib/config");
var unsplash = require("./lib/unsplash");
var config = config_1.loadConfigSync();
var unsplashInstance = unsplash.init(config);
downloadWallpapers(unsplashInstance);
// cleanUpWallpapers(config);
function downloadWallpapers(us) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var currentWallpaperIds, latest, toDownload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Create folder if it does not exist yet
                    mkdirp.sync(config.folder);
                    currentWallpaperIds = fs.readdirSync(config.folder)
                        .map(function (filename) { return filename.substr(0, filename.lastIndexOf(".")); });
                    return [4 /*yield*/, us.collections.getCollectionPhotos(1065396, 1, config.max_wallpapers, "latest")
                            .then(unsplash_js_1.toJson)];
                case 1:
                    latest = _a.sent();
                    toDownload = latest.filter(function (wallpaper) { return currentWallpaperIds.indexOf(wallpaper.id) < 0; });
                    toDownload.forEach(function (wallpaper) { return __awaiter(_this, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, us.photos.downloadPhoto(wallpaper).then(unsplash_js_1.toJson)];
                                case 1:
                                    url = (_a.sent()).url;
                                    download(url, config.folder + "/" + wallpaper.id + ".jpg");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function download(url, savePath) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            options = {
                headers: {
                    Authorization: "Client-ID " + config.unsplash_appId
                },
                url: url
            };
            request(options).pipe(fs.createWriteStream(savePath));
            return [2 /*return*/];
        });
    });
}
