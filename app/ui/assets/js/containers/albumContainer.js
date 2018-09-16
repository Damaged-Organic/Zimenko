import { TOGGLE_MENU, TOGGLE_INFO } from '@constants/homeConstants';

import isMobile from '@utility/isMobile';

import Menu from '@components/menu';
import Gallery from '@components/gallery';
import CaseInfo from '@components/caseInfo';

class AlbumContainer{

    constructor(){
        this.menu = new Menu();
        this.gallery = new Gallery();

        this.caseInfo = new CaseInfo();
        
        this.caseInfo.on(TOGGLE_INFO, (e) => this.gallery.setInfoState(e.isActive));
    }

}

export default AlbumContainer;