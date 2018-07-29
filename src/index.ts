import { trimCanvas } from './trimCanvas';

export interface IFont {
  name: string;
  size: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IDrawTextResult {
  canvas: HTMLCanvasElement;
  cursor: IPoint;
  lines: string[];
}

/**
 * For a given string, returns a new string in which all the separate words (characters divided by a space) fit in the given width. Can add spaces into original words if they are too long.
 * @param {string} text
 * @param {number} availableWidth
 * @param {IFont} font
 * @returns {string}
 */
function splitIntoFittingWords(text: string, availableWidth: number, font: IFont): string {
  const splitResults = [];

  text.split(' ').forEach(word => {
    if (getTextWidth(word, font).width < availableWidth) {
      // word fits
      splitResults.push(word);
    } else {
      // word does not fit, split into characters
      groupText(word, '', availableWidth, font).forEach(entry => {
        splitResults.push(entry);
      });
    }
  });

  return splitResults.join(' ');
}

/**
 * Measures the width of a string for a given font.
 * @param {string} text
 * @param {IFont} font
 * @returns {number}
 */
function getTextWidth(text: string, font: IFont): TextMetrics {
  const testContext = document.createElement('canvas').getContext('2d');
  testContext.font = getCanvasFontProperty(font);

  return testContext.measureText(text);
}

/**
 * Groups a given string into fitting parts. What a part is is defined by the character to split the original string on.
 * @param {string} text
 * @param {string} splitOn
 * @param {number} availableWidth
 * @param {IFont} font
 * @returns {string[]}
 */
function groupText(text: string, splitOn: string, availableWidth: number, font: IFont): string[] {
  return text.split(splitOn).reduce((resultingLines, currentItem) => {
    if (resultingLines.length === 0) {
      resultingLines.push('');
    }
    const lastLine = resultingLines[resultingLines.length - 1];

    // test if the last line with the current word would fit
    const testLine = (lastLine.length > 0 ? lastLine + splitOn : lastLine) + currentItem;
    const testLineWidth = getTextWidth(testLine, font).width;
    if (
      testLineWidth > availableWidth &&
      !(resultingLines.length === 1 && resultingLines[0].length === 0)
    ) {
      // does not fit, create new line
      resultingLines.push(currentItem);
    } else {
      // add to current line
      resultingLines[resultingLines.length - 1] = testLine;
    }

    return resultingLines;
  }, []);
}

/**
 * Creates a canvas of the given width and renders the string into it
 * @param {string} text
 * @param {number} width
 * @param {string} fontName
 * @param {number} fontSize
 * @param {number} lineSpacing
 * @param {string} color
 * @param {boolean} strokeText
 * @returns {IDrawTextResult}
 */
export function drawText(
  text: string,
  width: number,
  fontName: string,
  fontSize: number,
  lineSpacing: number = 0,
  color = 'white',
  strokeText = false,
): IDrawTextResult {
  // for now, just add spacing to fix fonts falling ut of view sometimes (at the bottom specifically)
  // padding will be removed by trimming canvas at the end
  const padding = { x: 10, y: fontSize * 2 }; // todo this needs a better fix

  const font = createFont(fontName, fontSize);
  const lines = fitText(text, width, fontName, fontSize);

  // create and init canvas
  const canvas = document.createElement('canvas');
  canvas.width = width + 2 * padding.x;
  canvas.height = lines.length * fontSize + (lines.length - 1) * lineSpacing + 2 * padding.y;

  const context = canvas.getContext('2d');
  context.font = getCanvasFontProperty(font);
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = color;
  context.strokeStyle = color;

  // draw lines
  const centerX = canvas.width * 0.5;
  let yOffset = 0;
  let cursor: IPoint = {
    x: canvas.width * 0.5,
    y: yOffset,
  };
  lines.forEach(line => {
    if (strokeText) {
      context.strokeText(line, centerX, yOffset);
    } else {
      context.fillText(line, centerX, yOffset);
    }

    cursor = {
      x: canvas.width * 0.5 + 0.5 * getTextWidth(line, font).width,
      y: yOffset,
    };

    yOffset += fontSize + lineSpacing;
  });

  return {
    lines,
    cursor,
    canvas: trimCanvas(canvas),
  };
}

/**
 * Breaks up a string into lines that fit within the supplied width.
 * @param {string} text
 * @param {number} width
 * @param {string} fontName
 * @param {number} fontSize
 * @returns {string[]}
 */
export function fitText(text: string, width: number, fontName: string, fontSize: number): string[] {
  const font = createFont(fontName, fontSize);
  const fittingWords = splitIntoFittingWords(text, width, font);

  return groupText(fittingWords, ' ', width, font);
}

/**
 * Formats fontName and fontSize into a css string for canvas.
 * @param {IFont} font
 * @returns {string}
 */
function getCanvasFontProperty(font: IFont): string {
  return `${font.size}px ${font.name}`;
}

/**
 * Create IFont object
 * @param {string} name
 * @param {number} size
 * @returns {IFont}
 */
const createFont = (name: string, size: number) => ({ size, name });
