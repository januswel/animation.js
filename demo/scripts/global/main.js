(function () {
    // utility functions
    var sigmoid = function (x, a) {
            return 1 / (1 + Math.exp(-a * x));
        },
        easeInOut = function (x) {
            return sigmoid(x - 0.5, 30);
        };

    $(document).ready(function () {
        var screenCenter = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            },
            animation1 = new Animation(document.getElementById('image1')),
            animation2 = new Animation(document.getElementById('image2'));

        // in some browsers, offsetHeight is not set just after "ready"
        setTimeout(function () {
            var act1 = animation1.start({
                    action: Animation.Actions.move,
                    duration: 2000,
                    destination: screenCenter
                }).then(function () {
                    return animation1.start({
                        action: Animation.Actions.disappear,
                        duration: 1000
                    });
                }).then(function () {
                    return animation1.start({
                        action: Animation.Actions.appear,
                        duration: 1000
                    });
                }),
                act2 = animation2.start({
                    action: Animation.Actions.blink,
                    duration: 3000,
                    count: 3
                }).then(function () {
                    return animation2.start({
                        action: function (element, progress) {
                            element.style.visibility = 'visible';
                        },
                        duration: 0
                    });
                }).then(function () {
                    return animation2.start({
                        action: Animation.Actions.move,
                        displacementFunction: easeInOut,
                        duration: 2000,
                        destination: screenCenter
                    });
                });

            $.when(act1, act2).then(function () {
                return $.when(animation1.start({
                    action: Animation.Actions.circleMotion,
                    duration: 1000,
                    radian: Math.PI,
                    center: {
                        x: screenCenter.x,
                        y: screenCenter.y - 100
                    }
                }), animation2.start({
                    action: Animation.Actions.circleMotion,
                    duration: 1000,
                    radian: Math.PI,
                    center: {
                        x: screenCenter.x,
                        y: screenCenter.y + 100
                    }
                }));
            }).then(function () {
                animation1.start({
                    action: Animation.Actions.circleMotion,
                    duration: 2000,
                    radian: 2 * Math.PI,
                    center: screenCenter
                }).then(function () {
                    return animation1.start({
                        action: Animation.Actions.scaling,
                        duration: 1000,
                        scale: 2
                    });
                });
                animation2.start({
                    action: Animation.Actions.circleMotion,
                    duration: 2000,
                    radian: 2 * Math.PI,
                    center: screenCenter
                }).then(function () {
                    return animation2.start({
                        action: Animation.Actions.scaling,
                        duration: 2000,
                        scale: 0.5
                    });
                });
            });
        }, 0);
    });
})();
