const galleryHolder = $('#gallery-holder');
const galleryItems = galleryHolder.find('.gallery-item');

class ColorizeLookbook{

    constructor(){
        this._UIevents();
    }
    _UIevents(){
        $(window).on('scroll', (e) => this.handleScroll(e));
    }
    handleScroll(e){
        let scrollY = $(window).scrollTop(),
            factor = window.innerHeight / 2,
            elOffsetTop = 0,
            elHeight = 0, 
            position = 0,
            diff = 0;

        galleryItems.each((index, el) => {

            el = $(el);

            elOffsetTop = el.offset().top;
            elHeight = el.height();

            position = scrollY + factor;

            diff = elOffsetTop - position;

            if(diff <= 0 && position <= (elOffsetTop + elHeight)){
                el.addClass('__colorized').siblings().removeClass('__colorized');
            }
            
        });

    }
}

export default ColorizeLookbook;