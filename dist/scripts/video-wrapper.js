(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var state = { css: {} };
var html = document.documentElement;
var toolkitClasses = ["no-touch", "touch-device"];
var vendorPrefix = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
var classes = { hasNot: toolkitClasses[0], has: toolkitClasses[1] };

function attachClasses() {
    var arrClasses = html.className.split(' ');
    arrClasses.push(touch() ? classes.has : classes.hasNot);
    html.className = arrClasses.join(' ');
}

function translate3d() {
    var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        },
        body = document.body || document.documentElement,
        has3d,
        div = document.createElement('div'),
        t;
    body.insertBefore(div, null);
    for (t in transforms) {
        if (transforms.hasOwnProperty(t)) {
            if (div.style[t] !== undefined) {
                div.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(div).getPropertyValue(transforms[t]);
            }
        }
    }
    body.removeChild(div);
    state.css.translate3d = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    return state.css.translate3d;
}

function supportsCSS(property) {
    if (state.css[property]) {
        return state.css[property];
    }
    if (property === 'translate3d') {
        return translate3d(property);
    }
    var style = html.style;
    if (typeof style[property] == 'string') {
        state.css[property] = true;
        return true;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    for (var i = 0; i < vendorPrefix.length; i++) {
        if (typeof style[vendorPrefix[i] + property] == 'string') {
            state.css[property] = true;
            return state.css[property];
        }
    }
    state.css[property] = false;
    return state.css[property];
}

function css(el, property) {
    if (!property) {
        return supportsCSS(el);
    }
    var strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(el, "").getPropertyValue(property);
    } else if (el.currentStyle) {
        property = property.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
        strValue = el.currentStyle[property];
    }
    return strValue;
}

function touch() {
    state.touch = (typeof window.ontouchstart !== "undefined");
    return state.touch;
}

function getElementOffset(el) {
    return {
        top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
        left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
    };
}

function elementVisibleBottom(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
}

function elementVisibleRight(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
}

attachClasses();

