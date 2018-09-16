const body = $('body');

class Loader{

    constructor(options){
        if(!options.el)
            throw new Error('Loader requires el to be set');

        this.el = $(options.el);
        this.time = options.time;

        this._UIevents();       
    }

    _UIevents(){
        $(window).on('load', (e) => this.loaded(e));
    }

    loaded(e){
        body.removeClass('preload');

        let timer = setTimeout(() => {

            this.el.addClass('__loaded');
            clearTimeout(timer);

        }, this.time);

        return false;
    }
}

export default Loader;