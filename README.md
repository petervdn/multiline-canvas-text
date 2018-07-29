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
* `canvas`: the generated canvas element with the rendered text. note that this may be smaller than the given width since the canvas is trimmed (all empty space on the borders is removed)
* `lines`: an array of the lines that were actually drawn, for example: `["The quick brown", "fox jumps over", "the lazy dog"`
