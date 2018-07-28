// https://gist.github.com/remy/784508
export function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');

  // create a temporary canvas in which we will draw back the trimmed text
  const copy = document.createElement('canvas').getContext('2d');

  // Use the Canvas Image Data API, in order to get all the
  // underlying pixels data of that canvas. This will basically
  // return an array (Uint8ClampedArray) containing the data in the
  // RGBA order. Every 4 items represent one pixel.
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // total pixels
  const l = pixels.data.length;

  // main loop counter and pixels coordinates
  let x;
  let y;

  // an object that will store the area that isn't transparent
  const bound = { top: null, left: null, right: null, bottom: null };

  // for every pixel in there
  for (let i = 0; i < l; i += 4) {
    // if the alpha value isn't ZERO (transparent pixel)
    if (pixels.data[i + 3] !== 0) {
      // find it's coordinates
      x = (i / 4) % canvas.width;
      y = ~~(i / 4 / canvas.width);

      // store/update those coordinates
      // inside our bounding box Object

      if (bound.top === null) {
        bound.top = y;
      }

      if (bound.left === null) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right === null) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

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
  const trimWidth = bound.right - bound.left;

  // get the zone (trimWidth x trimHeight) as an ImageData
  // (Uint8ClampedArray of pixels) from our canvas
  const trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

  // Draw back the ImageData into the canvas
  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // return the canvas element
  return copy.canvas;
}
