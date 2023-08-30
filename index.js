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

const font_211 = require('fonteditor-core-211').Font.create(sourceFont, { type: 'ttf' });
const createdFont_211 = require('fonteditor-core-211').Font.create(font_211.write({ type: 'ttf' }), { type: 'ttf' });

function objectDiff(name, a, b) {
  Object.entries(a).forEach(([key, value]) => {
    if (b[key] !== value && !(value instanceof Date)) {
      console.warn(`${name}.${key}: ${value} => ${b[key]}`)
    }
  })
}

function applyFontEditor(name, fontEditor) {
  console.log('>>> ', name)

  const font = fontEditor.Font.create(sourceFont, { type: 'ttf' });
  const fontBuffer = font.write({ type: 'ttf' })
  
  const createdFont = fontEditor.Font.create(fontBuffer, { type: 'ttf' });

  ['OS/2', 'hhea', 'head', 'maxp'].forEach(property => {
    // objectDiff('[read > written] ' + property, font.get()[property], createdFont.get()[property])
    objectDiff('[diff to 2.1.1] ' + property, createdFont_211.get()[property], createdFont.get()[property])
  });

  fs.writeFileSync(path.join(outDir, name + '.ttf'), fontBuffer);
  createPdfWithFont(name, fontBuffer);
}

createPdfWithFont('sourceFont', sourceFont);

applyFontEditor('fontEditor-current', require('fonteditor-core-current'));
// applyFontEditor('fontEditor-2.1.1', require('fonteditor-core-211'));
applyFontEditor('fontEditor-2.1.2', require('fonteditor-core-212'));
