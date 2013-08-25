define(function () {
    // utility functions
    var size = function (element, rect) {
            if (!rect) {
                return {
                    width: element.offsetWidth,
                    height: element.offsetHeight
                };
            }
            element.style.width = rect.width.toString(10) + 'px';
            element.style.height = rect.height.toString(10) + 'px';
        },
        center = function (element, coordinates) {
            var rect = size(element);

            if (!coordinates) {
                return {
                    x: element.offsetLeft + rect.width / 2,
                    y: element.offsetTop + rect.height / 2,
                };
            }
            element.style.left = (coordinates.x - rect.width / 2).toString(10) + 'px';
            element.style.top = (coordinates.y - rect.height / 2).toString(10) + 'px';
        },
        // animation actions
        Actions = {
            blink: {
                initialize: function (element, options) {
                    // default settings
                    if (!('count' in options)) {
                        options.count = 3;
                    }
                    // initialize
                    options.visibleRatio_ = 0.6;
                    options.frequency_ = 1 / options.count;
                },
                main: function (element, progress, options) {
                    var cycle = progress / options.frequency_,
                        visibility = cycle - Math.floor(cycle) < options.visibleRatio_;
                    element.style.visibility = visibility ? 'visible' : 'hidden';
                    ++options.count;
                }
            },
            disappear: function (element, progress) {
                element.style.opacity = 1 - progress;
            },
            appear: function (element, progress) {
                element.style.opacity = progress;
            },
            move: {
                initialize: function (element, options) {
                    // default settings
                    // if function for displacement is not assigned, move linearly
                    if (!('displacementFunction' in options)) {
                        options.displacementFunction = function (x) {
                            return x;
                        };
                    }
                    if (!('vector' in options)) {
                        if (options.destination) {
                            var rect = size(element);
                            options.vector = {
                                x: options.destination.x - rect.width / 2,
                                y: options.destination.y - rect.height / 2
                            }
                        } else {
                            options.vector = {
                                x: 100,
                                y: 100
                            };
                        }
                    }

                    // initialize
                    options.baseCoordinates_ = center(element);
                },
                main: function (element, progress, options) {
                    var ratio = options.displacementFunction(progress),
                        coordinates = {
                        x: options.baseCoordinates_.x + options.vector.x * ratio,
                        y: options.baseCoordinates_.y + options.vector.y * ratio
                    };

                    center(element, coordinates);
                }
            },
            circleMotion: {
                initialize: function (element, options) {
                    // default settings
                    if (!('radian' in options)) {
                        options.radian = 2 * Math.PI;
                    }

                    // initialize
                    var elementCenter = center(element);
                        vector = {
                            x: elementCenter.x - options.center.x,
                            y: elementCenter.y - options.center.y
                        };
                    options.baseRadian_ = Math.atan2(vector.y, vector.x);
                    options.radius_ = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
                },
                main: function (element, progress, options) {
                    var radian = options.baseRadian_ + progress * options.radian,
                        coordinates = {
                            x: options.center.x + Math.cos(radian) * options.radius_,
                            y: options.center.y + Math.sin(radian) * options.radius_
                        };

                    center(element, coordinates);
                }
            },
            scaling: {
                initialize: function (element, options) {
                    // default settings
                    if (!('scale' in options)) {
                        options.scale = 2;
                    }

                    // initialize
                    options.baseCoordinates_ = center(element);
                    options.baseSize_ = size(element);
                    options.diffScale_ = options.scale - 1;
                },
                main: function (element, progress, options) {
                    var ratio = options.diffScale_ * progress + 1,
                        scaledSize = {
                            width: options.baseSize_.width * ratio,
                            height: options.baseSize_.height * ratio
                        };
                    size(element, scaledSize);
                    center(element, options.baseCoordinates_);
                }
            }
        };

    return Actions;
});
