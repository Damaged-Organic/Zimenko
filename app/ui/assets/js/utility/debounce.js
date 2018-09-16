let timer = null;

export function debounce(time, cb){
    
    clearTimeout(timer);
    timer = setTimeout(cb, time);
}