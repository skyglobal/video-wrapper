var local = {}; local['video-wrapper'] = require('./video-wrapper');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-video-wrapper/dist/scripts/video-wrapper.requirejs', [], function() {
        'use strict';
        return local['video-wrapper'];
    });
}