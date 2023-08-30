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
  console.log('>>> ', name)

  const font = fontEditor.Font.create(sourceFont, { type: 'ttf' });
  const os2 = font.get()['OS/2'];

  const fontBuffer = font.write({ type: 'ttf' })
  
  const createdFont = fontEditor.Font.create(fontBuffer, { type: 'ttf' });
  const newOs2 = createdFont.get()['OS/2'];

  Object.entries(os2).forEach(([key, value]) => {
    if (newOs2[key] !== value) {
      console.warn(`${key}: ${value} => ${newOs2[key]}`)
    }
  })
  
  fs.writeFileSync(path.join(outDir, name + '.ttf'), fontBuffer);
  createPdfWithFont(name, fontBuffer);
}

createPdfWithFont('sourceFont', sourceFont);

applyFontEditor('fontEditor-current', require('fonteditor-core-current'));
applyFontEditor('fontEditor-2.1.1', require('fonteditor-core-211'));
applyFontEditor('fontEditor-2.1.2', require('fonteditor-core-212'));
