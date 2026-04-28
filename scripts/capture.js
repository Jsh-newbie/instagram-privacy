/**
 * 표지/본문 HTML에서 커버·미리보기 이미지 자동 캡처
 * 사용법: node scripts/capture.js <cover_html> <body_html> <item_id>
 *
 * 예시: node scripts/capture.js \
 *   "자료용 템플릿/표지.html" \
 *   "자료용 템플릿/본문.html" \
 *   library-sci-vocab-1
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const [,, coverHtml, bodyHtml, itemId] = process.argv;

if (!coverHtml || !bodyHtml || !itemId) {
  console.error('사용법: node scripts/capture.js <cover_html> <body_html> <item_id>');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const COVERS_DIR = path.join(ROOT, 'assets', 'covers');
const PREVIEWS_DIR = path.join(ROOT, 'assets', 'previews');

fs.mkdirSync(COVERS_DIR, { recursive: true });
fs.mkdirSync(PREVIEWS_DIR, { recursive: true });

// A4 픽셀 사이즈 (96dpi 기준)
const A4_W = 794;
const A4_H = 1123;

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: A4_W, height: A4_H, deviceScaleFactor: 2 });

  // 1. 커버 이미지 캡처 (표지 첫 페이지)
  const coverPath = path.resolve(ROOT, coverHtml);
  await page.goto('file://' + coverPath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const coverEl = await page.$('.page');
  const coverOut = path.join(COVERS_DIR, itemId + '.jpg');
  await coverEl.screenshot({ path: coverOut, type: 'jpeg', quality: 92 });
  console.log('✅ 커버 이미지:', coverOut);

  // 2. 본문 미리보기 이미지 캡처 (본문 첫 페이지)
  const bodyPath = path.resolve(ROOT, bodyHtml);
  await page.goto('file://' + bodyPath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const pages = await page.$$('.page');
  if (pages.length > 0) {
    const previewOut = path.join(PREVIEWS_DIR, itemId + '-p1.jpg');
    await pages[0].screenshot({ path: previewOut, type: 'jpeg', quality: 92 });
    console.log('✅ 미리보기 이미지:', previewOut);
  }

  await browser.close();
  console.log('🎉 캡처 완료');
}

capture().catch(err => {
  console.error('❌ 캡처 실패:', err.message);
  process.exit(1);
});
