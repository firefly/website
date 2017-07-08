function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

var resize = (function() {
    var resizeTimer = null;
    var resizeFunc = null;
    function resize(fn) {
        if (!resizeFunc) { return; }
        if (resizeTimer) { clearTimeout(resizeTimer); }
        resizeTimer = setTimeout(function() {
            resizeTimer = null;
            console.log('resized');
            if (resizeFunc) { resizeFunc(); }
        }, 25);
    }

    window.addEventListener('resize', function() {
        resize();
    });

    return function(func) {
        resizeFunc = func
    };
})();

