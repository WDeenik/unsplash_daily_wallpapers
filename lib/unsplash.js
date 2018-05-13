"use strict";
exports.__esModule = true;
var unsplash_js_1 = require("unsplash-js");
// The unsplash library assumes 'fetch()' is available. Ugly solution:
// tslint:disable-next-line:no-var-requires
global.fetch = require("node-fetch");
function init(config) {
    return new unsplash_js_1["default"]({
        applicationId: config.unsplash_appKey,
        callbackUrl: "",
        secret: config.unsplash_appSecret
    });
}
exports.init = init;
