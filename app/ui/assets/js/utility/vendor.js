const style = document.createElement('div').style;
const vendors = ['ms', 'Moz', 'O', 'Webkit'];

export function getPrefixed(property){
    if(style[property] === '') return property;

    property = property.charAt(0).toUpperCase() + property.slice(1);

    for(let vendor of vendors){
        
        if(style[vendor + property] === '')
            return vendor + property;

    }

}