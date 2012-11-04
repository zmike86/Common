/**
 * Created with JetBrains WebStorm.
 * User: Leo
 * Date: 12-11-4
 * Time: 下午9:01
 * To change this template use File | Settings | File Templates.
 */

;

(function(global) {

    var readyList = [],
        isReady = false, // the only switcher
        exists = false,
        i, top = false,
        DOMContentLoaded = function() {
            if (document.addEventListener) {
                document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
                ready();
            } else if (document.readyState === 'complete') {
                // readyState === 'complete' in oldIE is good enough for us to call the dom ready!
                document.detachEvent('onreadystatechange', DOMContentLoaded);
                ready();
            }
        },
        ready = function() {
            // Abort if we're already ready
            if (isReady) {
                return;
            }
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (!document.body) {
                return setTimeout(ready, 1);
            }
            // Remember that the DOM is ready
            isReady = true;
            for (i=0; i<readyList.length; i++) {
                readyList[i]();
            }
            // clear
            readyList.length = 0;
        };


    var wrapper = function (fn) {
        for (i=0; i<readyList.length; i++) {
            if (readyList[i] === fn) {
                exists = true;
            }
        }
        if (!exists) {
            readyList.push(fn);
        }
        exists = false;

        // Catch cases where ready() is called after the browser event has already occurred.
        // we once tried to use readyState "interactive" here, but it caused issues like the one
        // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
        if (document.readyState === 'complete') {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            setTimeout(ready, 1);

        } else if (document.addEventListener) {
            // Standards-based browsers support DOMContentLoaded
            // Use the handy event callback
            document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
            // A fallback to window.onload, that will always work
            window.addEventListener('load', ready, false);

        }
        else {
            // If IE event model is used
            // Ensure firing before onload, maybe late but safe also for iframes
            document.attachEvent('onreadystatechange', DOMContentLoaded);
            // A fallback to window.onload, that will always work
            window.attachEvent('onload', ready);

            // If IE and not a frame
            // continually check to see if the document is ready
            try {
                top = (window.frameElement == null && document.documentElement);
            } catch(e) {}

            if (top && top.doScroll) {
                (function doScrollCheck() {
                    if (!isReady) {
                        try {
                            // Use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            top.doScroll('left');
                        } catch(e) {
                            return setTimeout(doScrollCheck, 50);
                        }

                        // and execute waiting functions
                        ready();
                    }
                })();
            }
        }
    };

    global.domReady = wrapper;

}).call(this);
