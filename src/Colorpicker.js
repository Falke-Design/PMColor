import {dragElement, invertColor, rgba2rgb} from "./Utils";
import iro from '@jaames/iro';


var colorpicker = {
    openColorPicker(){
        if(!this.map.getContainer().contains(this.colorpicker.container)) {
            if(this.colorpicker.container){
                this.map.getContainer().appendChild(this.colorpicker.container);
            }else {
                this._createColorPickerContainer();
            }
        }
    },
    closeColorPicker(){
        if(this.map.getContainer().contains(this.colorpicker.container)) {
            this.map.getContainer().removeChild(this.colorpicker.container);
        }
        this.map.pm.Toolbar.buttons.setColor.toggle(false);
    },
    _createColorPickerContainer(){
        var colorPickerContainer = L.DomUtil.create('div','colorPicker');

        var dragElm = L.DomUtil.create('div','',colorPickerContainer);
        dragElm.id="dragColorbox";
        dragElement(colorPickerContainer,dragElm,this.map.getContainer());

        var closeBtn = L.DomUtil.create('div','closeBtn',colorPickerContainer);
        L.DomEvent.on(closeBtn,'click',this.closeColorPicker,this);

        var colorPickerTypeBox = L.DomUtil.create('div','colorPickerTypeBox',colorPickerContainer);
        this.colorpicker.type.active = 'fill';

        this.colorpicker.type.fill = L.DomUtil.create('div','active',colorPickerTypeBox);
        this.colorpicker.type.fill.innerHTML = "<span>Fill</span><div id='colorpickerColorFill' class='colorpickerColor'></div>";
        L.DomEvent.on(this.colorpicker.type.fill,'click',this._changeColorPickerFill,this);
        this.colorpicker.type.border = L.DomUtil.create('div','',colorPickerTypeBox);
        this.colorpicker.type.border.innerHTML = "<span>Border</span><div id='colorpickerColorBorder' class='colorpickerColor'></div>";
        L.DomEvent.on(this.colorpicker.type.border,'click',this._changeColorPickerBorder,this);

        var colorBox = L.DomUtil.create('div','colorPickerColorBox',colorPickerContainer);
        this.colorpicker.colorBox = colorBox;

        this.colorpicker.container = colorPickerContainer;
        L.DomEvent.disableClickPropagation(this.colorpicker.container);
        this.map.getContainer().appendChild(this.colorpicker.container);
        this.colorpicker.iro = new iro.ColorPicker(".colorPicker", {
            width: this.options.width,
            color: this.colorpicker.color[this.colorpicker.type.active],
            borderWidth: 1,
            borderColor: "#fff",
            sliderSize: 15,
            transparency: true
        });

        this.colorpicker.iro.color.set(this.colorpicker.color[this.colorpicker.type.active]);
        this.colorpicker.iro.color.alpha = this.colorpicker.opacity[this.colorpicker.type.active];
        var that = this;
        this.colorpicker.iro.on(["color:init", "color:change"], function(color){
            colorBox.style.backgroundColor = color.hex8String;

            var white = new iro.Color("#fff");
            var visibleColor = new iro.Color(rgba2rgb(white.rgb,color.rgba));
            var opositeColor = new iro.Color(invertColor(visibleColor.hexString,true));
            colorBox.style.color = opositeColor.hexString;

            if(color.alpha == 1 || color.alpha == 0){
                colorBox.innerHTML = color.hexString;
            }else{
                colorBox.innerHTML = color.hex8String;
            }

            if(!that.colorpicker.noEvent) {
                that.colorpicker.color[that.colorpicker.type.active] = color.hexString;
                that.colorpicker.opacity[that.colorpicker.type.active] = color.alpha;

                var borderColorDiv = L.DomUtil.get("colorpickerColorBorder");
                borderColorDiv.style.backgroundColor = that.colorpicker.color.border;
                var fillColorDiv = L.DomUtil.get("colorpickerColorFill");
                fillColorDiv.style.backgroundColor = that.colorpicker.color.fill;

            }
            that._updatePMColor();
        });
        if(this.options.pickerPosition) {
            this.setPosition(this.options.pickerPosition);
        }

    },
    _changeColorPickerFill(){
        this.setColorPickerType('border');
    },
    _changeColorPickerBorder(){
        this.setColorPickerType('fill');
    },
    setColorPickerType(type){
        this.colorpicker.type.fill.className = "";
        this.colorpicker.type.border.className = "";

        var borderColorDiv = L.DomUtil.get("colorpickerColorBorder");
        borderColorDiv.style.backgroundColor = this.colorpicker.color.border;
        var fillColorDiv = L.DomUtil.get("colorpickerColorFill");
        fillColorDiv.style.backgroundColor = this.colorpicker.color.fill;

        if(type === "fill"){
            this.colorpicker.type.active = "border";
        }else{
            this.colorpicker.type.active = "fill";
        }

        L.DomUtil.addClass(this.colorpicker.type[this.colorpicker.type.active],'active');
        this.colorpicker.noEvent = true;
        this.colorpicker.iro.color.set(this.colorpicker.color[this.colorpicker.type.active]);
        this.colorpicker.iro.color.alpha = this.colorpicker.opacity[this.colorpicker.type.active];
        this.colorpicker.noEvent = false;
    },
    getColorPickerType(){
      return this.colorpicker.type.active;
    },
    getColor(){
        return this.colorpicker.color;
    },
    setColor(color){
        if(color.fill){
            this.colorpicker.color.fill = color.fill;
        }
        if(color.border){
            this.colorpicker.color.border = color.border;
        }
        this._updateColorpicker();
        this._updatePMColor();
    },
    setOpacity(opacity){
        if(opacity.fill){
            this.colorpicker.opacity.fill = opacity.fill;
        }
        if(opacity.border){
            this.colorpicker.opacity.border = opacity.border;
        }
        this._updateColorpicker();
        this._updatePMColor();
    },
    getOpacity(){
        return this.colorpicker.opacity;
    },
    getStyle(){
        return {
            color: this.colorpicker.color.border,
            opacity: this.colorpicker.opacity.border,
            fillColor: this.colorpicker.color.fill,
            fillOpacity: this.colorpicker.opacity.fill,
        };
    },
    setStyle(options){
        if(options.color) {
            this.colorpicker.color.border = options.color;
        }
        if(options.opacity) {
            this.colorpicker.opacity.border = options.opacity;
        }
        if(options.fillColor) {
            this.colorpicker.color.fill = options.fillColor;
        }
        if(options.fillOpacity) {
            this.colorpicker.opacity.fill = options.fillOpacity;
        }
        this._updatePMColor();
        this._updateColorpicker();
    },
    _updateColorpicker(){
        this.colorpicker.iro.color.set(this.colorpicker.color[this.colorpicker.type.active]);
        this.colorpicker.iro.color.alpha = this.colorpicker.opacity[this.colorpicker.type.active];


        var borderColorDiv = L.DomUtil.get("colorpickerColorBorder");
        borderColorDiv.style.backgroundColor = this.colorpicker.color.border;
        var fillColorDiv = L.DomUtil.get("colorpickerColorFill");
        fillColorDiv.style.backgroundColor = this.colorpicker.color.fill;
    },
    _updatePMColor(){
        var map = this.map;
        map.pm.setPathOptions(this.getStyle());
        map.pm.Draw.options.hintlineStyle.color = this.getStyle().color;
        map.pm.Draw.options.hintlineStyle.dashArray = [5,5];
        map.pm.Draw.options.templineStyle.color =  this.getStyle().color;

        var tempLineStyle = this.getStyle();


        map.pm.Draw.Rectangle.setPathOptions(this.getStyle());
        if(map.pm.Draw.Rectangle._layer) {
            map.pm.Draw.Rectangle._layer.setStyle(this.getStyle());
        }
        map.pm.Draw.Circle.setPathOptions(this.getStyle());
        if(map.pm.Draw.Circle._layer) {
            map.pm.Draw.Circle._layer.setStyle(this.getStyle());
            map.pm.Draw.Circle._hintline.setStyle(this.getStyle());
        }
        map.pm.Draw.Line.setPathOptions(this.getStyle());
        if(map.pm.Draw.Line._layer) {
            map.pm.Draw.Line._layer.setStyle(this.getStyle());
            map.pm.Draw.Line._hintline.setStyle(tempLineStyle);
        }
        map.pm.Draw.Polygon.setPathOptions(this.getStyle());
        if(map.pm.Draw.Polygon._layer) {
            map.pm.Draw.Polygon._layer.setStyle(this.getStyle());
            map.pm.Draw.Polygon._hintline.setStyle(tempLineStyle);
        }

        map.pm.Draw.CircleMarker.setPathOptions(this.getStyle());
        if(map.pm.Draw.CircleMarker._hintMarker) {
            map.pm.Draw.CircleMarker._hintMarker.setStyle(this.getStyle());
        }
    },
    setPosition(options){
        if(this.colorpicker.container) {
            if (options.top != undefined) {
                var top = options.top;
                if (top < 5) {
                    top = 5;
                } else if (top > this.map.getContainer().clientHeight - this.colorpicker.container.clientHeight - 5) {
                    top = this.map.getContainer().clientHeight - this.colorpicker.container.clientHeight - 5;
                }

                this.colorpicker.container.style.top = top + "px";
            }
            if (options.left != undefined) {
                var left = options.left;
                if (left < 5) {
                    left = 5;
                } else if (left > this.map.getContainer().clientWidth - this.colorpicker.container.clientWidth - 5) {
                    left = this.map.getContainer().clientWidth - this.colorpicker.container.clientWidth - 5;
                }
                this.colorpicker.container.style.left = left + "px";
            }
        }
    },
    getPosition(){
        return {
            top: this.colorpicker.container.offsetTop,
            left: this.colorpicker.container.offsetLeft,
        }
    }
};

export {
    colorpicker
}