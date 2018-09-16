const images = document.querySelectorAll('img');

const configure = () => {

    Array.from(images, (img) => {
        let newImg = new Image();

        newImg.onload = () => img.className += (newImg.width >= newImg.height) ? 'landscape' : 'portrait';

        newImg.src = img.getAttribute('src');
    });

}

export default configure;