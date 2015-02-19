var video = require('./video-wrapper');
var Video = video.video;

$.fn.video = function(params) {
     return this.each(function() {
         var video = new Video($(this), params);
     });
 };
