import { EventEmitter } from 'events';

import isMobile from '@utility/isMobile';

import * as homeConstants from '@constants/homeConstants';

const HOLD_TIME = 2000;

const page = $('#page');

const mousedown = isMobile() ? 'touchstart': 'mousedown';
const mouseup = isMobile() ? 'touchend' : 'mouseup';
const mouseleave = isMobile() ?  'touchleave' : 'mouseleave';
const click = isMobile() ? 'touchstart' : 'click';

class Hold extends EventEmitter{

    constructor(){
        super();

        this.isHold = false;
        this.isActive = false;
        this.timer = null;

        this._UIevents();
    }

    _UIevents(){
        page.on(mousedown, '.intro-holder', (e) => this.start(e))
            .on(mouseup, '.intro-holder', (e) => this.end(e))
            .on(mouseleave, '.intro-holder', (e) => this.end(e))
            .on(click, '.hold-close', (e) => this.close(e));
    }

    start(e){
        this.isHold = true;

        page.addClass('__hold-start');

        this.timer = setTimeout(() => {

            this.toggleActive();

            page.addClass('__hold-active');

            this.emitChange();

        }, HOLD_TIME);

        return false;
    }

    end(e){
        if(!this.isHold) return;

        page.removeClass('__hold-start');
        clearTimeout(this.timer);

        return false;
    }

    close(e){
        if(!this.isActive) return;

        this.toggleActive();

        page.removeClass('__hold-active');

        this.emitChange();

        return false;
    }

    toggleActive(){
        this.isActive = !this.isActive;
    }

    emitChange(){
        this.emit(homeConstants.HOLD_ACTIVE, {
            isActive: this.isActive
        });
    }

}

export default Hold;