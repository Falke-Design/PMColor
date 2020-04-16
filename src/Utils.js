var extendOptions = {
    setPathOptions(options) {
        this.options.pathOptions = options;
        this.options.templineStyle = options;
        this.options.hintlineStyle = options;
    },
    setHintPathOptions(options) {
        this.options.templineStyle = options;
        this.options.hintlineStyle = options;
    },
};

function dragElement(box,dragelm,container) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    dragelm.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;


        // set the element's new position:
        if(box.offsetTop - pos2 >= 5 && box.offsetTop - pos2 <= container.clientHeight-box.clientHeight-5) {
            box.style.top = (box.offsetTop - pos2) + "px";
        }

        if(box.offsetLeft - pos1 >= 5 && box.offsetLeft - pos1 <= container.clientWidth-box.clientWidth-5) {
            box.style.left = box.offsetLeft - pos1 + "px";
        }

    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }

}

function rgba2rgb(RGB_background, RGBA_color){
    var alpha = RGBA_color.a;

    return {
        r: (1 - alpha) * RGB_background.r + alpha * RGBA_color.r,
        g: (1 - alpha) * RGB_background.g + alpha * RGBA_color.g,
        b: (1 - alpha) * RGB_background.b + alpha * RGBA_color.b
    }
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

export  {
    extendOptions,
    dragElement,
    rgba2rgb,
    invertColor
};