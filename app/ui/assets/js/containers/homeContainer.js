import * as homeConstants from '@constants/homeConstants';

import Menu from '@components/menu';
import Hold from '@components/hold';
import HeroGallery from '@components/heroGallery';

import heroMaskDelta from '@components/heroMaskDelta';

import isMobile from '@utility/isMobile';

const page = $('#page');

class HomeContainer{

    constructor(){
        this.menu = new Menu();
        this.hold = new Hold();
        this.gallery = new HeroGallery();

        if(isMobile())
            this.heroMaskDelta = heroMaskDelta();

        this._listenChanges();
    }

    _listenChanges(){
        this.hold.on(homeConstants.HOLD_ACTIVE, (state) => this.holdState(state));
    }

    holdState(state){
        this.gallery.isEnabled = state.isActive ? true : false;
    }

}

export default HomeContainer;