(function ($, window) {
    
    $.jqMotion = function (opt) {
        var options = {
            main: $(document),
            leap: {
                enableGestures: true
            }
        },
            defaultOptions = $.extend({}, options, opt);

        var controller = new Leap.Controller(defaultOptions.leap);

        $(document).data({
            jqMotion: {
                jqController: controller,
                grabbed: [],
                grabRelease: []
            }
        });

        controller.on('frame', function (data) {
            defaultOptions.main.trigger({
                type: 'jqMotion',
                frame: data
            });
            if (data.gestures && data.gestures.length) {
                gestureHandler(data.gestures, defaultOptions.main);
            }
            customGestures(data, defaultOptions.main);
        });

        controller.connect();

        return controller;
    };

    $.fn.jqMotion = function (opt) {
        var self = this,
            $docData = $(document).data(),
            $sData = self.data(),
            opts = {
                pointer: self,
                constrain: true,
                gestures: true,
                hand: 0,
                container: self.parent(),
                trackMotion: true,
                action: 'motion'
            };

        var options = $.extend({}, opts, opt);
        var controller = $docData.jqMotion.jqController;
        $sData.jqMotion = {};
        $sData.jqMotion.grabed = [];
        $sData.jqMotion.grabRelease = [];

        options.container.css({
            'position': 'relative'
        });
        self.css({
            'position': 'absolute'
        });

        //Setting a variable to track hand's motions
        $sData.trackMotion = options.trackMotion;

        controller.on('frame', function (data) {
            if (data.hands.length && data.hands[options.hand]) {
                var pos = leapToScene(data, data.hands[options.hand].palmPosition, options);
                if ($sData.trackMotion) {
                    self.css({
                        'left': Math.round(pos.left) + 'px',
                        'top': Math.round(pos.top) + 'px'
                    });
                }
            }
            if (options.gestures && data.gestures && data.gestures.length && data.hands.length && data.hands[options.hand]) {
                gestureHandler(data.gestures, options.pointer);
            }
        });

        return self;
    };


    var gestureHandler = function (gestures, main) {
        for (var i = 0, len = gestures.length; i < len; i++) {
            var type = gestures[i].type,
                self = this,
                gest = gestures[i];
            switch (type) {
            case 'swipe':

                var direction = gest.direction;

                main.trigger('swipe', [gest]);

                if (Math.abs(direction[0]) > Math.abs(direction[1])) { // Moving on X Axis
                    if (direction[0] > 0) {
                        main.trigger('swipeRight', [gest]);
                    } else {
                        main.trigger('swipeLeft', [gest]);
                    }

                } else if (Math.abs(direction[0]) < Math.abs(direction[1])) { //Moving on Y Axis
                    if (direction[1] > 0) {
                        main.trigger('swipeUp', [gest]);
                    } else {
                        main.trigger('swipeDown', [gest]);
                    }
                }

                break;
            case 'keyTap':
                main.trigger('keyTap', [gest]);
                break;
            case 'screenTap':
                main.trigger('screenTap', [gest]);
                break;
            case 'circle':
                main.trigger('circle', [gest]);

                if (gest.normal[2] <= 0) {
                    main.trigger('circleRight', [gest]);
                } else {
                    main.trigger('circleLeft', [gest]);
                }

                break;
            default:
                main.trigger(type);
            }
        }
    };

    var customGestures = function (data, main) {
        var handId = null;
        if (data.hands.length) {
            for (var i = 0, len = data.hands.length; i < len; i++) {
                if (data.hands[i].pointables.length === 5) {
                    handId = data.hands[i].id;
                    if (main.data().jqMotion.grabRelease.indexOf(handId) !== -1) {
                        main.data().jqMotion.grabRelease.splice(main.data().jqMotion.grabRelease.indexOf(handId), 1);
                        main.trigger('grabRelease', [data]);
                    }
                }
            }
            if (handId && main.data().jqMotion.grabbed.indexOf(handId) === -1) {
                main.data().jqMotion.grabbed.push(handId);
                setTimeout(function () {
                    getNextFrame(handId, main);
                }, 1000);
            }
        }
    };

    var getNextFrame = function (id, main) {
        var controller = main.data().jqController;
        $(document).one('jqMotion', function (data) {
            var hands = data.frame.hands;
            if (hands.length) {
                for (var i = 0, len = hands.length; i < len; i++) {
                    if (hands[i].id === id && hands[i].pointables.length < 2) { //This fixes the fact that Leap Motion sees one finger even though none are showing
                        main.trigger('grab', [data]);
                        main.data().jqMotion.grabbed.splice(main.data().jqMotion.grabbed.indexOf(id), 1);
                        main.data().jqMotion.grabRelease.push(id);
                        return false;
                    }
                }
            }
            main.data().jqMotion.grabbed.splice(main.data().jqMotion.grabbed.indexOf(id), 1);
        });
    };

    var leapToScene = function (frame, leapPos, options) {
        var iBox = frame.interactionBox,
            left = iBox.center[0] - iBox.size[0] / 2,
            top = iBox.center[1] + iBox.size[1] / 2,
            x = leapPos[0] - left,
            y = leapPos[1] - top,
            z = leapPos[2],
            info = {
                width: options.container.width(),
                height: options.container.height(),
                pointerW: options.pointer.width(),
                pointerH: options.pointer.height()
            };

        x /= iBox.size[0];
        y /= iBox.size[1];

        x *= info.width;
        y *= info.height;

        if (options.constrain) {
            x = x + info.pointerW > info.width ? (info.width - info.pointerW) : x;
            x = x < 0 ? 0 : x;
            y = -y <= 0 ? 0 : y;
            y = -y + info.pointerH > info.height ? (-info.height + info.pointerH) : y;
        }
        options.pointer.trigger({
            type: options.action,
            top: -y,
            left: x,
            z: z
        });
        return {
            top: -y,
            left: x,
            z: z
        };
    };

})(jQuery, window);