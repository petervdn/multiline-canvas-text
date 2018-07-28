import { drawText } from "../../src";
const WebFont = require('webfontloader');

const fonts = ['Arial', 'Varela Round', 'Lobster'];
const selectList = document.querySelector("select");


function createFontSelect() {
  fonts.forEach(font => {
    const option = document.createElement("option");
    option.value = font;
    option.text = font;
    selectList.appendChild(option);
  });

}

createFontSelect();

const textInput = document.querySelector('input');
const widthInput = <HTMLInputElement>document.querySelector('#width');
const spacingInput = <HTMLInputElement>document.querySelector('#spacing');
const fontSizeInput = <HTMLInputElement>document.querySelector('#fontsize');
const resultContainer = <HTMLElement>document.querySelector('#result');

function update() {
  const width = parseInt(widthInput.value, 10);
  const fontSize = parseInt(fontSizeInput.value, 10);
  const spacing = parseInt(spacingInput.value, 10);
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }
  const result = drawText(textInput.value, width, fontSize, selectList.value, spacing);
  resultContainer.appendChild(result.canvas);

  resultContainer.style.width = `${result.canvas.width}px`;
  resultContainer.style.height = `${result.canvas.height}px`;
}

textInput.addEventListener('input', () => {
  update();
});

widthInput.addEventListener('input', () => {
  update();
});

spacingInput.addEventListener('input', () => {
  update();
});

fontSizeInput.addEventListener('input', () => {
  update();
});

selectList.addEventListener('input', () => {
  update();
});

textInput.value = 'The quick brown fox jumps over the lazy dog';
update();

// var WebFontConfig = {
//   google: {
//     families: ['Lobster']
//   },
//   loading: () => {
//     console.log('loading');
//   },
//   active: () => {
//     console.log('active');
//   }
// };

WebFont.load({
  google: {
    families: fonts,
  },
  loading: function() {
    console.log('loading')
  },
  active: () => {
    console.log('active');
    update();
  },
});
