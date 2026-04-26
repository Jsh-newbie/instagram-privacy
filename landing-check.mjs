import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const siteRoot = '/tmp/instagram-privacy';
const html = readFileSync(join(siteRoot, 'index.html'), 'utf8');

const requiredText = [
  '고1 첫 과학 시험 전, 방향이 안 잡힌다면',
  '첫 시험 전, 무엇을 먼저 해야 할지 명확해집니다.',
  '3분 진단 흐름',
  '문제는 공부량이 아니라 순서입니다.',
  '정리되면 이렇게 바뀝니다.',
  '숫자로 보는 현재 신뢰',
  '무료 진단에서 확인하는 3가지',
  '시험 범위와 수행평가 주제가 확정되기 전에',
  '맞지 않으면 수업 등록 없이 종료해도 됩니다.',
  'P.S.',
  '무료 진단 상담 신청하기',
  '지성현T',
  'TheJiniusLab 운영자',
  '현 정율사관학원 과학과 팀장',
  'UNIST 생명과학 전공',
  '고1 통합과학이 고민이에요',
  '고2 선택과목이 고민이에요',
  '수행평가·탐구·세특이 고민이에요',
  '무료 가이드북 다운로드',
  '상담 신청하기',
  '학생 이름',
  '학생 또는 학부모 연락처',
  '인스타 아이디',
  '희망 연락 방식',
  '개인정보 수집·이용 동의',
  '자료 및 수업 안내 수신 동의',
  '상담 내용 복사하고 인스타 DM 열기',
];

for (const text of requiredText) {
  assert.ok(html.includes(text), `Missing required text: ${text}`);
}

assert.ok(html.includes('data-event="landing_view"'), 'landing_view event marker is missing');
assert.ok(html.includes('/api/events'), 'event API endpoint is missing');
assert.ok(html.includes('/api/consultations'), 'consultation API endpoint is missing');
assert.ok(html.includes('/api/schools/search'), 'school search API endpoint is missing');
assert.ok(html.includes('utm_source'), 'UTM tracking handling is missing');
assert.ok(html.includes('/assets/2026-freshman-guide.pdf'), 'guide PDF link is missing');
assert.ok(html.includes('/assets/profile.jpg'), 'profile image is missing from landing page');
assert.ok(html.includes('class="hero__portrait"'), 'hero portrait block is missing');
assert.ok(!html.includes('class="hero__media"'), 'profile image should not be used as a full-bleed hero background');
assert.ok(html.includes('/assets/thejiniuslab-mark.png'), 'brand mark is missing from landing page');
assert.ok(
  existsSync(join(siteRoot, 'assets', '2026-freshman-guide.pdf')),
  'guide PDF asset is missing'
);
assert.ok(
  existsSync(join(siteRoot, 'assets', 'profile.jpg')),
  'profile image asset is missing'
);
assert.ok(
  existsSync(join(siteRoot, 'assets', 'thejiniuslab-mark.png')),
  'brand mark asset is missing'
);

console.log('landing requirements satisfied');
