#!/bin/bash
# ============================================================
# deploy.sh — 빌드 + git push + Cloudflare Pages 배포
#
# 사용법:
#   ./scripts/deploy.sh [commit message]
#
# 예시:
#   ./scripts/deploy.sh
#   ./scripts/deploy.sh "library-sci-vocab-1 자료 추가"
# ============================================================

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMMIT_MSG="${1:-"update"}"

echo "🚀 배포 시작"
echo "──────────────────────────────"

# ── 1. git 상태 확인 ──────────────────────────────────────
echo "📋 변경된 파일:"
git status --short

if [[ -z "$(git status --short)" ]]; then
  echo "ℹ️  변경 사항 없음 — 배포만 진행합니다."
else
  # ── 2. git add + commit + push ──────────────────────────
  echo ""
  echo "📦 git commit: $COMMIT_MSG"
  git add -A
  git commit -m "$COMMIT_MSG"
  git push origin main
  echo "✅ git push 완료"
fi

echo ""

# ── 3. Cloudflare Pages 배포 ──────────────────────────────
echo "☁️  Cloudflare Pages 배포 중..."
CLOUDFLARE_ACCOUNT_ID=ec95c9a7199595c9e70aaf48dd4a28fa \
npx wrangler pages deploy . \
  --project-name thejiniuslab \
  --commit-dirty=true

echo ""
echo "✅ 배포 완료"
echo "🌐 https://thejiniuslab.com"
