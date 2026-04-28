/**
 * 표지 + 본문 HTML → 단일 PDF 생성
 * 사용법: node scripts/pdf.js <cover_html> <body_html> <output_pdf>
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const [,, coverHtml, bodyHtml, outputPdf] = process.argv;

if (!coverHtml || !bodyHtml || !outputPdf) {
  console.error('사용법: node scripts/pdf.js <cover_html> <body_html> <output_pdf>');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');

async function buildPdf() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const buffers = [];

  // 표지
  const coverPath = 'file://' + path.resolve(ROOT, coverHtml);
  await page.goto(coverPath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  buffers.push(await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  }));

  // 본문 (각 .page 요소를 개별 페이지로)
  const bodyPath = 'file://' + path.resolve(ROOT, bodyHtml);
  await page.goto(bodyPath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  buffers.push(await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  }));

  await browser.close();

  // PDF 병합 (바이너리 단순 concat은 안 되므로 pdf-lib 사용)
  const { PDFDocument } = require('pdf-lib');

  const merged = await PDFDocument.create();
  for (const buf of buffers) {
    const doc = await PDFDocument.load(buf);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }

  const outDir = path.dirname(path.resolve(ROOT, outputPdf));
  fs.mkdirSync(outDir, { recursive: true });

  const mergedBytes = await merged.save();
  fs.writeFileSync(path.resolve(ROOT, outputPdf), mergedBytes);
  console.log('✅ PDF 생성:', path.resolve(ROOT, outputPdf));
}

buildPdf().catch(err => {
  console.error('❌ PDF 생성 실패:', err.message);
  process.exit(1);
});
