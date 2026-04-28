# Hero 섹션 개선 설계

## 개요

`index.html`의 상단 nav와 hero2 섹션을 개선한다. 핵심 목표는 브랜드 인상 강화와 제목 임팩트 향상이다.

---

## 변경 사항

### 1. Nav — 브랜드 텍스트 폰트

- **변경 전**: `Instrument Serif italic`
- **변경 후**: `Cormorant Garamond SemiBold` (weight 600, non-italic)
- Google Fonts import 추가: `Cormorant+Garamond:wght@600`

### 2. Nav — 메뉴 버튼 제거 → CTA 버튼으로 교체

- **변경 전**: 햄버거 아이콘 버튼 (`.nav__menu`) — 클릭 시 아무 동작 없음
- **변경 후**: 인스타그램 로고 SVG + "팔로우" 텍스트 버튼
  - `<a>` 태그, `href="https://www.instagram.com/jysk_prof.z?igsh=YTkybHR1dTNzMWxo&utm_source=qr"`
  - `target="_blank" rel="noopener noreferrer"`
  - 스타일: 작은 pill 버튼, 배경 `#1B3B36`, 텍스트 `#F2EFE8`
  - 인스타그램 SVG 아이콘 (16×16) + "팔로우" 텍스트

### 3. Hero — 상단 캡션 줄 제거

- **변경 전**: `<div class="hero2__brand">THEJINIUSLAB · 지성현T · 고1 통합과학</div>`
- **변경 후**: 해당 요소 완전 제거. `.hero2__brand` CSS도 함께 제거.

### 4. Hero — 사진 오버레이 이름 폰트 및 크기

- **변경 전**: `.hero2__cover-name` — `font-size: 28px`, `Instrument Serif italic`
- **변경 후**: `Cormorant Garamond italic`, `font-size: 40px`, `font-weight: 600`

### 5. Hero — 사진 오버레이 경력 텍스트 크기

- **변경 전**: `.hero2__cover-creds` — `font-size: 10.5px`
- **변경 후**: `font-size: 13px`, `line-height: 1.7`

### 6. Hero — h1 제목 폰트

- **변경 전**: `.hero2__title` — `Instrument Serif`, `font-size: 38px`
- **변경 후**: `Pretendard Variable`, `font-weight: 800`, `font-size: 48px`, `letter-spacing: -0.03em`, `line-height: 1.05`
- `.it` (이탤릭 강조 span) → `font-style: normal`, `color: var(--accent)` 유지

---

## 영향 범위

- `index.html` 단일 파일만 수정
- `privacy/index.html`, `data-deletion/index.html` 미영향
- 추가 asset 없음 (Cormorant Garamond는 이미 Google Fonts에서 로드 가능)

---

## 완료 기준

- [ ] Nav에 Cormorant Garamond 브랜드 텍스트 적용
- [ ] 햄버거 버튼 → 인스타그램 팔로우 CTA 버튼으로 교체
- [ ] 상단 캡션 줄 제거
- [ ] 사진 오버레이 이름 크게, Cormorant italic 적용
- [ ] 경력 텍스트 크기 증가
- [ ] h1 제목 Pretendard 800 적용, 크기 증가
