import 'social-likes'

import { TOGGLE_MENU } from '@constants/homeConstants';

import Menu from '@components/menu';
import scrollTop from '@components/scrollTop';

import isMobile from '@utility/isMobile';

class ArticleContainer{

    constructor(){
        this.menu = new Menu();

        scrollTop();
    }

}

export default ArticleContainer;