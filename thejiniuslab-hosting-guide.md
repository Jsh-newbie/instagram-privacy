# thejiniuslab.com 호스팅 가이드

## 개요

`thejiniuslab.com`은 Cloudflare Pages(정적 사이트) + Cloudflare Workers(API)로 무료 호스팅 중.

> ⚠️ **중요:** Cloudflare Pages 프로젝트가 두 개 존재함. 반드시 `thejiniuslab` 프로젝트로 배포할 것.
> `instagram-privacy` 프로젝트로 배포해도 thejiniuslab.com에 반영되지 않음.

---

## 계정 정보

| 서비스 | 계정 | 비고 |
|--------|------|------|
| Cloudflare | tjdeh111@gmail.com | Account ID: `ec95c9a7199595c9e70aaf48dd4a28fa` |
| GitHub | Jsh-newbie | 레포: `instagram-privacy` |
| 도메인 | thejiniuslab.com | Cloudflare에서 관리 |
| 이메일 포워딩 | admin@thejiniuslab.com → Gmail | Cloudflare Email Routing |

---

## Cloudflare Pages 프로젝트 현황

| 프로젝트명 | 도메인 | thejiniuslab.com 연결 | 용도 |
|-----------|--------|----------------------|------|
| **thejiniuslab** | thejiniuslab.pages.dev | ✅ **연결됨 (active)** | **실제 운영 — 여기로 배포** |
| instagram-privacy | instagram-privacy.pages.dev | ❌ 연결 안 됨 | 구버전, 사용 안 함 |

---

## 배포 방법

### 정적 사이트 (Cloudflare Pages) — 반드시 `thejiniuslab` 프로젝트 사용

```bash
# 작업 디렉토리: /Users/sunghyunji/개발/homepage

# 1. 배포 (deploy.sh 사용 — 25MB 초과 파일 자동 제외)
./deploy.sh

# 2. GitHub에도 push
git add -A && git commit -m "update" && git push origin main
```

> **`deploy.sh`를 사용하는 이유:** Cloudflare Pages는 25MB 초과 파일을 업로드할 수 없음.
> `files/prof.Z 홍보 동영상.mp4` (26.9MB)가 해당됨. `deploy.sh`가 배포 전 자동으로 임시 제외하고 완료 후 복구함.
> wrangler `pages deploy`에는 파일 제외 옵션이 없어 스크립트로 우회함.

> ⚠️ **직접 `wrangler pages deploy` 명령어를 쓰면 오류 발생.** 반드시 `./deploy.sh` 사용.

### Worker (API 엔드포인트)

```bash
CLOUDFLARE_ACCOUNT_ID=ec95c9a7199595c9e70aaf48dd4a28fa \
npx wrangler deploy
```

---

## URL 라우팅

| URL | 내용 | 변경 가능 |
|-----|------|-----------|
| `https://thejiniuslab.com/` | 메인 홈페이지 | ✅ |
| `https://thejiniuslab.com/library/` | 공개 자료 목록 | ✅ |
| `https://thejiniuslab.com/insight/` | 세특 자료 목록 | ✅ |
| `https://thejiniuslab.com/privacy/` | 개인정보 처리방침 | ❌ Meta 심사 등록됨 |
| `https://thejiniuslab.com/data-deletion/` | 데이터 삭제 안내 | ❌ Meta 심사 등록됨 |
| `https://thejiniuslab.com/api/data-deletion` | Meta 콜백 API (Worker) | ❌ Meta 심사 등록됨 |

> **주의:** `/privacy/`, `/data-deletion/`, `/api/data-deletion` 경로는 Meta 앱 심사에 등록되어 있으므로 삭제하거나 경로를 변경하면 안 됨.

---

## 파일 구조

```
homepage/                       ← 로컬 작업 디렉토리
├── index.html                  ← 메인 홈페이지
├── library/
│   ├── index.html              ← 공개 자료 목록
│   ├── integrated-1/           ← 단원별 핵심 정리 1단원
│   ├── biology-25/             ← 생명 시스템 핵심 25제
│   └── physics-error/          ← 물리 단원 오답 패턴 분석
├── insight/
│   ├── index.html              ← 세특 자료 목록
│   ├── chem-topics/            ← 화학 진로 탐구 주제 12선
│   ├── bio-topics/             ← 생명 진로 탐구 주제 12선
│   └── report-template/        ← 보고서 양식
├── data/
│   ├── reviews.json            ← 후기·성적 데이터
│   ├── library.json            ← 공개 자료 목록 및 상세 데이터
│   └── insight.json            ← 세특 자료 목록 및 상세 데이터
├── assets/
│   ├── covers/                 ← 자료 커버 이미지 (= 미리보기 첫 번째)
│   ├── previews/               ← 자료 내용 미리보기 이미지 (두 번째)
│   ├── logo-final.png
│   └── profile-green.jpg
├── privacy/
│   └── index.html              ← 개인정보 처리방침 (유지 필수)
├── data-deletion/
│   └── index.html              ← 데이터 삭제 안내 (유지 필수)
├── _headers                    ← Cloudflare 캐시 설정
├── _redirects                  ← Cloudflare 리다이렉트 설정
└── sitemap.xml
```

