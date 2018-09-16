const isMobile = () => {
    return /Mobi/i.test(navigator.userAgent);
}

export default isMobile;