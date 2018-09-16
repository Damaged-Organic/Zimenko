import { TOGGLE_MENU } from '@constants/homeConstants';

import Menu from '@components/menu';
import Scroller from '@components/scroller';
import ColorizeLookbook from '@components/colorizeLookbook';

import isMobile from '@utility/isMobile';

class BlogContainer{

    constructor(){
        this.menu = new Menu();

        if(!isMobile())
            this.scroller = new Scroller();

        if(isMobile())
            this.colorizeLookbook = new ColorizeLookbook();        
    }

}

export default BlogContainer;