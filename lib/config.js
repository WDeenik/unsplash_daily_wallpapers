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
var yaml = require("js-yaml");
var util_1 = require("util");
var readFile = util_1.promisify(fs.readFile);
var maxWallpapers = 20;
var configPath = "./config.yml";
function loadConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var configYml, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync(configPath)) {
                        throw new Error("'" + configPath + "' does not exist");
                    }
                    return [4 /*yield*/, readFile(configPath, "utf8")];
                case 1:
                    configYml = _a.sent();
                    config = yaml.safeLoad(configYml);
                    // Limit no. of wallpapers we get from Unsplashed
                    config.max_wallpapers = config.max_wallpapers > maxWallpapers ? maxWallpapers : config.max_wallpapers;
                    return [2 /*return*/, config];
            }
        });
    });
}
exports.loadConfig = loadConfig;
function loadConfigSync() {
    var configYml = fs.readFileSync("./config.yml", "utf8");
    var config = yaml.safeLoad(configYml);
    return validate(config);
}
exports.loadConfigSync = loadConfigSync;
function validate(config) {
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
