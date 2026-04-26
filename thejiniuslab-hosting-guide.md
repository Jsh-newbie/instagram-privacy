# thejiniuslab.com 호스팅 가이드

## 개요

`thejiniuslab.com`은 Cloudflare Pages(정적 사이트) + Cloudflare Workers(API)로 무료 호스팅 중.
Meta 앱 심사용 개인정보 처리방침 및 데이터 삭제 페이지가 배포되어 있으며, 홈페이지로 확장 예정.

---

## 계정 정보

| 서비스 | 계정 | 비고 |
|--------|------|------|
| Cloudflare | tjdeh111@gmail.com | Account ID: `ec95c9a7199595c9e70aaf48dd4a28fa` |
| GitHub | Jsh-newbie | 레포: `instagram-privacy` |
| 도메인 | thejiniuslab.com | Cloudflare에서 관리 |
| 이메일 포워딩 | admin@thejiniuslab.com → Gmail | Cloudflare Email Routing |

---

## 배포 구조

### Cloudflare Pages

- **프로젝트명:** `instagram-privacy`
- **GitHub 레포:** `github.com/Jsh-newbie/instagram-privacy`
- **용도:** 정적 HTML 페이지 호스팅

### Cloudflare Worker

- **Worker명:** `data-deletion-callback`
- **라우트:** `thejiniuslab.com/api/data-deletion`
- **용도:** Meta 데이터 삭제 콜백 (POST 엔드포인트)

---

## 현재 URL 라우팅

| URL | 서비스 | 내용 | 변경 가능 |
|-----|--------|------|-----------|
| `https://thejiniuslab.com/` | Pages | 메인 페이지 (현재 링크 모음) | ✅ 홈페이지로 교체 |
| `https://thejiniuslab.com/privacy/` | Pages | 개인정보 처리방침 | ❌ Meta 심사에 등록됨 |
| `https://thejiniuslab.com/data-deletion/` | Pages | 데이터 삭제 안내 | ❌ Meta 심사에 등록됨 |
| `https://thejiniuslab.com/api/data-deletion` | Worker | Meta 콜백 API | ❌ Meta 심사에 등록됨 |

> **주의:** `/privacy/`, `/data-deletion/`, `/api/data-deletion` 경로는 Meta 앱 심사에 등록되어 있으므로 삭제하거나 경로를 변경하면 안 됨.

---

## 파일 구조

```
instagram-privacy/          ← GitHub 레포 & Cloudflare Pages 소스
├── index.html              ← 메인 페이지 (홈페이지로 교체 대상)
├── privacy/
│   └── index.html          ← 개인정보 처리방침 (유지 필수)
├── data-deletion/
│   └── index.html          ← 데이터 삭제 안내 (유지 필수)
├── data-deletion.html      ← 중복 파일 (정리 가능)
└── CNAME                   ← GitHub Pages용 (Cloudflare Pages에선 불필요, 정리 가능)
```

---

## 배포 방법

### 정적 사이트 (Cloudflare Pages)

```bash
# 1. 로컬에서 파일 수정
cd /tmp/instagram-privacy

# 2. 배포
CLOUDFLARE_ACCOUNT_ID=ec95c9a7199595c9e70aaf48dd4a28fa \
npx wrangler pages deploy . \
  --project-name instagram-privacy \
  --commit-dirty=true

# 3. (선택) GitHub에도 push
git add -A && git commit -m "update" && git push origin main
```

### Worker (API 엔드포인트)

```bash
cd /tmp/data-deletion-worker

CLOUDFLARE_ACCOUNT_ID=ec95c9a7199595c9e70aaf48dd4a28fa \
npx wrangler deploy
```

---

## DNS 레코드 (Cloudflare)

| Type | Name | Content | Proxy | 용도 |
|------|------|---------|-------|------|
| CNAME | @ | instagram-privacy.pages.dev | Proxied | 메인 도메인 → Pages |
| CNAME | privacy | jsh-newbie.github.io | Proxied | 이전 GitHub Pages용 (삭제 가능) |
| MX | @ | route1/2/3.mx.cloudflare.net | DNS only | 이메일 라우팅 |
| TXT | @ | v=spf1 ... | DNS only | 이메일 인증 |
| TXT | cf2024-1._domainkey | v=DKIM1 ... | DNS only | 이메일 인증 |

### SSL 설정
- SSL/TLS 모드: **Flexible**
- Browser ↔ Cloudflare: HTTPS
- Cloudflare ↔ Origin: HTTP

---

## 비용

| 항목 | 비용 |
|------|------|
| Cloudflare Pages | **무료** (무제한 요청/대역폭, 500회 빌드/월) |
| Cloudflare Workers | **무료** (일 10만 요청까지) |
| 도메인 (thejiniuslab.com) | 이미 보유 중 |
| **합계** | **$0/월** |

---

## 홈페이지 확장 시 참고사항

### 할 수 있는 것
- `index.html`을 원하는 홈페이지로 교체
- 새 경로 추가 (예: `/about/`, `/projects/` 등)
- CSS, JS, 이미지 파일 자유롭게 추가
- Cloudflare Workers로 API 엔드포인트 추가

### 지켜야 할 것
- `/privacy/index.html` 유지 (Meta 심사용)
- `/data-deletion/index.html` 유지 (Meta 심사용)
- Worker 라우트 `/api/data-deletion` 유지 (Meta 콜백)

### 기술 제약
- **정적 사이트만 가능** (서버사이드 렌더링 없음)
- HTML/CSS/JS로 구성, React/Vue 등 빌드 후 결과물 배포 가능
- 동적 기능이 필요하면 Cloudflare Workers로 API 추가

---

## 관련 문서

- Meta 앱 심사 가이드: `docs/meta-app-review-guide.md`
- 프로젝트 메인: `CLAUDE.md`
