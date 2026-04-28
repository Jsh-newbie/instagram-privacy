#!/bin/bash
# ============================================================
# publish.sh — HTML → PDF → Google Drive 업로드 → 배포 자동화
#
# 사용법:
#   ./scripts/publish.sh <item_id> <cover_html> <body_html>
#
# 예시:
#   ./scripts/publish.sh library-sci-vocab-integrated \
#     "자료용 템플릿/표지_통합.html" \
#     "자료용 템플릿/예비고1_통합_본문.html"
#
# 사전 준비:
#   1. scripts/credentials/service-account.json — Google 서비스 계정 키
#   2. scripts/credentials/config.json — { "drive_folder_id": "..." }
# ============================================================

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ITEM_ID="$1"
COVER_HTML="$2"
BODY_HTML="$3"

if [[ -z "$ITEM_ID" || -z "$COVER_HTML" || -z "$BODY_HTML" ]]; then
  echo "사용법: ./scripts/publish.sh <item_id> <cover_html> <body_html>"
  exit 1
fi

PDF_PATH="files/pdf/${ITEM_ID}.pdf"
JSON_FILE="data/library.json"

# JSON에서 제목·등급 읽어서 파일명 생성
PDF_NAME=$(python3 -c "
import json, re
with open('$JSON_FILE') as f:
    data = json.load(f)
for item in data['items']:
    if item['id'] == '$ITEM_ID':
        title = item.get('title', '$ITEM_ID')
        grade = item.get('grade', '')
        name = (grade + ' ' + title).strip() if grade else title
        # 파일명에 쓸 수 없는 문자 제거
        name = re.sub(r'[/\\\\:*?\"<>|]', '', name)
        print(name + '.pdf')
        break
")

if [[ -z "$PDF_NAME" ]]; then
  PDF_NAME="${ITEM_ID}.pdf"
fi

echo "🚀 publish 시작: $ITEM_ID"
echo "──────────────────────────────"

# ── 1. PDF 생성 ───────────────────────────────────────────
echo "📄 PDF 생성 중..."
node "$ROOT/scripts/pdf.js" "$COVER_HTML" "$BODY_HTML" "$PDF_PATH"

# ── 2. Google Drive 업로드 ────────────────────────────────
echo "☁️  Google Drive 업로드 중... ($PDF_NAME)"
DOWNLOAD_URL=$(node "$ROOT/scripts/drive-upload.js" "$PDF_PATH" "$PDF_NAME" 2>&1 | tee /dev/stderr | grep '^https://' | tail -1)

if [[ -z "$DOWNLOAD_URL" ]]; then
  echo "❌ 다운로드 URL을 가져오지 못했습니다."
  exit 1
fi

echo "🔗 다운로드 URL: $DOWNLOAD_URL"

# ── 3. library.json 업데이트 ──────────────────────────────
echo "📋 library.json 업데이트 중..."
python3 << PYEOF
import json

with open('$JSON_FILE', 'r') as f:
    data = json.load(f)

updated = False
for item in data['items']:
    if item['id'] == '$ITEM_ID':
        item['download_url'] = '$DOWNLOAD_URL'
        item['status'] = 'available'
        updated = True
        break

if not updated:
    print('❌ $ITEM_ID 항목을 찾을 수 없습니다.')
    exit(1)

with open('$JSON_FILE', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('✅ library.json 업데이트 완료')
PYEOF

# ── 4. 배포 ──────────────────────────────────────────────
echo "🚀 배포 중..."
git add "$JSON_FILE"
git commit -m "${ITEM_ID} 자료 공개"
git push origin main
./deploy.sh

echo ""
echo "✅ 완료: $ITEM_ID"
echo "🔗 다운로드: $DOWNLOAD_URL"
