# thejiniuslab webhook

Instagram 댓글 → 자동 DM 응답 minimal 서버.

## 디렉토리 구조

```
api/webhook/
├── webhook.mjs          서버 본체 (~ 200 lines)
├── refresh-token.mjs    Instagram 토큰 자동 갱신 (60일 만료 방지)
├── docker-compose.yml   컨테이너 정의
├── .env.example         환경변수 템플릿
├── .env                 실제 환경변수 (gitignore)
└── data/
    └── ig-token.txt     현재 Instagram 토큰 (gitignore, 0600)
```

## 처음 셋업 (홈서버에서)

```bash
# 1. 레포 clone
cd ~ && git clone git@github.com:Jsh-newbie/thejiniuslab.git
cd ~/thejiniuslab/api/webhook

# 2. 환경변수
cp .env.example .env
# .env 편집해서 KEYWORD 등 조정

# 3. 토큰 파일 만들기 (Meta 대시보드에서 발급받은 토큰)
mkdir -p data
echo 'IGAA...토큰...' > data/ig-token.txt
chmod 600 data/ig-token.txt

# 4. 컨테이너 띄우기
docker compose up -d

# 5. 헬스체크
curl http://localhost:3017/healthz
curl https://api.thejiniuslab.com/healthz
```

## 토큰 자동 갱신 (cron)

토큰은 60일에 만료되며, 만료 *전*에 `/refresh_access_token`으로 갱신해야 한다.
주 1회 cron으로 실행하면 안전하다.

```cron
# 매주 일요일 새벽 4시 — Instagram 토큰 갱신
0 4 * * 0 cd /Users/jsh/thejiniuslab/api/webhook && \
  IG_TOKEN_FILE=$PWD/data/ig-token.txt node refresh-token.mjs \
  >> $PWD/data/refresh.log 2>&1
```

webhook 서버는 `IG_TOKEN_FILE` 변경을 감지해 자동으로 새 토큰을 사용한다 (재시작 불필요).

## 운영 명령

```bash
# 로그
docker logs --tail 100 -f thejiniuslab-webhook

# 재시작
docker compose restart

# 토큰 수동 갱신
docker compose exec webhook node /app/refresh-token.mjs
```

## 주요 라우트

| 메소드 | 경로 | 용도 |
|---|---|---|
| GET | `/healthz` | 헬스체크 |
| GET | `/webhooks/instagram` | Meta 검증 (hub.challenge) |
| POST | `/webhooks/instagram` | 댓글/메시지 이벤트 수신 |
| GET | `/oauth/callback` | OAuth 리디렉션 stub |
| POST | `/oauth/deauthorize` | 권한 해제 callback |
| POST | `/oauth/data-deletion` | 데이터 삭제 요청 callback |

## Meta 앱 정보

- 앱 이름: 댓글/DM 자동화-IG
- 앱 ID: 982221414436758
- Instagram 계정: jysk_prof.z (user_id: 17841448362073816)
- 비즈니스: TheginiusLab (1603433924133327)

## 보안

- `data/ig-token.txt` 는 git에 절대 올리지 않음
- 토큰은 `0600` 권한으로 저장
- `.env`도 git에서 제외
- HTTPS는 Cloudflare Tunnel(`api.thejiniuslab.com`)이 처리
