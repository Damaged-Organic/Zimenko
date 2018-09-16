import { EventEmitter } from 'events';

import PhotoView from '@components/photoView';

import isMobile from '@utility/isMobile';
import { getPrefixed } from '@utility/vendor';
import { debounce } from '@utility/debounce';
import { normalizeScroll } from '@utility/normalizeScroll';

const galleryHolder = $('.gallery-holder');
const gallery = $('#gallery');
const galleryList = gallery.find('.gallery-list');
const galleryItems = gallery.find('.gallery-item');
const itemCount = galleryItems.length;

const arrows = galleryHolder.find('.arrow');

const KEY_LEFT = 37;
const KEY_RIGHT = 39;

const mousedown = isMobile() ? 'touchstart' : 'mousedown';
const mousemove = isMobile() ? 'touchmove' : 'mousemove';
const mouseup = isMobile() ? 'touchend' : 'mouseup';
const mouseleave = isMobile() ? 'touchleave' : 'mouseleave';

class Gallery extends EventEmitter{

    constructor(){
        super();
        
        this.isDragged = false;
        this.isPreview = false;
        this.isInfoActive = false;

        this.time = {};
        this.coords = {};
        
        this.direction = '';
        this.dimension = this.getDimension();

        this.current = 0;
        this.currentTarget = null;

        this.threshold = isMobile() ? 25 : 150;
        this.clickThreshold = 150;

        this.friction = 5;

        this.identifyOrientation();

        this.applyCommonCSS();

        this._UIevents();
    }
    _UIevents(){
        gallery.on(mousedown, (e) => this.handleMouseDown(e))
               .on(mousemove, (e) => this.handleMouseMove(e))
               .on(mouseup, (e) => this.handleMouseUp(e))
               .on(mouseleave, (e) => this.handleMouseUp(e));

        arrows.on('click', (e) => this.handleArrow(e));

        if(!isMobile()){
            gallery.on('click', '.photo-holder', (e) => this.handlePhotoView(e));

            $(document)
                .on('keydown', (e) => this.handleKey(e))
                .on('mousewheel DOMMouseScroll', (e) => this.handleWheel(e));
        }
        
        $(window).on('resize', (e) => this.handleResize(e));
    }
    setInfoState(state){
        this.isInfoActive = state;
    }
    getDimension(){
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    }
    identifyOrientation(){
        const imageList = gallery.find('img');

        imageList.each((index, img) => {
            img = $(img);
            
            const parent = img.closest('.photo-holder');
            const image = new Image();

            image.onload = () => (image.width >= image.height) ? parent.addClass('landscape') : parent.addClass('portrait');

            image.src = img.attr('src');
        });
    }
    applyCommonCSS(){
        galleryList.css({ width: itemCount * 100 + '%' });
    }
    handleMouseDown(e){
        if(this.isAnimated || this.isInfoActive) return;

        let x = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX;

        this.isDragged = true;

        this.time.start = Date.now();

        this.coords.sx = x;

        return false;
    }
    handleMouseMove(e){
        if(!this.isDragged || this.isInfoActive) return;

        let x = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX;

        this.coords.dx = x - this.coords.sx;

        this.direction = (this.coords.dx < 0) ? 'left' : 'right';

        if((this.current <= 0 && this.direction === 'right') || (this.current >= itemCount - 1 && this.direction === 'left'))
            this.coords.dx /= this.friction;

        let position = this.calculatePosition(this.coords.dx);

        this.switchSlide(position, false);

        return false;
    }
    handleMouseUp(e){
        if(!this.isDragged || this.isAnimated || this.isInfoActive) return;

        let x = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX;

        this.time.diff = Date.now() - this.time.start;

        this.coords.ex = Math.abs(x - this.coords.sx);

        if((this.coords.ex >= this.threshold) && (this.time.diff >= this.clickThreshold)){

            this.updateCurrent();

            this.checkBoundaries();

        }

        let position = this.calculatePosition();

        this.isAnimated = true;
        this.switchSlide(position);
        this.clearAnimation();
        
        this.isDragged = false;

        return false;
    }
    handlePhotoView(e){
        if(this.isInfoActive) return;
        
        if(this.time.diff >= this.clickThreshold) return;

        this.isPreview = true;

        let target = $(e.currentTarget),
            src = target.data('src');

        let photoView = new PhotoView(src);

        photoView.on('close', () => {
            this.isPreview = false;
        });

        return false;
    }
    handleArrow(e){
        if(this.isAnimated || this.isInfoActive) return;

        let target = $(e.currentTarget);

        this.direction = target.hasClass('arrow-right') ? 'left' : 'right';

        this.updateCurrent();

        this.checkBoundaries();

        let position = this.calculatePosition();

        this.isAnimated = true;
        this.switchSlide(position);
        this.clearAnimation();

        return false;
    }
    handleKey(e){
        if(this.isAnimated || this.isPreview || this.isInfoActive) return;

        let keyCode = e.originalEvent.keyCode;

        if(keyCode !== KEY_LEFT && keyCode !== KEY_RIGHT) return;

        this.direction = (keyCode === KEY_RIGHT) ? 'left' : 'right';

        this.updateCurrent();

        this.checkBoundaries();

        let position = this.calculatePosition();

        this.isAnimated = true;
        this.switchSlide(position);
        this.clearAnimation();

        return false;
    }
    handleWheel(e){
        if(this.isAnimated || this.isPreview || this.isInfoActive) return;

        debounce(60, () => {
            let delta = normalizeScroll(e.originalEvent);

            this.direction = (delta < 0) ? 'left' : 'right';

            this.updateCurrent();

            this.checkBoundaries();

            let position = this.calculatePosition();

            this.isAnimated = true;
            this.switchSlide(position);
            this.clearAnimation();

        });

        return false;
    }
    handleResize(e){
        this.dimension = this.getDimension();

        let position = this.calculatePosition();

        this.switchSlide(position, false);

        return false;
    }
    updateCurrent(){
        if(this.direction === 'left') this.current++;
        if(this.direction === 'right') this.current--;
    }
    checkBoundaries(){
        if(this.current < 0) this.current = 0;
        if(this.current >= itemCount - 1) this.current = itemCount - 1;
    }
    calculatePosition(diff = 0){
        return ((this.current * this.dimension.w) - diff) * -1;
    }
    switchSlide(position = 0, hasTransition = true){
        galleryList.css({
            transition: hasTransition ? 'all .4s ease-in-out' : 'none',
            transform: 'translateX('+ position +'px)'
        });
    }
    clearAnimation(){
        let timer = setTimeout(() => {
            this.isAnimated = false;
            clearTimeout(timer);
        }, 400);
    }

}

export default Gallery;