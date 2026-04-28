/**
 * Google Drive에 PDF 업로드 후 공개 다운로드 URL 반환
 * 사용법: node scripts/drive-upload.js <pdf_path> <file_name>
 *
 * 인증: scripts/credentials/service-account.json (서비스 계정 키)
 * 업로드 폴더: DRIVE_FOLDER_ID 환경변수 또는 scripts/credentials/config.json
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const [,, pdfPath, fileName] = process.argv;

if (!pdfPath || !fileName) {
  console.error('사용법: node scripts/drive-upload.js <pdf_path> <file_name>');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const CREDS_PATH = path.join(__dirname, 'credentials', 'service-account.json');
const CONFIG_PATH = path.join(__dirname, 'credentials', 'config.json');

if (!fs.existsSync(CREDS_PATH)) {
  console.error('❌ 서비스 계정 키 없음:', CREDS_PATH);
  console.error('   Google Cloud Console → IAM → 서비스 계정 → 키 생성 (JSON) 후 해당 경로에 저장하세요.');
  process.exit(1);
}

const config = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) : {};
const folderId = process.env.DRIVE_FOLDER_ID || config.drive_folder_id || null;

async function upload() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDS_PATH,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: fileName,
    ...(folderId ? { parents: [folderId] } : {}),
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(path.resolve(ROOT, pdfPath)),
  };

  console.log('📤 Google Drive 업로드 중...');
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name',
  });

  const fileId = res.data.id;
  console.log('✅ 업로드 완료. File ID:', fileId);

  // 공개 권한 설정
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  // 직접 다운로드 URL
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  console.log('🔗 다운로드 URL:', downloadUrl);

  // stdout에 URL만 출력 (파이프 처리용)
  process.stdout.write(downloadUrl + '\n');
}

upload().catch(err => {
  console.error('❌ 업로드 실패:', err.message);
  process.exit(1);
});
