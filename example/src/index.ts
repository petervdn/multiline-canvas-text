import { drawText } from "../../src";
const WebFont = require('webfontloader');

const fonts = ['Arial', 'Varela Round', 'Lobster', 'Roboto', 'Acme', 'Gloria Hallelujah'  ];
const selectList = <HTMLInputElement>document.querySelector("#fontSelect");


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
const widthValue = <HTMLInputElement>document.querySelector('#widthValue');
const fontSizeValue = <HTMLInputElement>document.querySelector('#fontSizeValue');
const lineSpacingValue = <HTMLInputElement>document.querySelector('#lineSpacingValue');
const renderSelect = <HTMLInputElement>document.querySelector('#renderSelect');

function update() {
  const width = parseInt(widthInput.value, 10);
  const fontSize = parseInt(fontSizeInput.value, 10);
  const spacing = parseInt(spacingInput.value, 10);
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }
  const result = drawText(
    textInput.value,
    width,
    selectList.value,
    fontSize,
    spacing,
    'white',
    renderSelect.value === 'strokeText'
  );
  resultContainer.appendChild(result.canvas);

  resultContainer.style.width = `${result.canvas.width}px`;
  resultContainer.style.height = `${result.canvas.height}px`;

  widthValue.innerText = width.toString();
  fontSizeValue.innerText = fontSize.toString();
  lineSpacingValue.innerText = spacing.toString();
}

[renderSelect, textInput, widthInput, spacingInput, fontSizeInput, selectList].forEach(input => {
  input.addEventListener('input', update);
});

textInput.value = 'The quick brown fox jumps over the lazy dog';
update();


WebFont.load({
  google: {
    families: fonts,
  },
  active: () => {
    update();
  },
});
