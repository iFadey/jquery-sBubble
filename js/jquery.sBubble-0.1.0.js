(function ($) {
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


        var $elm = this,
            $box = $('<div class="sBubble"></div>').html(options.content)
                                                   .addClass(options.position + ' ' + options.theme),
            $arw = $('<div class="sBubbleArw"> </div>').addClass(options.position + ' ' + options.theme),
            setPosTimeout = null;


        function getPos(obj) {
            var curleft = curtop = 0;

            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            }

            return {
                left: curleft,
                top: curtop
            };

        } // end getPos()


        function getBoxArwPos() {
            var elmPos = getPos($elm[0]),
                pos = {
                    top    : options.topOffset,
                    arwTop : 0,
                    left   : options.leftOffset,
                    arwLeft: 0
                },
                elmOuterHeight = $elm.outerHeight(),
                elmOuterWidth = $elm.outerWidth(),
                boxOuterHeight = $box.outerHeight(),
                boxOuterWidth = $box.outerWidth(),
                arwOuterHeight = $arw.outerHeight(),
                arwOuterWidth = $arw.outerWidth();

            if (options.position === 'top' || options.position === 'bottom') {
                pos.left += elmPos.left + (elmOuterWidth - boxOuterWidth) / 2;
                pos.arwLeft = pos.left + (boxOuterWidth - arwOuterWidth) / 2;
            }

            if (options.position === 'left' || options.position === 'right') {
                pos.top += elmPos.top + (elmOuterHeight - boxOuterHeight) / 2;
                pos.arwTop = pos.top + (boxOuterHeight - arwOuterHeight) / 2;
            }

            if (options.position === 'top') {
                pos.top += elmPos.top - boxOuterHeight - arwOuterHeight;
                pos.arwTop = pos.top + boxOuterHeight;
            } else if (options.position === 'bottom') {
                pos.top += elmPos.top + elmOuterHeight + arwOuterHeight;
                pos.arwTop = pos.top - arwOuterHeight;
            } else if (options.position === 'left') {
                pos.left += elmPos.left - boxOuterWidth - arwOuterWidth;
                pos.arwLeft = pos.left + boxOuterWidth;
            } else if (options.position === 'right') {
                pos.left += elmPos.left + elmOuterWidth + arwOuterWidth;
                pos.arwLeft = pos.left - arwOuterWidth;
            }

            return pos;
        }


        function setPosition() {
            var pos = getBoxArwPos();

            $box.css({
                top   : pos.top + 'px',
                left  : pos.left + 'px'
            });

            $arw.css({
                top  : pos.arwTop + 'px',
                left : pos.arwLeft + 'px'
            });
        }


        $(window).resize(function () {
            clearTimeout(setPosTimeout);
            setPosTimeout = setTimeout(setPosition, 100);
        });


        $box.css({
                display: 'none',
                height: options.height + 'px',
                width : options.width + 'px'
            })
            .appendTo('body');


        $arw.css('display', 'none')
            .appendTo('body');


        //position the tooltip
        setPosition();


        $elm.hover(
            function () {
                $box.css('display', 'block');
                $arw.css('display', 'block');

                setTimeout(function () {
                    $box.addClass('visible');
                    $arw.addClass('visible');
                }, 50);
            },
            function () {
                $box.removeClass('visible');
                $arw.removeClass('visible');

                setTimeout(function () {
                    $box.css('display', 'none');
                    $arw.css('display', 'none');
                }, 100);
            }
        );


    }; //end sBubble function
}(jQuery));
