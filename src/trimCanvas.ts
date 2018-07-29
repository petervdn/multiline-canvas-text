// https://gist.github.com/remy/784508
export function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');

  const copy = document.createElement('canvas').getContext('2d');
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const l = pixels.data.length;

  let y;

  // an object that will store the area that isn't transparent
  const bound = { top: null, left: null, right: null, bottom: null };

  // for every pixel in there
  for (let i = 0; i < l; i += 4) {
    // if the alpha value isn't ZERO (transparent pixel)
    if (pixels.data[i + 3] !== 0) {
      // find its coordinates
      y = ~~(i / 4 / canvas.width);

      // store/update those coordinates
      // inside our bounding box Object

      if (bound.top === null) {
        bound.top = y;
      }

      // if (bound.left === null) {
      //   bound.left = x;
      // } else if (x < bound.left) {
      //   bound.left = x;
      // }
      //
      // if (bound.right === null) {
      //   bound.right = x;
      // } else if (bound.right < x) {
      //   bound.right = x;
      // }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  // actual height and width of the text
  // (the zone that is actually filled with pixels)
  const trimHeight = bound.bottom - bound.top;
  const trimWidth = canvas.width; // do not trim horizontally

  // get the zone (trimWidth x trimHeight) as an ImageData
  // (Uint8ClampedArray of pixels) from our canvas
  const trimmed = ctx.getImageData(0, bound.top, trimWidth, trimHeight);

  // Draw back the ImageData into the canvas
  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // return the canvas element
  return copy.canvas;
}
