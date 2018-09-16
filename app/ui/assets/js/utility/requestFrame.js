const fps = 1000 / 60;
const vendors = ['ms', 'moz', 'webkit', 'o'];

(() => {

    vendors.map((vendor) => {
        if(window.requestAnimationFrame) return;

        window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
    });

    if(!window.requestAnimationFrame)
        window.requestAnimationFrame = (cb, el) => window.setTimeout(cb, fps);

    if(!window.cancelAnimationFrame)
        window.cancelAnimationFrame = (id) => clearTimeout(id);

})();