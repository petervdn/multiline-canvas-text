# multiline-canvas-text
Render a string to canvas, breaking it up into multiple lines to fit the given width.

## install
```sh
npm install multiline-canvas-text
```

## demo
Check out the [interactive example](https://petervdn.github.io/multiline-canvas-text/example/).

## usage
```javascript
import { drawText } from "multiline-canvas-text";

const text = 'The quick brown fox jumps over the lazy dog';
const width = 40;         // width in pixels to fit the text
const font = 'Arial';     // font should be available in the page
const fontSize = 20;      // in pixels
const lineSpacing = 1;    // vertical spacing between the lines
const color = 'white';    // can be any valid css color string: 'black', #FFF', 'rgba(0,0,0,0.5)', etc
const strokeText = false; // true results in calling strokeText instead of fillText

const result = drawText(text, width, font, fontSize, lineSpacing, color, strokeText);

element.appendChild(result.canvas);
```

The result object contains 3 properties:
* `canvas`: The generated canvas element with the rendered text. This canvas has the width that was given to the `drawText` method, but can obviously vary in height.
* `lines`: An array that shows how the string was broken up into multiple lines, for example: `["The quick brown", "fox jumps over", "the lazy dog"]`
* `cursor`: if you are replicating an interactive textfield in canvas, you may want to add a blinking cursor to increase the user experience. The `cursor` property holds `x` and `y` values for where to draw it. **This value is not correct at the moment!**
