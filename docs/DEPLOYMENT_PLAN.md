# From My Diary 배포 계획

## 목적

이 문서는 `From My Diary`를 Vite + React + Tailwind 기반 정적 SPA로 Vercel에 배포하기 위한 다음 단계 기준을 정리한다. 현재 MVP 성공 기준은 로컬 Vite dev server 검증까지이며, Next.js, 서버 API, Edge Functions는 사용하지 않는다.

## 배포 방식

- Vercel 정적 사이트 배포를 사용한다.
- 빌드 명령은 Vite 기본 빌드인 `npm run build`를 사용한다.
- 출력 디렉터리는 Vite 기본값인 `dist`를 사용한다.
- 앱은 SPA이므로 모든 클라이언트 라우트가 `/index.html`로 fallback되어야 한다.
- Vercel 프로젝트 생성, GitHub 저장소 연결, 환경변수 등록은 로컬 MVP 검증 이후 Codex가 진행한다.

## 로컬 개발

예상 로컬 URL:

```text
http://localhost:5173
```

로컬 개발에서 확인할 항목:

- Vite dev server 실행
- GitHub OAuth 로그인
- 로그인 후 세션 복원
- 일기 CRUD
- 사진 업로드, 교체, 삭제

## Vercel 환경변수

Vercel 프로젝트에는 다음 환경변수를 등록한다.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

등록하지 않는 값:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

`VITE_` prefix가 붙은 값은 브라우저에 노출되므로 publishable key만 사용한다.

현재 Supabase 값:

```env
VITE_SUPABASE_URL=https://zzdxwwnoxxyietlvqaas.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<.env의 publishable key 사용>
```

`VITE_SUPABASE_PUBLISHABLE_KEY`는 `.env`에 있는 `sb_publishable_...` 값을 사용한다. `service_role` 또는 secret key는 등록하지 않는다.

## Supabase Auth Redirect URL

현재 로컬 검증 단계에서는 Supabase Auth에 로컬 URL을 등록한다. Vercel 배포 단계에서는 배포 URL을 추가로 등록한다.

현재 단계 필수 등록 항목:

```text
http://localhost:5173
```

다음 단계 등록 항목:

```text
https://<vercel-deployment-domain>
```

Vercel production domain이 확정되면 다음 형태의 URL을 등록한다.

```text
https://<project-name>.vercel.app
```

preview deployment에서 OAuth를 테스트하려면 preview URL도 추가로 등록한다.

## GitHub OAuth 설정

GitHub OAuth App 또는 Supabase GitHub provider 설정에서 Supabase가 요구하는 callback URL을 사용한다. 앱에서 직접 GitHub callback route를 만들지 않는다.

확인 항목:

- GitHub OAuth App Client ID 등록
- GitHub OAuth App Client Secret 등록
- Supabase Auth GitHub provider 활성화
- Supabase Auth callback URL과 GitHub OAuth App callback URL 일치

## SPA Rewrite 설정

React Router를 사용하는 SPA는 새로고침 시 Vercel이 클라이언트 라우트를 `/index.html`로 돌려야 한다.

예상 `vercel.json` 설정:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

구현 단계에서 루트 `vercel.json`으로 생성했다.

## 배포 전 체크리스트

- [x] GitHub 저장소가 준비되어 있다.
- [ ] 로컬 MVP 성공 기준을 검증한다.
- [ ] 코드를 `safecorners/from-my-diary`에 push한다.
- [ ] Codex가 Vercel 프로젝트를 GitHub 저장소에 연결한다.
- [ ] Codex가 Vercel 환경변수 2개를 등록한다.
- [x] Supabase Auth redirect URL에 로컬 URL이 등록되어 있다.
- [ ] Supabase Auth redirect URL에 Vercel production URL이 등록되어 있다.
- [x] Supabase Auth GitHub provider가 활성화되어 있다.
- [x] SPA rewrite 설정이 추가되어 있다.

## 배포 후 체크리스트

- [ ] Vercel production URL 접속에 성공한다.
- [ ] 새로고침해도 React Router route가 깨지지 않는다.
- [ ] GitHub OAuth 로그인이 성공한다.
- [ ] 로그인 완료 후 앱으로 돌아온다.
- [ ] Supabase 세션이 복원된다.
- [ ] 일기 CRUD가 동작한다.
- [ ] 사진 업로드, 교체, 삭제가 동작한다.
