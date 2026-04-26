import http from 'node:http';
import { readFileSync, existsSync, watchFile } from 'node:fs';

const PORT       = Number(process.env.PORT || 3017);
const TOKEN_FILE = process.env.IG_TOKEN_FILE;
const IG_USER    = process.env.IG_USER_ID;
const VERIFY_TOK = process.env.VERIFY_TOKEN || 'thejiniuslab-verify-2026';
const KEYWORD    = (process.env.KEYWORD || '자료').toLowerCase();
const REPLY      = process.env.REPLY_MESSAGE
  || '안녕하세요! 요청해주신 자료 링크입니다 → https://thejiniuslab.com/library/\n\n— TheJiniusLab';
const BASE       = 'https://graph.instagram.com';

// 토큰을 파일에서 읽고, refresh 스크립트가 갱신하면 자동으로 다시 읽음
let TOKEN = process.env.IG_TOKEN || '';
function loadTokenFromFile() {
  if (TOKEN_FILE && existsSync(TOKEN_FILE)) {
    const t = readFileSync(TOKEN_FILE, 'utf8').trim();
    if (t && t !== TOKEN) {
      TOKEN = t;
      console.log(`[${new Date().toLocaleTimeString('ko-KR')}] token reloaded from ${TOKEN_FILE}`);
    }
  }
}
loadTokenFromFile();
if (TOKEN_FILE) {
  // refresh 스크립트가 토큰 파일을 atomic-rename할 때마다 다시 읽음
  watchFile(TOKEN_FILE, { interval: 5000 }, () => loadTokenFromFile());
}

if (!TOKEN || !IG_USER) { console.error('MISSING IG_TOKEN/IG_TOKEN_FILE or IG_USER_ID'); process.exit(1); }

const ts  = () => new Date().toLocaleTimeString('ko-KR');
const log = (...a) => console.log(`[${ts()}]`, ...a);

async function sendDM(recipientId, text) {
  const r = await fetch(`${BASE}/${IG_USER}/messages?access_token=${encodeURIComponent(TOKEN)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient: { id: recipientId }, message: { text } }),
  });
  return { status: r.status, body: await r.text() };
}

async function replyComment(commentId, text) {
  const r = await fetch(`${BASE}/${commentId}/replies?access_token=${encodeURIComponent(TOKEN)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });
  return { status: r.status, body: await r.text() };
}

async function handleComment(v) {
  const text = (v.text || '').toLowerCase();
  const fromId = v.from?.id;
  const commentId = v.id;
  const matched = text.includes(KEYWORD);
  log(`    comment by ${v.from?.username || '?'} ${matched ? '✅ MATCH' : '·'}: ${(v.text || '').slice(0, 80)}`);
  if (!matched || !fromId) return;
  const r = await sendDM(fromId, REPLY);
  log(`    ✉ DM result: ${r.status} ${r.body.slice(0, 300)}`);
  if (r.status >= 400 && commentId) {
    const rr = await replyComment(commentId, '댓글 감사합니다! 자료는 https://thejiniuslab.com/library/ 에서 받으실 수 있어요.');
    log(`    💬 reply-comment fallback: ${rr.status} ${rr.body.slice(0, 200)}`);
  }
}

async function handleMessage(v) {
  if (v.message && v.message.is_echo) { log('    (echo, skip)'); return; }
  if (v.read || v.delivery) { log('    (read/delivery, skip)'); return; }
  if (v.sender && v.sender.id === IG_USER) { log('    (self-sender, skip)'); return; }
  const text = (v.message?.text || v.text || '').toLowerCase();
  const senderId = v.sender?.id || v.from?.id;
  const matched = text.includes(KEYWORD);
  log(`    message from ${senderId || '?'} ${matched ? '✅ MATCH' : '·'}: ${(v.message?.text || v.text || '').slice(0, 80)}`);
  if (!matched || !senderId) return;
  const r = await sendDM(senderId, REPLY);
  log(`    ✉ DM result: ${r.status} ${r.body.slice(0, 300)}`);
}

async function readBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }

  // Webhook 검증
  if (req.method === 'GET' && url.pathname === '/webhooks/instagram') {
    const mode = url.searchParams.get('hub.mode');
    const tok  = url.searchParams.get('hub.verify_token');
    const ch   = url.searchParams.get('hub.challenge');
    log(`GET verify mode=${mode}`);
    if (mode === 'subscribe' && tok === VERIFY_TOK) {
      log('  ✅ verify ok');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(ch || '');
    }
    res.writeHead(403); return res.end('forbidden');
  }

  // Webhook 이벤트
  if (req.method === 'POST' && url.pathname === '/webhooks/instagram') {
    const body = await readBody(req);
    log('POST webhook body:', body.slice(0, 1500));
    let payload;
    try { payload = JSON.parse(body); }
    catch { res.writeHead(400); return res.end('bad json'); }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        log(`  change field=${change.field}`);
        const v = change.value || {};
        if (change.field === 'comments' || change.field === 'live_comments' || change.field === 'mentions') {
          await handleComment(v);
        } else if (change.field === 'messages') {
          await handleMessage(v);
        } else {
          log('    (unhandled field)');
        }
      }
      for (const m of entry.messaging || []) {
        log(`  messaging from=${m.sender?.id} text='${m.message?.text || ''}'`);
        await handleMessage(m);
      }
    }
    return;
  }

  // OAuth callback (비즈니스 로그인 redirect 후 도착) — 지금은 사용 안 함, 200 응답 stub
  if (req.method === 'GET' && url.pathname === '/oauth/callback') {
    log('GET /oauth/callback', url.searchParams.toString());
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>TheJiniusLab</h1><p>OAuth callback received. This route is reserved for future business login flows.</p>');
  }

  // Deauthorize callback — Meta가 사용자가 권한 해제할 때 호출
  if (req.method === 'POST' && url.pathname === '/oauth/deauthorize') {
    const body = await readBody(req);
    log('POST /oauth/deauthorize body:', body.slice(0, 500));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true }));
  }

  // Data deletion request — Meta가 사용자 데이터 삭제 요청 시 호출
  // (참고: 별도 thejiniuslab.com/data-deletion/ 페이지가 있지만 API endpoint도 가능)
  if (req.method === 'POST' && url.pathname === '/oauth/data-deletion') {
    const body = await readBody(req);
    log('POST /oauth/data-deletion body:', body.slice(0, 500));
    // Meta가 기대하는 응답 형식: { url, confirmation_code }
    const code = 'TJL-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      url: 'https://thejiniuslab.com/data-deletion/?code=' + code,
      confirmation_code: code,
    }));
  }

  res.writeHead(404); res.end('not found');
});

server.listen(PORT, '0.0.0.0', () => {
  log(`webhook v3 listening on ${PORT}`);
  log(`verify_token='${VERIFY_TOK}' keyword='${KEYWORD}' ig_user=${IG_USER}`);
  log('routes: /healthz, /webhooks/instagram, /oauth/callback, /oauth/deauthorize, /oauth/data-deletion');
});
