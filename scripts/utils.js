function ready(fn) {
    var done = false;
    function func() {
        if (done) { return; }
        done = false;
        setTimeout(fn, 0);
    }
    if (document.readyState != 'loading') {
        func();
    } else {
        document.addEventListener('DOMContentLoaded', func);
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

