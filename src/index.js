import {extendOptions,dragElement} from "./Utils";
import {colorpicker} from "./Colorpicker";

L.PMColor =  L.Class.extend({
    includes: [colorpicker],
    options: {
        position: 'topleft',
        text: {
            pipette: "Pipette",
            bucket: "Bucket",
            close: "Close",
            cancel: "Cancel",
            title: "Colortool"
        },
        width: 180,
        showPicker: false,
    },
    cssadded: false,
    colorpicker: {
        type:{active: 'fill'},
        color: {
            fill: '#3388ff',
            border: '#3388ff'
        },
        opacity: {
            fill: 0.2,
            border: 1
        }
    },
    initialize(map, options) {
        this.map = map;
        L.setOptions(this, options);

        L.PM.Draw.Line.include(extendOptions);
        L.PM.Draw.Polygon.include(extendOptions);
        L.PM.Draw.Rectangle.include(extendOptions);
        L.PM.Draw.Circle.include(extendOptions);
        L.PM.Draw.CircleMarker.include(extendOptions);

        this._createControl();

        if(this.options.showPicker){
            this.openColorPicker();
        }
    },
    setText(text){
        if(text.tooltips) {
            if (text.tooltips.firstVertex) {
                this.options.text.tooltips.firstVertex = text.tooltips.firstVertex;
            }
            if (text.tooltips.finish) {
                this.options.text.tooltips.finish = text.tooltips.finish;
            }
        }
        if(text.cancel){
            this.options.text.cancel = text.cancel;
        }
    },
    _createControl: function() {
        var btnNameToReplace = "setColor";
        this.map.options.position = this.map.pm.Toolbar.options.position;
        this.map.pm.Toolbar.options[btnNameToReplace] = true;
        this.lockContainer = L.DomUtil.create(
            'div',
            'leaflet-pm-toolbar leaflet-pm-options leaflet-bar leaflet-control'
        );

        const lockButton = {
            className: 'control-icon leaflet-pm-icon-circle',
            title: "Colortool",
            onClick: () => {
                this.openColorPicker();
            },
            afterClick: () => {
                this.disablePipette();
                this.disableBucket();
                this._updateToolbarIcon();
            },
            tool: 'edit',
            doToggle: true,
            toggleStatus: false,
            disableOtherButtons: true,
            position: this.options.position,
            actions: [],
        };

        this.toolbarBtn = new L.Control.PMButton(lockButton);
        this.map.pm.Toolbar._addButton(btnNameToReplace, this.toolbarBtn);

        var buttons =  this.map.pm.Toolbar.buttons;
        var newbtnorder = {};
        var insertAfterDrawDone = false;
        var buttonBeforeReplace = false;
        for(var btn in buttons){
            if(!insertAfterDrawDone && buttonBeforeReplace) {
                newbtnorder[btnNameToReplace] = buttons[btnNameToReplace];
            }else if(btn == btnNameToReplace){
                continue;
            }
            buttonBeforeReplace = btn === "removalMode";
            newbtnorder[btn] = buttons[btn];
        }
        //if last btn
        if(!newbtnorder[btnNameToReplace]){
            newbtnorder[btnNameToReplace] = buttons[btnNameToReplace];
        }

        this.map.pm.Toolbar.buttons = newbtnorder;
        this.map.pm.Toolbar._showHideButtons = this._extend(this.map.pm.Toolbar._showHideButtons,this._createActionBtn(this),this.map.pm.Toolbar);
        this.map.pm.Toolbar._showHideButtons();


    },
    _createActionBtn: function(that){
        return function() {
            const actions = [
                {
                    name: 'bucket',
                    text: that.options.text.bucket,
                    className: 'leaflet-pm-toolbar action-icon icon-bucket',
                    onClick() {
                        that.disablePipette();
                        that.enableBucket();
                    },
                },
                {
                    name: 'pipette',
                    text: that.options.text.pipette,
                    className: 'leaflet-pm-toolbar action-icon icon-pipette',
                    onClick() {
                        that.disableBucket();
                        that.enablePipette();
                    },
                },
                {
                    name: 'close',
                    text: that.options.text.close,
                    onClick() {
                        that.disableBucket();
                        that.disablePipette();
                        that._updateToolbarIcon();
                        that.closeColorPicker();
                    },
                },
                {
                    name: 'cancel',
                    text: that.options.text.cancel,
                    onClick() {
                        that.disableBucket();
                        that.disablePipette();
                        that._updateToolbarIcon();
                        that.map.pm.Toolbar.buttons.setColor.toggle(false);
                    },
                },
            ];


            that._updateToolbarIcon();
            var actionContainer = that.toolbarBtn.buttonsDomNode.children[1];
            actionContainer.innerHTML = "";
            actions.forEach(action => {
                var name = action.name;
                const actionNode = L.DomUtil.create(
                    'a',
                    `leaflet-pm-action action-${name}`,
                    actionContainer
                );

                if (action.text) {
                    actionNode.innerHTML = action.text;
                } else {
                    actionNode.innerHTML = "Text not translated!";
                }

                if(action.title){
                    actionNode.title = action.title;
                }else if(action.text){
                    actionNode.title = action.text;
                }

                if(action.className) {
                    actionNode.innerHTML = "";
                    L.DomUtil.addClass(actionNode, action.className);
                }


                L.DomEvent.addListener(actionNode, 'click', action.onClick, that);
                L.DomEvent.disableClickPropagation(actionNode);
            });
        }
    },

    _updateToolbarIcon(){
        var buttonContainer = this.map.pm.Toolbar.buttons.setColor.buttonsDomNode.children[0];

        buttonContainer.innerHTML = "";
        const image = L.DomUtil.create('div', 'control-icon', buttonContainer);
        image.setAttribute('title', this.options.text.title);

        var mode = this.getMode();
        if (mode === "bucket") {
            L.DomUtil.addClass(image, "icon-bucket");
        }else if(mode === "pipette"){
            L.DomUtil.addClass(image, "icon-pipette");
        }else{
            L.DomUtil.addClass(image, "icon-colorpicker");
        }
        return buttonContainer;
    },
    _extend: function(fn,code,that){
        return function(){
            fn.apply(that,arguments);
            code.apply(that,arguments);
        }
    },
    disable(){
        this.disableBucket();
        this.disablePipette();
    },
    enableBucket(){
        this.disable();
        this.mode = "bucket";
        var that = this;
        var layers = this._findLayers(this.map);
        layers.forEach(function(layer){
            layer.on('click',that._appendColorToLayer,that);
        });
        that._updateToolbarIcon();
    },
    disableBucket(){
        this.mode = "";
        var that = this;
        var layers = this._findLayers(this.map);
        layers.forEach(function(layer){
            layer.off('click',that._appendColorToLayer,that);
        });
        that._updateToolbarIcon();
    },
    _findLayers: function(map) {
        let layers = [];
        map.eachLayer(layer => {
            if (
                layer instanceof L.Polyline ||
                layer instanceof L.Circle ||
                layer instanceof L.CircleMarker
            ) {
                layers.push(layer);
            }
        });
        // filter out layers that don't have the leaflet-geoman instance
        layers = layers.filter(layer => !!layer.pm);
        // filter out everything that's leaflet-geoman specific temporary stuff
        layers = layers.filter(layer => !layer._pmTempLayer);
        return layers;
    },
    _appendColorToLayer(e){
        var layer = e.target;
        layer.setStyle(this.getStyle());
    },
    enablePipette(){
        this.disable();
        this.mode = "pipette";
        var that = this;
        var layers = this._findLayers(this.map);
        layers.forEach(function(layer){
            layer.on('click',that._getColorFromLayer,that);
        });
        that._updateToolbarIcon();
    },
    disablePipette(){
        this.mode = "";
        var that = this;
        var layers = this._findLayers(this.map);
        layers.forEach(function(layer){
            layer.off('click',that._getColorFromLayer,that);
        });
        that._updateToolbarIcon();
    },
    _getColorFromLayer(e){
        var layer = e.target;
        var options = layer.options;

        if(options.color){
            this.setStyle({color: options.color});
        }
        if(options.fillColor){
            this.setStyle({fillColor: options.fillColor});
        }else if(!options.fillColor && options.fill){
            this.setStyle({fillColor: this.getStyle().color});
        }
        if(options.opacity){
            this.setStyle({opacity: options.opacity});
        }
        if(options.fillOpacity){
            this.setStyle({fillOpacity: options.fillOpacity});
        }
    },
    getMode(){
        return this.mode;
    },
    setMode(mode){
        switch (mode) {
            case "bucket": this.enableBucket(); break;
            case "pipette": this.enablePipette(); break;
            default: this.disable();
        }
    }



});