import EnquiryService from '@services/enquiryService';

import isMobile from '@utility/isMobile';

const form = $('#enquiry-form');
const loader = $('#ajax-loader');
const responseHolder = $('#response-holder');

const click = isMobile() ? 'touchstart' : 'click';

form.validate();

class Enquiry{

    constructor(){
        this.isLoading = false;
        this.enquiryService = new EnquiryService();

        this._UIevents();
    }

    _UIevents(){
        form.on('submit', (e) => this.handleForm(e));
        responseHolder.on(click, (e) => this.handleClose(e));
    }

    handleForm(e){
        e.preventDefault();

        if(!form.valid() || this.isLoading) return;

        this.startLoading();

        let url = form.attr('action'),
            data = form.serializeArray();

        this.enquiryService.send(url, data)
            .then((response) => {

                this.setResponse(false, response.message);

                this.resetForm();

                this.endLoading();
            })
            .catch((err) => {

                this.setResponse(true, err.message);

                this.endLoading();
            });

        return false;
    }

    handleClose(e){
        responseHolder.removeClass('active error success')
                      .find('.inner')
                      .empty();

        return false;
    }

    startLoading(){
        form.addClass('loading');

        loader.addClass('active');

        this.isLoading = true;
    }

    resetForm(){
        form[0].reset();
    }

    setResponse(isError, message){
        responseHolder
            .addClass(isError ? 'error active' : 'success active')
            .find('.inner')
            .html(`<p>${ message }</p>`);
    }

    endLoading(){
        form.removeClass('loading');

        loader.removeClass('active');

        this.isLoading = false;
    }

}

export default Enquiry;