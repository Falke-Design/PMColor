# Leaflet PMColor: Colortool with colorbucket and pipette
This is a [Leaflet Geoman](https://github.com/geoman-io/leaflet-geoman) Subplugin 

Demo: [PMColor](https://falke-design.github.io/PMColor/)

### Installation
Download [pmColor.js](https://raw.githubusercontent.com/Falke-Design/PMColor/master/dist/pmColor.js) and include them in your project.

`<script src="./dist/pmColor.js"></script>`

or use the script over cdn:

`<script src="https://cdn.jsdelivr.net/gh/Falke-Design/PMColor/dist/pmColor.js"></script>`

### Init PMColor
Create the L.PMColor button after Leaflet Geoman

`pmColor = new L.PMColor(map)`

You can define the width, positon and if the colorpicker is showing

`pmColor = new L.PMColor(map, {width: 180, pickerPosition: {top: 5, left: 100}, showPicker: true})`

### Functions
**openColorPicker / closeColorPicker**

```javascript
pmColor.openColorPicker();
pmColor.closeColorPicker();
```
**enableBucket / disableBucket**

```javascript
pmColor.enableBucket();
pmColor.disableBucket();
```
**enablePipette / disablePipette**

```javascript
pmColor.enablePipette();
pmColor.disablePipette();
```
**disable**

Disable bucket and pipette

```javascript
pmColor.openColorPicker();
pmColor.closeColorPicker();
```
**setText**

Set the active mode "bucket" | "pipette" | ""
```javascript
pmColor.setMode(mode)
```
**getMode**

Get the active mode "bucket" | "pipette" | ""
```javascript
pmColor.getMode()
```
**setColorPickerType**

Set the active colorpicker type "fill" | "border" 
```javascript
pmColor.setColorPickerType(type)
```
**getColorPickerType**

Get the active colorpicker type "fill" | "border"
```javascript
pmColor.getColorPickerType()
```
**setColor**

```javascript
pmColor.setColor(color)
color: {fill: '#f00', border: '#fff'}
```
**getColor**

Get the colors fill & border
```javascript
pmColor.getColor()
```
**setOpacity**

Set the opacity between 0 and 1
```javascript
pmColor.setOpacity(color)
opacity: {fill: 0.2, border: 1}
```
**getOpacity**

Get the opacity fill & border
```javascript
pmColor.getOpacity()
```
**setStyle**

Set the color and opacity in leaflet format
```javascript
pmColor.setStyle(style)
style: {color: '#fff', fillColor: '#f00', opacity: 1, fillOpacity: 0.2}
```
**getStyle**

Get the color and opacity in leaflet format "color" | "fillColor" | "opacity" | "fillOpacity"
```javascript
pmColor.getStyle()
```
**setPosition**

Set the position from the colorpicker "top" | "left"
```javascript
pmColor.setPosition(position)
position: { top: 5, left: 100}
```
**getPosition**

Get the position from the colorpicker "top" | "left"
```javascript
pmColor.getPosition()
```

#### Extends L.PM.Draw

**setPathOptions**

Overwrite the pathOptions, templineStyle and hintlineStyle from all path Layers (Line, Polyline, Rectangle, CircleMarker, Circle)
```javascript
map.pm.Draw.Line.setPathOptions(options)
```
**setHintPathOptions**

Overwrite the templineStyle and hintlineStyle from all path Layers (Line, Polyline, Rectangle, CircleMarker, Circle)
```javascript
map.pm.Draw.Line.setHintPathOptions(options)
```

