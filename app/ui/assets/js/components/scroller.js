import { EventEmitter } from 'events';

import { debounce } from '@utility/debounce';

import { normalizeScroll } from '@utility/normalizeScroll';
import { getPrefixed } from '@utility/vendor';

const galleryHolder = $('#gallery-holder');
const galleryList = $('#gallery-list');
const galleryItems = galleryList.find('.gallery-item');
const galleryItemsCount = galleryItems.length;

const progress = $('#progress-holder > .progress-line');

const transition = getPrefixed('transition');
const transform = getPrefixed('transform');

const KEYS = [37, 39]; 

class Scroller extends EventEmitter{

    constructor(){
        super();
        
        this.isPressed = false;
        this.isAnimated = false;

        this.dimension = this.getDimension();
        this.totalWidth = this.getTotalWidth();

        this.coords = {};
        this.direction = null;
        this.position = 0;
        this.progressPercent = 0;

        this.current = 0;

        this._UIevents();

        this.setCSS();    
    }
    _UIevents(){
        $(document)
            .on('mousewheel DOMMouseScroll', (e) => this.handleMouseWheel(e))
            .on('keydown', (e) => this.handleKeyDown(e));

        $(window).on('resize', (e) => this.handleResize(e));
    }
    getDimension(){
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    }
    getTotalWidth(){
        return this.dimension.w * (galleryItemsCount - 1);
    }
    setCSS(){
        let width = galleryItemsCount * 100;

        galleryList.css({ width: width + '%' });
    }
    handleMouseWheel(e){
        if(this.isAnimated) return;

        debounce(60, () => {
            let delta = normalizeScroll(e.originalEvent);

            this.eventType = 'wheel';

            this.direction = (delta < 0) ? 'right' : 'left';

            this.updateCurrent();

            this.checkBoundaries();

            this.updatePosition();

            this.updateProgressPercent();

            this.animate();
        });
        
        return false;
    }
    handleKeyDown(e){
        let currentKey = e.originalEvent.which;

        if(!KEYS.includes(currentKey)) return;

        this.direction = (currentKey === KEYS[0]) ? 'left': 'right';

        this.updateCurrent();

        this.checkBoundaries();

        this.updatePosition();

        this.updateProgressPercent();

        this.animate();

        return false;
    }
    handleResize(e){
        this.dimension = this.getDimension();
        this.totalWidth = this.getTotalWidth();

        this.setCSS();

        this.position = this.totalWidth / 100 * this.progressPercent;

        this.animate();

        return false;
    }
    updateCurrent(){
        (this.direction === 'left') ? this.current-- : this.current++;
    }
    checkBoundaries(){
        if(this.current <= 0) this.current = 0;
        if(this.current >= galleryItemsCount - 1) this.current = galleryItemsCount - 1;
    }
    updatePosition(){
        this.position = this.current * this.dimension.w;
    }
    updateProgressPercent(){
        this.progressPercent = (this.position / this.totalWidth);
    }
    animate(){
        this.isAnimated = true;

        galleryList.css({ transform: 'translateX('+ (this.position * -1) +'px)' });
        progress.css({ transform: 'scaleX('+ (this.progressPercent) +')' });

        let timeoutID = setTimeout(() => {
            this.isAnimated = false;
            clearTimeout(timeoutID);
        }, 800);
    }

}

export default Scroller;