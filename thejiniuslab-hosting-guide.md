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

# 1. 배포
CLOUDFLARE_ACCOUNT_ID=ec95c9a7199595c9e70aaf48dd4a28fa \
npx wrangler pages deploy . \
  --project-name thejiniuslab \
  --commit-dirty=true

# 2. GitHub에도 push (계정 전환 필요)
gh auth switch --user Jsh-newbie
git add -A && git commit -m "update" && git push origin main
```

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
│   └── reviews.json            ← 후기·성적 데이터 (추가 시 여기에)
├── assets/
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

## GitHub 계정 전환

현재 두 개의 GitHub 계정이 등록되어 있음:

```bash
gh auth switch --user Jsh-newbie    # 레포 소유 계정 (push 가능)
gh auth switch --user jy3219937-beep  # 다른 계정
```

push 전 반드시 `Jsh-newbie`로 전환할 것.

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
