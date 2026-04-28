# Hero 섹션 개선 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `index.html`의 nav와 hero2 섹션을 개선해 브랜드 임팩트를 높인다.

**Architecture:** 단일 `index.html` 파일만 수정한다. CSS와 HTML 모두 같은 파일에 있으므로 스타일 변경과 마크업 변경을 순서대로 진행한다.

**Tech Stack:** HTML, CSS, Google Fonts (Cormorant Garamond), Pretendard Variable CDN

---

### Task 1: Google Fonts — Cormorant Garamond 추가

**Files:**
- Modify: `index.html` (line 10 근처, `@import` 블록)

- [ ] **Step 1: Cormorant Garamond import 추가**

`index.html` 상단 `<style>` 블록 안의 기존 `@import` 줄들 바로 아래에 다음을 추가한다:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400;1,600&display=swap');
```

현재 코드:
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
```

변경 후:
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400;1,600&display=swap');
```

- [ ] **Step 2: `--font-display` CSS 변수 추가**

`:root` 블록 안에 다음 변수를 추가한다:

```css
--font-display: 'Cormorant Garamond', 'Times New Roman', serif;
```

- [ ] **Step 3: 브라우저에서 확인**

`index.html`을 브라우저로 열어 네트워크 탭에서 `Cormorant+Garamond` 폰트가 로드되는지 확인한다.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Cormorant Garamond font import"
```

---

### Task 2: Nav — 브랜드 텍스트 폰트 변경

**Files:**
- Modify: `index.html` (`.nav__brand span` CSS, line 100~105)

- [ ] **Step 1: `.nav__brand span` 스타일 수정**

현재:
```css
.nav__brand span {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  letter-spacing: -0.01em;
}
```

변경 후:
```css
.nav__brand span {
  font-family: var(--font-display);
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.01em;
}
```

- [ ] **Step 2: 브라우저에서 확인**

nav의 "TheJiniusLab" 텍스트가 Cormorant Garamond SemiBold로 렌더링되는지 확인한다.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: nav brand text — Cormorant Garamond SemiBold"
```

---

### Task 3: Nav — 메뉴 버튼 → 인스타그램 팔로우 CTA

**Files:**
- Modify: `index.html` (`.nav__menu` CSS + HTML, line 106~117 CSS / line 990~994 HTML)

- [ ] **Step 1: `.nav__menu` CSS를 `.nav__follow`로 교체**

기존 `.nav__menu` CSS 블록을 제거하고 아래로 대체한다:

```css
.nav__follow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: var(--r-pill);
  background: var(--primary);
  color: var(--primary-ink);
  text-decoration: none;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: -0.01em;
  transition: opacity 0.15s ease;
}
.nav__follow:hover { opacity: 0.85; }
.nav__follow svg { flex-shrink: 0; }
```

- [ ] **Step 2: HTML에서 버튼을 링크로 교체**

현재:
```html
<button class="nav__menu" type="button" aria-label="메뉴">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</button>
```

변경 후:
```html
<a class="nav__follow"
   href="https://www.instagram.com/jysk_prof.z?igsh=YTkybHR1dTNzMWxo&utm_source=qr"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="인스타그램 팔로우">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
  </svg>
  팔로우
</a>
```

- [ ] **Step 3: 브라우저에서 확인**

nav 우측에 인스타그램 아이콘 + "팔로우" 버튼이 표시되는지, 클릭 시 인스타그램으로 이동하는지 확인한다.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: nav menu → instagram follow CTA"
```

---

### Task 4: Hero — 상단 캡션 줄 제거

**Files:**
- Modify: `index.html` (`.hero2__brand` CSS + HTML, line 679~686 CSS / line 999 HTML)

- [ ] **Step 1: HTML에서 캡션 줄 제거**

다음 줄을 삭제한다:
```html
<div class="hero2__brand">THEJINIUSLAB · 지성현T · 고1 통합과학</div>
```

- [ ] **Step 2: `.hero2__brand` CSS 블록 제거**

```css
.hero2__brand {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 14px;
}
```
위 블록 전체를 삭제한다.

- [ ] **Step 3: 브라우저에서 확인**

hero 상단에 캡션 줄이 사라지고 사진이 바로 나오는지 확인한다.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: remove hero brand caption line"
```

---

### Task 5: Hero — 사진 오버레이 이름 폰트 및 크기 개선

**Files:**
- Modify: `index.html` (`.hero2__cover-name`, `.hero2__cover-creds` CSS)

- [ ] **Step 1: `.hero2__cover-name` 스타일 수정**

현재:
```css
.hero2__cover-name {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--accent);
  margin-bottom: 4px;
}
```

변경 후:
```css
.hero2__cover-name {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: 40px;
  line-height: 1.0;
  letter-spacing: -0.01em;
  color: var(--accent);
  margin-bottom: 6px;
}
```

- [ ] **Step 2: `.hero2__cover-creds` 스타일 수정**

현재:
```css
.hero2__cover-creds {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: rgba(242,239,232,0.85);
  line-height: 1.5;
}
```

변경 후:
```css
.hero2__cover-creds {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.04em;
  color: rgba(242,239,232,0.85);
  line-height: 1.7;
}
```

- [ ] **Step 3: 브라우저에서 확인**

사진 위 "지성현T" 이름이 크고 우아하게, 경력 텍스트가 더 크고 읽기 쉽게 표시되는지 확인한다.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: hero overlay name larger + Cormorant italic"
```

---

### Task 6: Hero — h1 제목 Pretendard Black 적용

**Files:**
- Modify: `index.html` (`.hero2__title`, `.hero2__title .it` CSS)

- [ ] **Step 1: `.hero2__title` 스타일 수정**

현재:
```css
.hero2__title {
  margin: 0 0 12px;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: 38px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--primary);
}
```

변경 후:
```css
.hero2__title {
  margin: 0 0 12px;
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 48px;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--primary);
}
```

- [ ] **Step 2: `.hero2__title .it` 스타일 수정**

현재:
```css
.hero2__title .it { font-style: italic; }
```

변경 후 (이탤릭 제거, 골드 색상 강조):
```css
.hero2__title .it { font-style: normal; color: var(--accent); }
```

- [ ] **Step 3: 브라우저에서 확인**

"중간 끝, 다음 시험까지 **무엇을** 바꿔야 할까." 텍스트가 굵고 임팩트 있게, "무엇을"이 골드로 강조되어 보이는지 확인한다.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: hero h1 — Pretendard 800, larger, accent highlight"
```

---

## 완료 기준 체크

- [ ] Nav 브랜드 텍스트 — Cormorant Garamond SemiBold
- [ ] Nav CTA — 인스타그램 로고 + "팔로우" 버튼
- [ ] Hero 상단 캡션 줄 없음
- [ ] 사진 오버레이 이름 40px Cormorant italic
- [ ] 경력 텍스트 13px
- [ ] h1 Pretendard 800, 48px, "무엇을" 골드
