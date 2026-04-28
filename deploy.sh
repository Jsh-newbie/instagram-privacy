#!/bin/bash
set -e

LARGE_FILES=(
  "files/prof.Z 홍보 동영상.mp4"
)

TEMP_DIR="/tmp/homepage_deploy_exclude"
mkdir -p "$TEMP_DIR"

# 큰 파일 임시 이동
for f in "${LARGE_FILES[@]}"; do
  if [ -f "$f" ]; then
    mv "$f" "$TEMP_DIR/"
  fi
done

# 배포
CLOUDFLARE_ACCOUNT_ID=ec95c9a7199595c9e70aaf48dd4a28fa \
  npx wrangler pages deploy . \
  --project-name thejiniuslab \
  --commit-dirty=true

STATUS=$?

# 복구
for f in "${LARGE_FILES[@]}"; do
  BASENAME=$(basename "$f")
  if [ -f "$TEMP_DIR/$BASENAME" ]; then
    mv "$TEMP_DIR/$BASENAME" "$f"
  fi
done

exit $STATUS
