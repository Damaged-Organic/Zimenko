import { EventEmitter } from 'events';

import isMobile from '@utility/isMobile';

import * as homeConstants from '@constants/homeConstants';

const page = $('#page');

const click = isMobile() ? 'touchstart': 'click';

class Menu extends EventEmitter{

    constructor(){
        super();
        
        this.isActive = false;
        
        this._UIevents();
    }

    _UIevents(){
        page.on(click, '.open-menu-button', (e) => this.open(e))
            .on(click, '.close-menu-button', (e) => this.close(e));
    }

    open(e){
        if(this.isActive) return;

        this.isActive = !this.isActive;

        page.addClass('__menu-active');

        this.emitChange();

        return false;
    }

    close(e){
        if(!this.isActive) return;

        this.isActive = !this.isActive;

        page.removeClass('__menu-active');

        this.emitChange();

        return false;
    }

    emitChange(){
        this.emit(homeConstants.TOGGLE_MENU, {
            isActive: this.isActive
        });
    }
}

export default Menu;