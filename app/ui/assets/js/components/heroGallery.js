import { getPrefixed } from '@utility/vendor';
import { debounce } from '@utility/debounce';
import isMobile from '@utility/isMobile';

const galleryHolder = $('#hero-gallery');
const list = galleryHolder.find('.list-holder');
const items = galleryHolder.find('.item-holder');

const currentCountHolder = $('#current-count');
const arrowsHolder = $('#arrows-holder');

const transition = getPrefixed('transition');
const transform = getPrefixed('transform');

const mousedown = isMobile() ? 'touchstart' : 'mousedown';
const mousemove = isMobile() ? 'touchmove': 'mousemove';
const mouseup = isMobile() ? 'touchend' : 'mouseup';
const mouseleave = isMobile() ? 'touchleave': 'mouseleave';

const KEYUP_CODE = 38;
const KEYDOWN_CODE = 40;

const ANIMATION_TIME = 400;

class HeroGallery{

    constructor(){
        this.isEnabled = false;
        this.isDragging = false;
        this.isAnimated = false;

        this.threshold = isMobile() ? 25 : 150;

        this.coords = {};
        this.dimension = {};
        this.positionY = '';

        this.direction = '';

        this.count = items.length;
        this.current = 0;

        this.setDimension();

        this._UIevents();
    }

    _UIevents(){
        galleryHolder.on(mousedown, (e) => this.dragStart(e))
                     .on(mousemove, (e) => this.dragMove(e))
                     .on(mouseup, (e) => this.dragEnd(e))
                     .on(mouseleave, (e) => this.dragEnd(e));
        
        arrowsHolder.on('click', '.arrow', (e) => this.handleArrow(e));        

        $(document).on('keydown', (e) => this.handleKey(e));

        $(window)
            .on('mousewheel DOMMouseScroll', (e) => this.handleScroll(e))
            .on('resize', (e) => this.resize(e));
    }

    setDimension(){
        this.dimension = {
            w: items.innerWidth(),
            h: items.innerHeight()
        }
    }

    setPosition(diff = 0){
        this.positionY = ((this.current * this.dimension.h) - diff) * -1;
    }

    dragStart(e){
        if(!this.isEnabled || this.isAnimated) return;

        this.isDragging = true;
        this.isAnimated = true;

        let event = e.originalEvent,
            pageY = event.changedTouches ? event.changedTouches[0].pageY : event.pageY;

        this.coords.sy = pageY;

        if(!isMobile())
            galleryHolder.addClass('__drag-start');

        return false;
    }

    dragMove(e){
        e.preventDefault();

        if(!this.isDragging || !this.isEnabled) return;

        let event = e.originalEvent,
            pageY = event.changedTouches ? event.changedTouches[0].pageY : event.pageY;

        this.coords.dy = pageY - this.coords.sy;

        this.direction = (this.coords.dy <= 0) ? 'bottom' : 'top';

        if((this.current === 0) && (this.direction === 'top')) this.coords.dy /= 5;
        if((this.current === this.count - 1) && (this.direction === 'bottom')) this.coords.dy /= 5;

        this.setPosition(this.coords.dy);

        this.switchSlide();

        return false;
    }

    dragEnd(e){
        if(!this.isDragging || !this.isEnabled) return;

        this.isDragging = false;

        if(this.checkThreshold()){

            this.updateCurrent();
        }

        this.updateBoundaries();

        this.setPosition();

        this.switchSlide(true);

        this.clearAnimation();

        if(!isMobile())
            galleryHolder.removeClass('__drag-start');

        return false;
    }

    handleArrow(e){
        if(!this.isEnabled || this.isAnimated) return;

        this.isAnimated = true;

        let target = $(e.currentTarget);

        this.direction = target.hasClass('arrow-bottom') ? 'bottom' : 'top';

        this.updateCurrent();

        this.updateBoundaries();

        this.setPosition();

        this.switchSlide(true);

        this.clearAnimation();

        return false; 
    }

    handleKey(e){
        if(!this.isEnabled || this.isAnimated) return;

        if(e.which !== KEYUP_CODE && e.which !== KEYDOWN_CODE) return;

        this.isAnimated = true;

        let keyCode = e.which;

        if(keyCode === KEYUP_CODE) this.direction = 'top';
        if(keyCode === KEYDOWN_CODE) this.direction = 'bottom';

        this.updateCurrent();

        this.updateBoundaries();

        this.setPosition();

        this.switchSlide(true);

        this.clearAnimation();

        return false;
    }

    handleScroll(e){

        debounce(60, () => {

            if(!this.isEnabled || this.isAnimated) return;

            this.isAnimated = true;

            let delta = e.originalEvent.wheelDelta || e.originalEvent.detail * -1;

            this.direction = delta > 0 ? 'top' : 'bottom';

            this.updateCurrent();

            this.updateBoundaries();

            this.setPosition();

            this.switchSlide(true);

            this.clearAnimation();

        });

        return false;
    }

    resize(e){

        this.setDimension();
        this.setPosition();
        this.switchSlide();

        return false;
    }

    checkThreshold(){
        return (Math.abs(this.coords.dy) >= this.threshold) ? true : false;
    }

    updateCurrent(){
        if(this.direction === 'bottom') this.current++;
        if(this.direction === 'top') this.current--;
    }

    updateBoundaries(){
        if(this.current <= 0) this.current = 0;
        if(this.current >= this.count - 1) this.current = this.count - 1;
    }

    switchSlide(hasTransition = false){
        list.css({
            transition: hasTransition ? 'all .4s ease-in-out 0s' : 'none',
            transform: 'translateY('+ this.positionY +'px)'
        });

        this.updateActiveClass();
        this.updateCounter();
    }

    updateActiveClass(){
        items.removeClass('active').eq(this.current).addClass('active');
    }

    updateCounter(){
        currentCountHolder.html(this.current + 1);
    }

    clearAnimation(){
        let timeoutID = setTimeout(() => {
            this.isAnimated = false;
            clearTimeout(timeoutID);
        }, ANIMATION_TIME);
    }

}

export default HeroGallery;