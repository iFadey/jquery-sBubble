/**
 *  jQuery sBubble Plugin v0.1.1
 *
 *  Author   : Fawad Hassan
 *  Home Page: http://www.ifadey.com/2013/01/sbubble-jquery-css3-tooltip-plugin/
 *  GitHub   : https://github.com/iFadey/jquery-sBubble
 */
(function ($) {
    var Bubble = function (elm, options) {
        var self = this,
            setPosTimeout = null;

        self.$elm = $(elm);
        self.opts = options;
        self.$box = $('<div class="sBubble"></div>').html(options.content)
                                               .addClass(options.position + ' ' + options.theme);
        self.$arw = $('<div class="sBubbleArw"> </div>').addClass(options.position + ' ' + options.theme);


        function rePosition() {
            clearTimeout(setPosTimeout);
            setPosTimeout = setTimeout(function () {
                self.setPosition();
            }, 100);
        }

        $(window).resize(rePosition);
        $('html *').scroll(rePosition);

        self.$box.css({
                display: 'none',
                height: options.height + 'px',
                width : options.width + 'px'
            })
            .appendTo('body');


        self.$arw.css('display', 'none')
            .appendTo('body');


        //position the tooltip
        self.setPosition();

        if ( options.onready ){
         
            self.$elm.ready(
                function () {
                    self.$box.css('display', 'block');
                    self.$arw.css('display', 'block');

                    // delay to show it.
                    setTimeout(function () {
                        self.$box.addClass('visible');
                        self.$arw.addClass('visible');
                        
                        // remove after a period of time if option "time" set
                        if ( options.time ){
                            setTimeout(function () {
                                self.$box.removeClass('visible');
                                self.$arw.removeClass('visible');
                            }, options.time );
                        }
                        
                    }, options.delay || 1000 );
                }
            );
        }

        self.$elm.hover(
            function () {
                self.$box.css('display', 'block');
                self.$arw.css('display', 'block');

                setTimeout(function () {
                    self.$box.addClass('visible');
                    self.$arw.addClass('visible');
                }, 50);
            },
            function () {
                self.$box.removeClass('visible');
                self.$arw.removeClass('visible');

                setTimeout(function () {
                    self.$box.css('display', 'none');
                    self.$arw.css('display', 'none');
                }, 100);
            }
        );

    }; //end Bubble

    Bubble.prototype.destroy = function () {
        var self = this;
        self.$box.remove();
        self.$arw.remove();
        self.$elm.off('mouseenter mouseleave');
    };

    Bubble.prototype.getBoxArwPos = function () {
        var self = this,
            elmPos = self.$elm.offset(),
            pos = {
                top    : self.opts.topOffset,
                arwTop : 0,
                left   : self.opts.leftOffset,
                arwLeft: 0
            },
            elmOuterHeight = self.$elm.outerHeight(),
            elmOuterWidth = self.$elm.outerWidth(),
            boxOuterHeight = self.$box.outerHeight(),
            boxOuterWidth = self.$box.outerWidth(),
            arwOuterHeight = self.$arw.outerHeight(),
            arwOuterWidth = self.$arw.outerWidth();

        $distance = self.opts.distance || 0;

        if (self.opts.position === 'top' || self.opts.position === 'bottom') {
            pos.left += elmPos.left + (elmOuterWidth - boxOuterWidth) / 2;
            pos.arwLeft = pos.left + (boxOuterWidth - arwOuterWidth) / 2;
        }

        if (self.opts.position === 'left' || self.opts.position === 'right') {
            pos.top += elmPos.top + (elmOuterHeight - boxOuterHeight) / 2;
            pos.arwTop = pos.top + (boxOuterHeight - arwOuterHeight) / 2;
        }

        if (self.opts.position === 'top') {
            pos.top += elmPos.top - boxOuterHeight - arwOuterHeight - $distance;
            pos.arwTop = pos.top + boxOuterHeight;
        } else if (self.opts.position === 'bottom') {
            pos.top += elmPos.top + elmOuterHeight + arwOuterHeight + $distance;
            pos.arwTop = pos.top - arwOuterHeight;
        } else if (self.opts.position === 'left') {
            pos.left += elmPos.left - boxOuterWidth - arwOuterWidth - $distance;
            pos.arwLeft = pos.left + boxOuterWidth;
        } else if (self.opts.position === 'right') {
            pos.left += elmPos.left + elmOuterWidth + arwOuterWidth + $distance;
            pos.arwLeft = pos.left - arwOuterWidth;
        }

        return pos;
    }; //end getBoxArwPos


    Bubble.prototype.setPosition = function () {
        var self = this,
            pos = self.getBoxArwPos();

        self.$box.css({
            top   : pos.top + 'px',
            left  : pos.left + 'px'
        });

        self.$arw.css({
            top  : pos.arwTop + 'px',
            left : pos.arwLeft + 'px'
        });
    }; //end setPosition


    $.fn.sBubble = function (options) {

        options = $.extend({
            content    : '',
            width      : 120,
            height     : 60,
            leftOffset : 0,
            topOffset  : 0,
            position   : 'top',
            theme      : 'black'
        }, options);

        options.width = typeof options.width === 'string' ? parseInt(options.width, 10) : options.width;
        options.height = typeof options.height === 'string' ? parseInt(options.height, 10) : options.height;
        options.leftOffset = typeof options.leftOffset === 'string' ? parseInt(options.leftOffset, 10) : options.leftOffset;
        options.topOffset = typeof options.topOffset === 'string' ? parseInt(options.topOffset, 10) : options.topOffset;

        return this.each(function () {
            var plugin = $.data(this, "plugin_sbubble");
            if (!plugin) {
                $.data(this, "plugin_sbubble", new Bubble( this, options ));
            }
            else {
                plugin.destroy();
                $.data(this, "plugin_sbubble", new Bubble( this, options ));
            }
        });


    }; //end $.fn.sBubble

}(jQuery));