module.exports = {
    _attachClasses: attachClasses,
    _state: state,
    css: css,
    touch: touch,
    elementVisibleBottom: elementVisibleBottom,
    elementVisibleRight: elementVisibleRight
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.detect = module.exports;
},{}],2:[function(require,module,exports){
var utils = require('../utils/event-helpers');
var timeout = { resize: null };

function bindEvents() {
    on(window, 'resize', initResizeEnd);
}

function initResizeEnd() {
    clearTimeout(timeout.resize);
    timeout.resize = setTimeout(function triggerResizeEnd() {
        trigger(window, 'resizeend');
    }, 200);
}


function ready(exec) {
    if (/in/.test(document.readyState)) {
        setTimeout(function () {
            ready(exec);
        }, 9);
    } else {
        exec();
    }
}

function trigger(el, eventName) {
    utils.dispatchEvent(el, eventName);
}

function live(events, selector, eventHandler){
    events.split(' ').forEach(function(eventName){
        utils.attachEvent(eventName, selector, eventHandler);
    });
}

function off(el, eventNames, eventHandler) {
    eventNames.split(' ').forEach(function(eventName) {
        if (el.isNodeList) {
            Array.prototype.forEach.call(el, function (element, i) {
                utils.removeEventListener(element, eventName, eventHandler);
            });
        } else {
            utils.removeEventListener(el, eventName, eventHandler);
        }
    });
}

function on(el, eventNames, eventHandler, useCapture) {
    eventNames.split(' ').forEach(function(eventName) {
        if (el.isNodeList){
            Array.prototype.forEach.call(el, function(element, i){
                utils.addEventListener(element, eventName, eventHandler, useCapture);
            });
        } else {
            utils.addEventListener(el, eventName, eventHandler, useCapture);
        }
    });
}

bindEvents();

module.exports = {
    live: live,
    on: on,
    off: off,
    emit: trigger, //deprecate me
    trigger: trigger,
    ready: ready
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.event = module.exports;

},{"../utils/event-helpers":4}],3:[function(require,module,exports){
var version  = require('./utils/version');
var event  = require('./api/event');
var detect  = require('./api/detect');

module.exports = {
    version: version,
    event: event,
    detect: detect
}

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['version'] = version;
skyComponents['event'] = event;
skyComponents['detect'] = detect;
},{"./api/detect":1,"./api/event":2,"./utils/version":5}],4:[function(require,module,exports){
var eventRegistry = {};
var state = {    };
var browserSpecificEvents = {
    'transitionend': 'transition',
    'animationend': 'animation'
};
NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = true;

function capitalise(str) {
    return str.replace(/\b[a-z]/g, function () {
        return arguments[0].toUpperCase();
    });
}

function check(eventName) {
    var type = '';
    if (browserSpecificEvents[eventName]){
        eventName =  browserSpecificEvents[eventName];
        type = 'end';
    }
    var result = false,
        eventType = eventName.toLowerCase() + type.toLowerCase(),
        eventTypeCaps = capitalise(eventName.toLowerCase()) + capitalise(type.toLowerCase());
    if (state[eventType]) {
        return state[eventType];
    }
    ['ms', 'moz', 'webkit', 'o', ''].forEach(function(prefix){
        if (('on' + prefix + eventType in window) ||
            ('on' + prefix + eventType in document.documentElement)) {
            result = (!!prefix) ? prefix + eventTypeCaps : eventType;
        }
    });
    state[eventType] = result;
    return result;
}

function dispatchEvent(el, eventName){
    eventName = check(eventName) || eventName;
    var event;
    if (document.createEvent) {
        event = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
        event.initCustomEvent(eventName, false, false, null);
        el.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        el.fireEvent('on' + eventName, event);
    }
}

function addEventListener(el, eventName, eventHandler, useCapture){
    eventName = check(eventName) || eventName;
    if (el.addEventListener) {
        el.addEventListener(eventName, eventHandler, !!useCapture);
    } else {
        el.attachEvent('on' + eventName, eventHandler);
    }
}

function removeEventListener(el, eventName, eventHandler){
    eventName = check(eventName) || eventName;
    if (el.removeEventListener) {
        el.removeEventListener(eventName, eventHandler, false);
    } else {
        el.detachEvent('on' + eventName, eventHandler);
    }
}

function dispatchLiveEvent(event) {
    var targetElement = event.target;

    eventRegistry[event.type].forEach(function (entry) {
        var potentialElements = document.querySelectorAll(entry.selector);
        var hasMatch = false;
        Array.prototype.forEach.call(potentialElements, function(el){
            if (el.contains(targetElement) || el === targetElement){
                hasMatch = true;
                return;
            }
        });

        if (hasMatch) {
            entry.handler.call(targetElement, event);
        }
    });

}

function attachEvent(eventName, selector, eventHandler){
    if (!eventRegistry[eventName]) {
        eventRegistry[eventName] = [];
        addEventListener(document.documentElement, eventName, dispatchLiveEvent, true);
    }

    eventRegistry[eventName].push({
        selector: selector,
        handler: eventHandler
    });
}


module.exports = {
    dispatchEvent: dispatchEvent,
    attachEvent: attachEvent,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
};
},{}],5:[function(require,module,exports){
module.exports = "0.0.2";
},{}],6:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],7:[function(require,module,exports){
'use strict';

var core = require('../../bower_components/bskyb-core/src/scripts/core');
var event = core.event;

// video player require only freewheel, but nothing else.
if (typeof require !== "undefined") {
  window.require = function(){
    return;
  };
}

function Video($container, options) {

     if (!$container.attr('data-video-id')){ return; }
     var video = this;
     this.$container = $container;
     this.options = {
         token : options.token,
         autoplay : false,
         videoId : $container.attr('data-video-id')
     };

     this.toolkitOptions = {
         animationSpeed: (options.animationSpeed !== undefined ) ? options.animationSpeed : 500,
         onPlay: options.onPlay,
         closeCallback: options.closeCallback,
         $wrapperLocation: options.$wrapperLocation || this.$container
     };

     this.bindEvents();
 }

 Video.prototype = {

    bindEvents: function(){
        var video = this;
        video.$container.on('click','.play-video' ,function(e){
            video.createWrapper();
            video.play(e);
        });
    },
    bindWrapperEvents:function () {
        var video = this;
        $('body').one('keydown', video.stopOnEscape.bind(video));
        video.$wrapper.one('click touchstart', '.close', video.stop.bind(video));
        video.$player.one('ended webkitendfullscreen', video.stop.bind(video));

          if (video.options.freewheel) {
              video.$player.on('onSlotStarted', function () {
                  video.$player.off('ended webkitendfullscreen');
                  video.$player.one('onSlotEnded', function () {
                      video.$player.one('playing', function() {
                          video.$player.one('ended webkitendfullscreen', video.stop.bind(video));
                      });
                  });
              });
          }



    },
    createWrapper:function () {
        this.toolkitOptions.$wrapperLocation.append('<div class="video-wrapper">' +
            '<a href="#!" class="close"><i class="skycon-close" aria-hidden=true></i><span class="speak">Close</span></a>' +
            '<div class="videocontrolcontainer"><video></video><img class="posterFrame"/></div>' +
        '</div>');
        this.toolkitOptions.$wrapperLocation.find('.posterFrame').on('error', function () {
            this.src = options.placeHolderImage;
        });
        this.toolkitOptions.$wrapperLocation.append('<div class="video-overlay"></div>');
        this.$player = this.toolkitOptions.$wrapperLocation.parent().find('video');
        this.$wrapper = this.toolkitOptions.$wrapperLocation.find('.video-wrapper');
        this.$wrapper.attr('id', 'video-' + this.options.videoId);
        this.bindWrapperEvents();
    },
    removeWrapper: function(){
        this.$wrapper.removeClass('playing-video').remove();
        this.toolkitOptions.$wrapperLocation.find('.video-overlay').remove();
    },

    play:function(e) {
        if(e) { e.preventDefault(); }
        var video = this;
        if(video.toolkitOptions.onPlay) {
            video.toolkitOptions.onPlay();
        }
        this.showCanvas(function () {
        video.$player.sky_html5player(video.options); //todo: move to main video function
        setTimeout(function () {
            sky.html5player.play();
        }, 1333); //todo: call without setTimeout. S3 breaks as does flash ie8
//                todo: do both todo's when video team add flash queueing + fixed S3
        });
    },
    stopOnEscape: function(e){
        if (e.keyCode === 27) {
            e.preventDefault();
            this.stop();
        }
    },
    stop:function (e) {
        if(e) { e.preventDefault(); }
        var video = this;
        event.off(window, 'resizeend', video.resizeListener);
        sky.html5player.close(this.$wrapper);
        this.hideCanvas();
    },
    showCanvas:function (callback) {
        var height,
            $container = this.$container,
            $wrapperLocation = this.toolkitOptions.$wrapperLocation,
            $overlay = $wrapperLocation.find('.video-overlay'),
            $wrapper = $wrapperLocation.find('.video-wrapper'),
            $play = $container.find('.play-video'),
            $close = $wrapper.find('.close'),
            animationSpeed = (this.toolkitOptions.animationSpeed === 0) ? 0 : this.toolkitOptions.animationSpeed || 500,
            video = this;
        this.originalHeight = $container.height();
        $wrapper.addClass('playing-video');
        $overlay.fadeIn(animationSpeed, function () {
            $play.fadeOut(animationSpeed);
            $close.addClass('active');
            height = video.calculateHeight();
            $container.animate({ height:height }, animationSpeed, function () {
                video.resizeListener = video.resizeContainer.bind(video);
                event.on(window, 'resizeend', video.resizeListener);
                $wrapper.show();
                $overlay.fadeOut(animationSpeed);
                callback();
            });
        });
    },
    calculateHeight:function () {
        return Math.round((this.$container.width() / 16) * 9);
    },
    resizeContainer:function () {
        this.$container.animate({ height:this.calculateHeight() }, 250);
    },
    hideCanvas:function () {
        var video = this,
            $container = this.$container,
            $wrapperLocation = this.toolkitOptions.$wrapperLocation,
            $overlay = $wrapperLocation.find('.video-overlay'),
            $wrapper = $wrapperLocation.find('.video-wrapper'),
            $play = $container.find('.play-video'),
            $close = $wrapper.find('.close'),
            animationSpeed = (this.toolkitOptions.animationSpeed === 0) ? 0 : this.toolkitOptions.animationSpeed || 500,
            originalHeight = this.originalHeight;

        $overlay.fadeIn(animationSpeed, function () {
            $close.removeClass('active');
            $container.animate({ height:originalHeight }, animationSpeed, function () {
                $container.css({ height:'auto' });
                if (video.toolkitOptions.closeCallback) {
                    video.toolkitOptions.closeCallback();
                }
                $play.fadeIn(animationSpeed);
                $overlay.hide();
                $wrapper.fadeOut(animationSpeed, video.removeWrapper.bind(video));
            });
        });
    }
};

//example export
module.exports = {
    video: Video,
    version: require('./utils/version.js')//keep this : each component exposes its version
};

//keep this : ensure components are also globally available
if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents['video-wrapper'] = module.exports;

},{"../../bower_components/bskyb-core/src/scripts/core":3,"./utils/version.js":6}]},{},[7]);
