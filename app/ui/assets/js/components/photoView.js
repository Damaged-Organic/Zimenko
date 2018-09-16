import { EventEmitter } from 'events';

const ANIMATION_TIME = 1000;

const ESC_CODE = 27;

const page = $('#page');
const photoViewHolder = $('#photo-view');
const photoHolder = photoViewHolder.find('.photo-holder');
const photoContainer = $('#photo-container');

class PhotoView extends EventEmitter{

    constructor(src){
        super();

        if(!src)
            throw new Error('Path to original photo is required');

        this.isLoading = false;

        this.photoSize = {};
        this.dimension = this.getDimension();

        this._loadPhoto(src);

        this._UIevents();
    }
    _UIevents(){
        photoViewHolder.on('click', '.close-photo-view', (e) => this.handleClose(e));

        $(document).on('keydown', (e) => this.handleKeyDown(e));
        $(window).on('resize', (e) => this.handleResize(e));
    }
    getDimension(){
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    }
    _loadPhoto(src){
        let photo = new Image();

        page.addClass('__photo-loading');

        photo.onload = () => {

            this.updatePhoto(photo);
            this.setPhotoSize(photo);
            this.setPhotoOrientation();
            this.activatePhoto();

        };

        photo.src = src;
    }
    updatePhoto(photo){
        photoContainer.html(photo).removeClass('__loading');
    }
    setPhotoSize(photo){

        this.photoSize = {
            w: photo.clientWidth,
            h: photo.clientHeight
        }
    }
    setPhotoOrientation(){
        (this.photoSize.w >= this.photoSize.h)
            ? photoViewHolder.addClass('landscape')
            : photoViewHolder.addClass('portrait');
    }
    activatePhoto(){
        let timer = setTimeout(() => {
            
            this.isLoading = true;
            page.removeClass('__photo-loading').addClass('__photo-active');

        }, ANIMATION_TIME);
    }
    handleClose(e){
        this.clear();

        this.emit('close');

        return false;
    }
    handleKeyDown(e){
        if(e.originalEvent.keyCode !== ESC_CODE) return;

        this.clear();

        return false;
    }
    handleResize(e){

        let photo = photoHolder.find('img')[0];

        this.setPhotoSize(photo);
        this.setPhotoOrientation();
        this.activatePhoto();

        return false;
    }
    clear(){
        page.removeClass('__photo-active');

        let timer = setTimeout(() => {
            
            photoViewHolder.removeClass('landscape portrait');

            clearTimeout(timer);

        }, 400);
    }

}

export default PhotoView;