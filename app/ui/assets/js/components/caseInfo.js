import { EventEmitter } from 'events';

import { TOGGLE_INFO } from '@constants/homeConstants';

const ESC_CODE = 27;

const page = $('#page');
const infoHolder = $('#info-holder');
const openBtn = $('#open-info-btn');
const closeBtn = infoHolder.find('#close-info-btn');

class CaseInfo extends EventEmitter{

    constructor(){
        super();

        this.isActive = false;

        this._UIevents();
    }
    _UIevents(){
        openBtn.on('click', (e) => this.handleOpen(e));
        closeBtn.on('click', (e) => this.handleClose(e));

        $(document).on('keydown', (e) => this.handleKeyDown(e));
    }
    handleOpen(e){
        this.isActive = true;

        page.addClass('__info-active');

        this.emitChange();

        return false;
    }
    handleClose(e){
        this.isActive = false;

        page.removeClass('__info-active');

        this.emitChange();

        return false;
    }
    handleKeyDown(e){
        let keyCode = e.originalEvent.keyCode;

        if(keyCode !== ESC_CODE) return;

        page.removeClass('__info-active');

        return false;
    }
    emitChange(){
        this.emit(TOGGLE_INFO, {
            isActive: this.isActive
        });
    }

}

export default CaseInfo;