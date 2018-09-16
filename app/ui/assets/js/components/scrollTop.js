import isMobile from '@utility/isMobile';

const body = $('html, body');
const scrollTopHolder = $('#scroll-top-holder');

const click = isMobile() ? 'touchstart' : 'click';

const scrollTop = () => {

    scrollTopHolder.find('.inner').on(click, (e) => {
        
        body.stop().animate({ scrollTop: 0 }, 800);

        return false;
    });

}

export default scrollTop;