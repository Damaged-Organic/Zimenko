export function normalizeScroll(event){
    if(!event)
        event = window.event;

    let wheelDelta = event.wheelDelta,
        detail = event.detail;

    if(detail && wheelDelta)
        return ((wheelDelta / detail / 40 * detail) > 0) ? 1 : -1;

    if(detail)
        return detail / -3;

    return wheelDelta / 120;
}