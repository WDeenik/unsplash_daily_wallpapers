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
// Jimp has an incomplete d.ts, so we sadly have to do it like this
// tslint:disable-next-line:no-var-requires
var jimp = require("jimp");
var config = config_1.loadConfigSync();
var fontSize = calcFontSize();
var unsplashInstance = unsplash.init(config);
downloadWallpapers(unsplashInstance).then(cleanUpWallpapers);
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
                    return [4 /*yield*/, Promise.all(toDownload.map(function (wallpaper) { return __awaiter(_this, void 0, void 0, function () {
                            var file, url;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        file = config.folder + "/" + wallpaper.id + ".jpg";
                                        return [4 /*yield*/, us.photos.downloadPhoto(wallpaper).then(unsplash_js_1.toJson)];
                                    case 1:
                                        url = (_a.sent()).url;
                                        return [4 /*yield*/, download(url, file)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, process(file, wallpaper.user.name)];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, latest.map(function (_a) {
                            var id = _a.id;
                            return id;
                        })];
            }
        });
    });
}
function cleanUpWallpapers(toKeep) {
    return __awaiter(this, void 0, void 0, function () {
        var keepFns_1, del;
        return __generator(this, function (_a) {
            if (config.delete_more_than_max) {
                keepFns_1 = toKeep.map(function (id) { return id + ".jpg"; });
                del = fs.readdirSync(config.folder)
                    .filter(function (fn) { return fn.search(/\.jpg$/) >= 0; })
                    .filter(function (fn) { return keepFns_1.indexOf(fn) < 0; });
                del.forEach(function (fn) { return fs.unlinkSync(config.folder + "/" + fn); });
            }
            return [2 /*return*/];
        });
    });
}
function download(url, savePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var options;
        return __generator(this, function (_a) {
            options = {
                headers: {
                    Authorization: "Client-ID " + config.unsplash_appKey
                },
                url: url
            };
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        request(options).pipe(fs.createWriteStream(savePath)
                            .on("finish", function () { return resolve(); })
                            .on("error", function (err) { return reject(err); }));
                        return [2 /*return*/];
                    });
                }); })];
        });
    });
}
function process(file, photographer) {
    return __awaiter(this, void 0, void 0, function () {
        var img, font, text, offset, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, jimp.read(file)];
                case 1:
                    img = _a.sent();
                    return [4 /*yield*/, img.cover(config.width, config.height)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, img.quality(100)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, jimp.loadFont("./fonts/Sans_Shadow_White_" + fontSize + ".fnt")];
                case 4:
                    font = _a.sent();
                    text = "By: " + photographer;
                    offset = measureText(font, text) + 0.25 * fontSize;
                    img.print(font, config.width - offset, config.height - 1.5 * fontSize, text);
                    return [4 /*yield*/, img.write(file)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    throw (e_1);
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Borrowed this one from Jimp so we can make our own right-aligned text
function measureText(font, text) {
    var x = 0;
    for (var i = 0; i < text.length; i++) {
        if (font.chars[text[i]]) {
            // x += font.chars[text[i]].xoffset // Jimp does not use this when rendering
            x += (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0)
                + (font.chars[text[i]].xadvance || 0);
        }
    }
    return x;
}
function calcFontSize() {
    var sizes = getFontSizes();
    var prefSize = config.height / 64;
    return sizes.reduce(function (bestFit, curr) {
        return (Math.abs(curr - prefSize) < Math.abs(bestFit - prefSize))
            ? curr
            : bestFit;
    });
}
function getFontSizes() {
    return fs.readdirSync("./fonts")
        .filter(function (fn) { return fn.search(/\d+\.fnt$/) >= 0; })
        .map(function (fn) { return parseInt(fn.match(/(\d+).fnt$/)[0], 10); });
}
