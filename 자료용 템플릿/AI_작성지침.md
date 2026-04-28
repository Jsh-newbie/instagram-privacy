# prof.Z 자료 본문 작성 지침

## 파일 구조

```
자료용 템플릿/
├── 표지.html       ← 표지 (내용만 교체해서 사용)
├── 본문.html       ← 본문 템플릿 (이 지침 참고해서 작성)
└── AI_작성지침.md  ← 이 파일
```

---

## 페이지 레이아웃 기준

```
┌─────────────────────────────────────────┐
│ 상단 패딩              12mm             │
│ 헤더                   ≈ 10.5mm        │
│ 섹션타이틀             ≈ 14mm (있을 때) │
├─────────────────────────────────────────┤
│ 카드 가용 높이                           │
│   섹션타이틀 있음  →  242mm             │
│   섹션타이틀 없음  →  256mm             │
├─────────────────────────────────────────┤
│ 푸터                   ≈ 7.5mm         │
│ 하단 패딩              10mm             │
└─────────────────────────────────────────┘
```

---

## 페이지 클래스 사용 규칙

| 페이지 유형 | 클래스 | 카드 가용 높이 |
|---|---|---|
| 섹션 시작 페이지 (타이틀 있음) | `class="page page--with-title"` | 242mm |
| 이어지는 페이지 (타이틀 없음) | `class="page"` | 256mm |

```html
<!-- 섹션 시작 페이지 -->
<article class="page page--with-title">
  <header class="head">...</header>
  <div class="section-title">...</div>
  <div class="cards">...</div>
  <footer class="foot">...</footer>
</article>

<!-- 이어지는 페이지 -->
<article class="page">
  <header class="head">...</header>
  <div class="cards">...</div>
  <footer class="foot">...</footer>
</article>
```

---

## 카드 유형별 높이 기준

| 유형 | 구성 요소 | 대략적인 높이 |
|---|---|---|
| 정의만 | `.def` | ≈ 18mm |
| 기본형 | `.def` + `ul.ex` | ≈ 28mm |
| 고등연계 포함 | `.def` + `ul.ex` + `.hs` | ≈ 36mm |
| 참고 포함 | `.def` + `ul.ex` + `.note` | ≈ 36mm |

카드 사이 gap: **2.5mm**

### 페이지당 카드 수 예시 (참고용)

| 카드 유형 | 섹션타이틀 있음 (242mm) | 섹션타이틀 없음 (256mm) |
|---|---|---|
| 정의만 (18mm) | 최대 11개 | 최대 12개 |
| 기본형 (28mm) | 최대 7개 | 최대 8개 |
| 고등연계 (36mm) | 최대 5개 | 최대 6개 |
| 혼합 | 총 합산해서 가용치 이하로 | |

> **반드시 카드 총 높이를 합산해서 가용치를 초과하면 새 `<article class="page">`를 추가할 것**

---

## 카드 HTML 구조

```html
<section class="card">
  <!-- 용어명 (항상 포함) -->
  <div class="term-head">
    <div class="term-ko">용어명</div>
    <div class="term-en">English Term</div>
  </div>

  <!-- 정의 (항상 포함) -->
  <p class="def">정의 내용.</p>

  <!-- 예시 (선택) -->
  <ul class="ex">
    <li>예시 1</li>
    <li>예시 2</li>
  </ul>

  <!-- 고등 연계 (선택) -->
  <div class="hs">고등 과정에서 어떻게 확장되는지 한 줄.</div>

  <!-- 참고/보충 (선택) -->
  <div class="note">보충 설명 또는 시험 출제 포인트.</div>
</section>
```

---

## 헤더 / 푸터 작성 규칙

```html
<!-- 헤더: 좌측 = 과목명, 우측 = SNS -->
<header class="head">
  <div class="section">과목명</div>
  <div class="right">@jysk_prof.z</div>
</header>

<!-- 푸터: 좌측 = 자료명, 우측 = SNS + 페이지 번호 -->
<footer class="foot">
  <div class="doc">자료 시리즈명 · 편 제목</div>
  <div class="right">
    <span class="sns">@jysk_prof.z</span>
    <span class="pg">01</span>  ← 페이지 번호 직접 기입
  </div>
</footer>
```

---

## 작성 순서

1. `본문.html`을 복사해서 새 파일로 시작
2. 기존 예시 카드 내용을 모두 지우고 실제 내용으로 교체
3. 카드 높이 합산 → 가용치 초과 시 새 `<article class="page">` 추가
4. 헤더의 과목명, 푸터의 자료명·페이지 번호 수정
5. 브라우저에서 열어 확인 → Ctrl+P(Cmd+P) → PDF 저장

---

## 주의사항

- 카드는 절대 중간에 잘리지 않음 (`break-inside: avoid` 적용됨)
- `.page`의 `height: 297mm`는 고정 — 카드 내용이 넘치면 잘릴 수 있으므로 반드시 새 페이지로 분리할 것
- 카드 내용이 길어지면 높이 기준보다 커질 수 있으므로 여유 있게 페이지를 나눌 것
- 폰트·컬러·여백은 수정하지 말 것 (브랜드 통일성 유지)
