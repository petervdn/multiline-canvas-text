# multiline-canvas-text
Render a string to a canvas and make it fit within a given width.

## install
```sh
npm install multiline-canvas-text
```


## usage
```javascript
import { drawText } from "multiline-canvas-text";

const text = 'The quick brown fox jumps over the lazy dog';
const width = 40;
const font = 'Arial';
const fontSize = 20;
const lineSpacing = 1;

const result = drawText(text, width, font, fontSize, lineSpacing);

element.appendChild(result.canvas);
```

The result object contains 3 properties:
* `canvas`: The generated canvas element with the rendered text. This canvas has the width that was given to the `drawText` method, but can obviously vary in height.
* `lines`: An array that shows how the string was broken up into multiple lines, for example: `["The quick brown", "fox jumps over", "the lazy dog"]`
* `cursor`: if you are replicating an interactive textfield in canvas, you may want to add a blinking cursor to increase the user experience. The `cursor` property holds `x` and `y` values for where to draw it.
