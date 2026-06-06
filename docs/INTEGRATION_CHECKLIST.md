# From My Diary 연동 체크리스트

## 목적

이 문서는 구현을 시작하기 전에 GitHub, Supabase, Vercel 연동 상태와 필요한 환경변수를 확인하기 위한 기준이다. 현재 단계의 성공 기준은 로컬 Vite dev server에서의 동작이며, Vercel 배포 검증은 다음 단계에서 진행한다.

## 현재 MCP 연결 상태

확인일: 2026-06-06

| 대상 | 상태 | 확인 결과 |
| --- | --- | --- |
| GitHub MCP | 확인됨 | 인증 계정 `safecorners` 조회 성공 |
| Supabase MCP | 확인됨 | 프로젝트 `codex-diary` 조회 성공, project ref `zzdxwwnoxxyietlvqaas` |
| Vercel MCP | 확인됨 | 팀 `safecorners' projects` 조회 성공, 팀 ID `team_og2zTf4KeUfe306xn5nU7OYQ` |

## 구현 전 확인 항목

- [x] Supabase MCP 재인증을 완료한다.
- [x] 사용할 Supabase 프로젝트를 선택하거나 새 프로젝트를 만든다.
- [x] Supabase 프로젝트 URL을 확인한다.
- [x] Supabase publishable key를 확인한다.
- [x] Supabase Auth에서 GitHub provider를 활성화한다.
- [x] GitHub OAuth App의 callback URL을 Supabase Auth callback URL과 맞춘다.
- [x] 로컬 개발 URL을 Supabase Auth redirect URL에 등록한다.

Auth 설정 확인 메모:

- GitHub OAuth App callback URL: `https://zzdxwwnoxxyietlvqaas.supabase.co/auth/v1/callback`
- 로컬 redirect URL: `http://localhost:5173`
- Supabase MCP에서 provider 설정을 직접 조회하는 도구는 현재 노출되지 않았다.
- 사용자가 대시보드에서 설정 완료를 확인했고, Auth 로그에서 설정 reload 기록을 확인했다.

## 환경변수

로컬 `.env`에는 다음 값만 사용한다. Vercel 환경변수 등록은 다음 단계에서 진행한다.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

현재 선택한 Supabase 프로젝트:

- name: `codex-diary`
- project ref: `zzdxwwnoxxyietlvqaas`
- URL: `https://zzdxwwnoxxyietlvqaas.supabase.co`
- region: `ap-northeast-1`

사용하지 않는 값:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

`service_role` 또는 secret key는 프론트엔드 앱에 넣지 않는다.

## GitHub 확인 항목

- [x] GitHub MCP가 현재 세션에서 호출 가능하다.
- [x] 인증 계정 `safecorners`를 조회했다.
- [x] 구현 단계에서 저장소를 생성하거나 기존 저장소를 연결한다.
- [x] Vercel과 연결할 GitHub 저장소를 확정한다.

현재 GitHub 저장소:

- repository: `safecorners/from-my-diary`
- URL: `https://github.com/safecorners/from-my-diary`
- visibility: `public`
- Vercel 연결 대상: `safecorners/from-my-diary`

## Supabase 확인 항목

- [x] Supabase MCP 재인증을 완료한다.
- [x] Supabase 프로젝트 목록을 다시 조회한다.
- [x] 사용할 프로젝트의 `project_id`, URL, publishable key를 확인한다.
- [x] `diary_entries` 테이블을 생성할 계획을 검토한다.
- [x] `diary-photos` private bucket을 생성할 계획을 검토한다.
- [x] RLS와 Storage policy를 적용한 뒤 본인 데이터만 접근 가능한지 검증한다.

구현 상태 메모:

- `supabase/schema.sql`에 `diary_entries` 테이블, RLS policy, `diary-photos` private bucket, Storage policy를 추가했다.
- Supabase MCP로 project `zzdxwwnoxxyietlvqaas`에 SQL을 적용했다.
- `diary_entries`의 RLS 활성화와 `diary-photos` private bucket 설정을 SQL 조회로 확인했다.
- Supabase security advisor 결과는 경고 없음으로 확인했다.

## Vercel 확인 항목

- [x] Vercel MCP가 현재 세션에서 호출 가능하다.
- [x] 팀 `safecorners' projects`를 조회했다.
- [ ] 로컬 MVP 검증 후 Codex가 Vercel 프로젝트를 생성하거나 연결한다.
- [ ] 로컬 MVP 검증 후 Codex가 Vercel 환경변수에 `VITE_SUPABASE_URL`을 등록한다.
- [ ] 로컬 MVP 검증 후 Codex가 Vercel 환경변수에 `VITE_SUPABASE_PUBLISHABLE_KEY`를 등록한다.
- [ ] 로컬 MVP 검증 후 Codex가 SPA refresh 대응 rewrite 설정을 추가한다.
- [ ] 배포 URL 확정 후 Supabase Auth redirect URL에 production URL을 등록한다.
- [ ] 배포 후 Vercel URL의 OAuth callback 동작을 확인한다.

Vercel 진행 순서:

1. Vite + React 앱을 구현한다.
2. 로컬에서 GitHub OAuth, 세션 복원, 일기 CRUD, 사진 업로드/교체/삭제를 검증한다.
3. 코드를 `safecorners/from-my-diary`에 push한다.
4. Codex가 Vercel 프로젝트를 생성하거나 GitHub 저장소와 연결한다.
5. Codex가 Vercel 환경변수 2개를 등록한다.
6. Vercel production URL을 Supabase Auth redirect URL에 추가한다.
7. Vercel 배포 URL에서 OAuth와 SPA routing을 검증한다.

## 구현 후 확인 항목

- [ ] 로컬에서 GitHub OAuth 로그인에 성공한다.
- [ ] 로그인 세션이 새로고침 후 복원된다.
- [ ] 일기 작성, 조회, 수정, 삭제가 동작한다.
- [ ] 사진 업로드, 교체, 삭제가 동작한다.
- [ ] 다른 사용자의 일기 row를 조회할 수 없다.
- [ ] 다른 사용자의 Storage object를 조회하거나 삭제할 수 없다.
- [x] 로컬 로그인 화면이 렌더링되고 GitHub login button이 활성화된다.

## 다음 단계 확인 항목

- [ ] Vercel 배포 URL에서 GitHub OAuth 로그인에 성공한다.
- [ ] Vercel 배포 URL에서 SPA routing이 정상 동작한다.
