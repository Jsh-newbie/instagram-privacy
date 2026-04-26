// Instagram Long-Lived User Access Token 자동 갱신
//
// Instagram 토큰은 60일에 만료된다. 만료 *전에* /refresh_access_token을
// 호출하면 60일이 추가로 연장된다. 만료된 토큰은 갱신 불가.
//
// 사용:
//   node refresh-token.mjs
//
// 환경변수:
//   IG_TOKEN_FILE   — 현재 토큰을 읽을 파일 경로 (예: /data/ig-token.txt)
//                     이 파일이 없으면 IG_TOKEN 환경변수에서 읽음
//   IG_TOKEN        — IG_TOKEN_FILE이 없을 때 fallback
//
// 동작:
//   1) 현재 토큰을 읽어 /me?fields=user_id로 살아있는지 확인
//   2) /refresh_access_token 호출
//   3) 새 토큰을 IG_TOKEN_FILE에 덮어씀 (atomic write)
//
// cron: 매주 한 번 실행하면 안전 (60일 만료 전에 충분히 여러 번 갱신 시도)

import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const TOKEN_FILE = process.env.IG_TOKEN_FILE;
const FALLBACK_TOKEN = process.env.IG_TOKEN;

function loadToken() {
  if (TOKEN_FILE && existsSync(TOKEN_FILE)) {
    return readFileSync(TOKEN_FILE, 'utf8').trim();
  }
  if (FALLBACK_TOKEN) return FALLBACK_TOKEN;
  throw new Error('No token: set IG_TOKEN_FILE or IG_TOKEN');
}

function saveToken(token) {
  if (!TOKEN_FILE) {
    console.error('IG_TOKEN_FILE not set; cannot persist new token. Print only.');
    console.log(token);
    return;
  }
  const tmp = TOKEN_FILE + '.tmp';
  writeFileSync(tmp, token, { mode: 0o600 });
  renameSync(tmp, TOKEN_FILE);
}

const token = loadToken();
const ts = () => new Date().toISOString();
const log = (...a) => console.log(`[${ts()}]`, ...a);

// 1) 현재 토큰 확인
const meRes = await fetch(`https://graph.instagram.com/me?fields=user_id,username&access_token=${encodeURIComponent(token)}`);
const meJson = await meRes.json();
if (!meRes.ok) {
  log('current token check FAILED:', meJson);
  process.exit(2);
}
log(`current token OK for @${meJson.username} (user_id=${meJson.user_id})`);

// 2) refresh
const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`;
const r = await fetch(refreshUrl);
const j = await r.json();
if (!r.ok || !j.access_token) {
  log('refresh FAILED:', j);
  process.exit(3);
}
log(`refresh OK. expires_in=${j.expires_in}s (~${Math.round(j.expires_in / 86400)} days)`);

// 3) 저장
saveToken(j.access_token);
log(`new token saved to ${TOKEN_FILE || '(stdout)'}`);
