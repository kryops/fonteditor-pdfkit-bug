const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');


const outDir = path.join(__dirname, 'dist');

fs.mkdirSync(outDir, { recursive: true })

const sourceFontPath = path.join(__dirname, 'Roboto-Regular.ttf');

const sourceFont = fs.readFileSync(sourceFontPath);

function createPdfWithFont(name, font) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path.join(outDir, name + '.pdf')));
  doc
    .font(font)
    .fontSize(25)
    .text('Some text with an embedded font!', 100, 100);

  doc.end();
}

function applyFontEditor(name, fontEditor) {
  const fontBuffer = fontEditor.Font.create(sourceFont, { type: 'ttf' }).write({ type: 'ttf' })
  fs.writeFileSync(path.join(outDir, name + '.ttf'), fontBuffer);
  createPdfWithFont(name, fontBuffer);
}

createPdfWithFont('sourceFont', sourceFont);

applyFontEditor('fontEditor-current', require('fonteditor-core-current'));
applyFontEditor('fontEditor-2.1.1', require('fonteditor-core-211'));
applyFontEditor('fontEditor-2.1.2', require('fonteditor-core-212'));