---

## 자료 관리 (Library / Insight)

> 상세 페이지는 JS가 JSON을 읽어서 렌더링함. **HTML은 건드리지 않아도 됨.**

### 자료 추가 (`data/library.json` 또는 `data/insight.json`)

**1단계 — JSON에 항목 추가**

```json
{
  "id": "new-item",
  "title": "자료 제목",
  "label": "과목 · 분류",
  "subject": "통합과학",
  "grade": "고1",
  "type": "PDF",
  "status": "coming_soon",
  "cover_image": null,
  "cover_gradient": "linear-gradient(135deg, #1B3B36 0%, #2d5c54 100%)",
  "preview_images": [null, null],
  "intro": "자료 소개 첫 문장 (굵게 표시됨)",
  "intro_sub": "자료 소개 두 번째 문단 (선택)",
  "targets": ["추천 대상 1", "추천 대상 2", "추천 대상 3"],
  "benefits": ["얻을 수 있는 것 1", "얻을 수 있는 것 2", "얻을 수 있는 것 3"],
  "download_url": null
}
```

**2단계 — 상세 페이지 폴더 생성**

```bash
mkdir library/new-item
```

`library/integrated-1/index.html`을 복사해서 붙여넣고, 첫 번째 `<script>` 태그의 `ITEM_ID`만 변경:

```html
<script>window.ITEM_ID = 'new-item'; window.DATA_SRC = '/data/library.json'; ...</script>
```

`<title>`, `<meta name="description">`, `<link rel="canonical">`도 자료에 맞게 수정.

---

### 커버 이미지 추가

```
assets/covers/new-item.jpg   ← 표지 이미지 (4:3 비율 권장)
```

JSON에서:
```json
"cover_image": "/assets/covers/new-item.jpg"
```

→ 커버 영역과 미리보기 첫 번째 슬롯에 자동 반영됨.

---

### 내용 미리보기 이미지 추가

```
assets/previews/new-item-p1.jpg   ← 실제 내용 페이지 캡처
```

JSON에서:
```json
"preview_images": [null, "/assets/previews/new-item-p1.jpg"]
```

첫 번째 값은 `null` 그대로 두면 커버 이미지가 자동으로 들어감.

---

### 다운로드 활성화

PDF를 외부(Google Drive, S3 등)에 업로드하고 공개 링크를 복사한 뒤:

```json
"status": "available",
"download_url": "https://..."
```

→ 하단 버튼이 자동으로 활성화됨.

---

### 자료 수정

내용만 바꿀 때는 해당 JSON 파일만 수정 후 배포.  
커버/미리보기 이미지를 교체할 때는 `assets/`에 파일을 덮어쓴 후 배포.

---

## 데이터 관리

### 후기·성적 추가 (`data/reviews.json`)

후기 추가:
```json
{
  "id": "t010",
  "type": "short",
  "student": { "name": null, "name_public": false, "school": null, "grade_at_time": "고1", "status": "재학" },
  "subject": "통합과학",
  "year": 2026,
  "term": "1학기",
  "quote": "후기 내용",
  "full_text": null,
  "grade_change": null
}
```

성적 추가:
```json
{
  "id": "s010",
  "student": { "name": "홍길동", "school": "OO고", "grade": "고1" },
  "subject": "통합과학",
  "score": 98.5,
  "score_type": "점수",
  "exam": "중간고사",
  "year": 2026,
  "term": "1학기"
}
```

---

## GitHub 계정

현재 두 개의 GitHub 계정이 등록되어 있음:

| 계정 | 용도 |
|------|------|
| **Jsh-newbie** | 레포 소유 계정 — push 가능 |
| jy3219937-beep | 다른 계정 |

**자동 전환:** `.git/hooks/pre-push` 훅이 설정되어 있어 push 시 자동으로 `Jsh-newbie` 계정으로 전환됨. 별도 수동 전환 불필요.

git user도 이 레포에 고정되어 있음:
```
user.name = Jsh-newbie
user.email = tjdeh111@gmail.com
```

---

## DNS 레코드 (Cloudflare)

| Type | Name | Content | Proxy | 용도 |
|------|------|---------|-------|------|
| CNAME | @ | thejiniuslab.pages.dev | Proxied | 메인 도메인 → Pages |
| MX | @ | route1/2/3.mx.cloudflare.net | DNS only | 이메일 라우팅 |
| TXT | @ | v=spf1 ... | DNS only | 이메일 인증 |
| TXT | cf2024-1._domainkey | v=DKIM1 ... | DNS only | 이메일 인증 |

---

## 비용

| 항목 | 비용 |
|------|------|
| Cloudflare Pages | **무료** |
| Cloudflare Workers | **무료** (일 10만 요청까지) |
| 도메인 (thejiniuslab.com) | 이미 보유 중 |
| **합계** | **$0/월** |
