import { TOGGLE_MENU } from '@constants/homeConstants';

import Menu from '@components/menu';
import Enquiry from '@forms/enquiry';

class ContactContainer{

    constructor(){
        this.menu = new Menu();
        this.enquiry = new Enquiry();
    }

}

export default ContactContainer;

