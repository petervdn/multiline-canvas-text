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
 *
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

export function drawText(
  text: string,
  width: number,
  fontName: string,
  fontSize: number,
  lineSpacing: number = 0,
  color = 'white',
): IDrawTextResult {
  // for now, just add spacing to fix fonts falling ut of view sometimes (at the bottom specifically)
  // padding will be removed by trimming canvas at the end
  const padding = { x: 10, y: 15 };

  const font = { size: fontSize, name: fontName };
  const lines = fitText(text, width, font);

  // create and init canvas
  const canvas = document.createElement('canvas');
  canvas.width = width + 2 * padding.x;
  canvas.height = lines.length * fontSize + (lines.length - 1) * lineSpacing + 2 * padding.y;

  const context = canvas.getContext('2d');
  context.font = getCanvasFontProperty(font);
  context.textAlign = 'center';
  context.textBaseline = 'top';

  // draw lines
  const centerX = canvas.width * 0.5;
  let yOffset = 0;
  let cursor: IPoint = {
    x: canvas.width * 0.5,
    y: yOffset,
  };
  lines.forEach(line => {
    context.fillStyle = color;
    context.fillText(line, centerX, yOffset);

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

function fitText(text: string, width: number, font: IFont): any {
  const fittingWords = splitIntoFittingWords(text, width, font);

  return groupText(fittingWords, ' ', width, font);
}

function getCanvasFontProperty(font: IFont): string {
  return `${font.size}px ${font.name}`;
}
