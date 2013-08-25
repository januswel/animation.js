(function () {
    // browser support
    var requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function (callee) {
            return window.setTimeout(callee, 1000 / 60);
        },
        // define animation_ prototype
        Animation = function Animation(element) {
            this.element = element;
        };

    Animation.prototype = {
        start: function (options) {
            var dfd = $.Deferred();

            this.endTime = Date.now() + options.duration;
            this.options = options;

            if (typeof options.action === 'function') {
                this.animation_(options.action, options.duration, dfd);
            } else {
                options.action.initialize(this.element, this.options);
                this.animation_(options.action.main, options.duration, dfd);
            }

            return dfd.promise();
        },
        animation_: function (action, duration, dfd) {
            var progress = 1 - (this.endTime - Date.now()) / duration;
            if (progress < 1) {
                requestAnimationFrame(this.animation_.bind(this, action, duration, dfd));
                action(this.element, progress, this.options);
            } else {
                action(this.element, 1, this.options);
                delete this.endTime;
                delete this.options;
                return dfd.resolve();
            }
        }
    };

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            return Animation;
        });
    }

    if (typeof window === 'object' && typeof window.document === 'object') {
        window.Animation = Animation;
    }
})();
