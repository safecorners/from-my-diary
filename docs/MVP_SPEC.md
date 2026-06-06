# From My Diary MVP 명세

## 개요

`From My Diary`는 일반 사용자가 GitHub 계정으로 로그인해 본인만 볼 수 있는 일기를 기록하는 웹 앱이다. 첫 버전은 일상 기록에 집중하며, 사용자는 날짜별 일기를 작성, 수정, 삭제하고 일기마다 사진 1장을 첨부할 수 있다.

## 목표

- GitHub OAuth로 로그인한 사용자만 앱을 사용할 수 있다.
- 사용자는 본인 일기만 조회, 작성, 수정, 삭제할 수 있다.
- 일기 한 편에는 날짜, 제목, 본문, 사진 1장을 저장할 수 있다.
- 로컬 개발 환경에서 핵심 기능이 동작한다.
- Vercel 배포 검증은 다음 단계에서 진행한다.

## 현재 구현 상태

- Vite + React + TypeScript + Tailwind 기반 MVP 앱이 `main`에 merge되어 있다.
- Supabase Auth, Postgres, Storage 연동 코드는 구현되어 있다.
- `supabase/schema.sql`에 `diary_entries` 테이블, RLS policy, `diary-photos` private bucket, Storage policy가 정리되어 있다.
- `vercel.json`에 SPA refresh 대응 rewrite가 추가되어 있다.
- 현재 checkout에서 로컬 의존성 설치, build, dev server 실행을 확인했다.
- 로컬 브라우저에서 OAuth, 세션 복원, CRUD, 사진 업로드/교체/삭제 흐름을 확인했다.
- 다음 작업은 Vercel 프로젝트 연결, 환경변수 등록, production redirect URL 등록, 배포 URL 검증이다.

## 기술 스택

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- Supabase JS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Vercel

## 핵심 기능

### 인증

- Supabase Auth의 GitHub OAuth를 사용한다.
- 로그인하지 않은 사용자는 로그인 화면만 볼 수 있다.
- 로그인한 사용자는 최근 일기 목록으로 이동한다.
- 사용자는 앱에서 로그아웃할 수 있다.

### 일기 CRUD

- 일기 작성: 날짜, 제목, 본문, 사진 1장을 입력한다.
- 일기 조회: 최근 작성 또는 수정된 일기 목록을 확인한다.
- 일기 수정: 기존 날짜, 제목, 본문, 사진을 변경할 수 있다.
- 일기 삭제: 일기와 연결된 사진을 함께 삭제한다.

### 사진

- 일기 1편당 사진은 최대 1장만 허용한다.
- 사진은 Supabase Storage의 private bucket에 저장한다.
- 사진 파일은 사용자별 경로 아래에 저장한다.
- 사진 형식은 JPG, PNG, WebP, GIF만 허용한다.
- 사진 용량은 최대 6MB로 제한한다.
- 목록에서는 사진이 있는 일기에 썸네일을 표시한다.

## 화면 범위

### 로그인 전 화면

- 앱 이름 `From My Diary`
- 짧은 제품 소개
- GitHub 로그인 버튼
- 개인 일기 데이터가 비공개로 저장된다는 안내

### 로그인 후 홈 화면

- 최근 일기 목록
- 새 일기 작성 버튼
- 로그아웃 버튼

### 작성/수정 화면

- 날짜 입력
- 제목 입력
- 본문 입력
- 사진 1장 업로드 또는 교체
- 저장 버튼
- 취소 버튼

## 제외 범위

다음 기능은 MVP에서 제외한다.

- Next.js
- 서버 API
- Server Actions
- Supabase Edge Functions
- 서버 이미지 처리
- 검색
- 태그
- 달력 보기
- 공유 링크
- 공개 일기
- 다중 사진
- 관리자 기능
- 계정 삭제 기능
- PDF, Markdown, ZIP 내보내기
- AI 요약 또는 감정 분석
- 이메일 리마인더

## 성공 기준

- 로컬 Vite dev server에서 GitHub OAuth 로그인이 동작한다.
- 로그인 세션이 새로고침 후에도 복원된다.
- 사용자는 본인 일기를 작성, 조회, 수정, 삭제할 수 있다.
- 사용자는 일기에 사진 1장을 업로드, 교체, 삭제할 수 있다.
- 다른 사용자의 일기와 사진에는 접근할 수 없다.

## 다음 단계

- Vercel 프로젝트를 `safecorners/from-my-diary` GitHub 저장소와 연결한다.
- Vercel 환경변수 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 등록한다.
- Vercel production URL을 Supabase Auth redirect URL에 추가한다.
- Vercel 배포 URL에서 GitHub OAuth, SPA routing, 세션 복원, CRUD, 사진 흐름을 검증한다.
