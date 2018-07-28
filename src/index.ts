interface IFont {
  name: string;
  size: number;
}

interface IPoint {
  x: number;
  y: number;
}

export interface IDrawTextResult {
  canvas: HTMLCanvasElement;
  lastCharacterPosition: IPoint;
}

function splitIntoFittingWords(text: string, availableWidth: number, font: IFont): string {
  const splitResults = [];

  text.split(' ').forEach(word => {
    if (getTextWidth(word, font) < availableWidth) {
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
function getTextWidth(text: string, font: IFont): number {
  const testContext = document.createElement('canvas').getContext('2d');
  testContext.font = getCanvasFontProperty(font);

  return testContext.measureText(text).width;
}

function groupText(text: string, splitOn: string, availableWidth: number, font: IFont): string[] {
  return text.split(splitOn).reduce((resultingLines, currentItem) => {
    if (resultingLines.length === 0) {
      resultingLines.push('');
    }
    const lastLine = resultingLines[resultingLines.length - 1];

    // test if the last line with the current word would fit
    const testLine = (lastLine.length > 0 ? lastLine + splitOn : lastLine) + currentItem;
    // testLine.push(currentWord);
    const testLineWidth = getTextWidth(testLine, font);
    if (
      testLineWidth > availableWidth &&
      !(resultingLines.length === 1 && resultingLines[0].length === 0)
    ) {
      // does not fit, create new line
      resultingLines.push(currentItem);
    } else {
      // add to current line
      // lastLine.push(currentWord);
      resultingLines[resultingLines.length - 1] = testLine;
    }

    return resultingLines;
  }, []);
}

function fitText(text: string, width: number, font: IFont): any {
  const fittingWords = splitIntoFittingWords(text, width, font);

  return groupText(fittingWords, ' ', width, font);
}

export function drawText(
  text: string,
  width: number,
  fontSize: number,
  fontName: string,
  lineSpacing: number,
): IDrawTextResult {
  const font = { size: fontSize, name: fontName };
  const lines = fitText(text, width, font);

  // create and init canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = lines.length * fontSize + (lines.length - 1) * lineSpacing;

  // todo find out why bottom margin is a bit too large
  // this.context.canvas.height -= this.fontSize * 0.2;

  // init properties (get reset after setting the height)
  context.font = getCanvasFontProperty(font);
  context.textAlign = 'center';
  context.textBaseline = 'hanging';

  // bg
  context.fillStyle = 'rgba(0,0,0,0.4)';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  // draw lines
  const centerX = canvas.width * 0.5;
  let yOffset = 1;
  let lastCharacterPosition: IPoint = {
    x: canvas.width * 0.5,
    y: yOffset,
  };
  lines.forEach(line => {
    context.fillStyle = 'white';
    context.fillText(line, centerX, yOffset);

    lastCharacterPosition = {
      x: canvas.width * 0.5 + 0.5 * getTextWidth(line, font),
      y: yOffset,
    };

    yOffset += fontSize + lineSpacing;
  });

  return {
    canvas,
    lastCharacterPosition,
  };
}

function getCanvasFontProperty(font: IFont): string {
  return `${font.size}px ${font.name}`;
}
