#!/bin/bash
# ============================================================
# new-item.sh — 새 자료 항목 자동 생성
#
# 사용법:
#   ./scripts/new-item.sh <section> <id> [cover_html] [body_html]
#
# 예시:
#   ./scripts/new-item.sh library library-sci-vocab-1
#   ./scripts/new-item.sh library library-sci-vocab-1 \
#     "자료용 템플릿/표지.html" "자료용 템플릿/본문.html"
#
# 파일명 규칙:
#   {카테고리}-{과목}-{내용}-{번호}
#   소문자 영문+숫자, 단어 구분은 -, 카테고리 prefix 필수
#   예: library-bio-vocab-1, insight-chem-topics-1
# ============================================================

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SECTION="$1"   # library 또는 insight
ITEM_ID="$2"   # 예: library-sci-vocab-1
COVER_HTML="$3"
BODY_HTML="$4"

# ── 인자 검증 ──────────────────────────────────────────────
if [[ -z "$SECTION" || -z "$ITEM_ID" ]]; then
  echo "사용법: ./scripts/new-item.sh <section> <id> [cover_html] [body_html]"
  echo "  section: library 또는 insight"
  echo "  id:      예) library-sci-vocab-1"
  exit 1
fi

if [[ "$SECTION" != "library" && "$SECTION" != "insight" ]]; then
  echo "❌ section은 library 또는 insight 중 하나여야 합니다."
  exit 1
fi

if [[ ! "$ITEM_ID" =~ ^[a-z0-9-]+$ ]]; then
  echo "❌ id는 소문자 영문·숫자·하이픈만 사용 가능합니다. (예: library-sci-vocab-1)"
  exit 1
fi

# ── 디렉토리 생성 ──────────────────────────────────────────
ITEM_DIR="$ROOT/$SECTION/$ITEM_ID"
if [[ -d "$ITEM_DIR" ]]; then
  echo "❌ 이미 존재하는 항목입니다: $ITEM_DIR"
  exit 1
fi

mkdir -p "$ITEM_DIR"
echo "📁 폴더 생성: $ITEM_DIR"

# ── index.html 생성 ────────────────────────────────────────
BACK_URL="/$SECTION/"
BACK_LABEL=$(echo "$SECTION" | sed 's/./\u&/')  # 첫 글자 대문자

cat > "$ITEM_DIR/index.html" << HTML
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>자료 제목 · $(echo "$SECTION" | sed 's/./\u&/') · TheJiniusLab</title>
<meta name="description" content="자료 설명을 여기에 입력하세요." />
<link rel="canonical" href="https://thejiniuslab.com/$SECTION/$ITEM_ID/" />
<link rel="icon" type="image/png" href="/assets/logo-final.png" />
<script>window.ITEM_ID = '$ITEM_ID'; window.DATA_SRC = '/data/$SECTION.json';</script>
<link rel="stylesheet" href="/$SECTION/detail.css" />
</head>
<body>
<div class="page" id="page">
  <nav class="nav">
    <a class="nav__back" href="/$SECTION/">← $BACK_LABEL</a>
    <span class="nav__title">Detail</span>
    <span style="width:48px;"></span>
  </nav>
  <div id="root"></div>
</div>
<div class="float-cta" id="floatCta" style="display:none;">
  <a class="float-cta__btn float-cta__btn--disabled" id="ctaBtn" href="#" aria-disabled="true">자료 다운로드 (준비 중)</a>
  <p class="float-cta__sub">자료 준비 완료 시 인스타그램(@jysk_prof.z)으로 안내드립니다</p>
</div>
<script src="/$SECTION/detail.js"></script>
</body>
</html>
HTML

echo "📄 index.html 생성: $ITEM_DIR/index.html"

# ── JSON 항목 추가 ─────────────────────────────────────────
JSON_FILE="$ROOT/data/$SECTION.json"

python3 << PYEOF
import json, os

json_file = '$JSON_FILE'
item_id   = '$ITEM_ID'
covers    = '$ROOT/assets/covers/' + item_id + '.jpg'
previews  = '$ROOT/assets/previews/' + item_id + '-p1.jpg'

cover_img   = '/assets/covers/'   + item_id + '.jpg' if os.path.exists(covers)   else None
preview_img = '/assets/previews/' + item_id + '-p1.jpg' if os.path.exists(previews) else None

with open(json_file, 'r') as f:
    data = json.load(f)

if any(i['id'] == item_id for i in data['items']):
    print('❌ JSON에 이미 같은 id가 존재합니다:', item_id)
    exit(1)

new_item = {
    "id": item_id,
    "title": "자료 제목을 입력하세요",
    "label": "과목 · 분류",
    "subject": "과목",
    "grade": "고1",
    "type": "PDF",
    "status": "coming_soon",
    "cover_image": cover_img,
    "cover_gradient": "linear-gradient(135deg, #1B3B36 0%, #2d5c54 100%)",
    "preview_images": [cover_img, preview_img],
    "intro": "자료 소개 첫 문장을 입력하세요.",
    "intro_sub": None,
    "targets": ["추천 대상 1", "추천 대상 2", "추천 대상 3"],
    "benefits": ["얻을 수 있는 것 1", "얻을 수 있는 것 2", "얻을 수 있는 것 3"],
    "download_url": None
}

data['items'].append(new_item)

with open(json_file, 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('📋 JSON 항목 추가:', json_file)
PYEOF

# ── 이미지 캡처 (HTML 파일 지정된 경우) ──────────────────────
if [[ -n "$COVER_HTML" && -n "$BODY_HTML" ]]; then
  echo "📸 이미지 캡처 시작..."
  node "$ROOT/scripts/capture.js" "$COVER_HTML" "$BODY_HTML" "$ITEM_ID"

  # 캡처 후 JSON 이미지 경로 업데이트
  python3 << PYEOF2
import json

with open('$JSON_FILE', 'r') as f:
    data = json.load(f)

for item in data['items']:
    if item['id'] == '$ITEM_ID':
        item['cover_image'] = '/assets/covers/$ITEM_ID.jpg'
        item['preview_images'] = [
            '/assets/covers/$ITEM_ID.jpg',
            '/assets/previews/$ITEM_ID-p1.jpg'
        ]
        break

with open('$JSON_FILE', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('🔗 JSON 이미지 경로 업데이트 완료')
PYEOF2
fi

# ── 완료 ──────────────────────────────────────────────────
echo ""
echo "✅ 항목 생성 완료: $ITEM_ID"
echo ""
echo "다음 할 일:"
echo "  1. $ITEM_DIR/index.html — <title>, <meta description> 수정"
echo "  2. $JSON_FILE — title, label, subject, grade, intro, targets, benefits 입력"
echo "  3. 다운로드 링크 준비되면 download_url 입력 후 status를 'available'로 변경"
echo "  4. ./scripts/deploy.sh 로 배포"
