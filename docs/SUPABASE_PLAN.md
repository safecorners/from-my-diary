# From My Diary Supabase 계획

## 목적

이 문서는 `From My Diary` MVP에서 사용할 Supabase 데이터베이스, 인증, Storage, 보안 정책의 기준을 정리한다. Supabase 스키마나 정책을 변경하기 전에는 최신 Supabase 문서와 changelog를 확인하고, 변경 후에는 실제 SQL과 policy 동작을 검증한다.

## 기본 원칙

- Supabase Auth는 GitHub OAuth provider만 사용한다.
- 모든 일기 데이터는 로그인한 사용자 본인에게만 노출한다.
- `public` schema에 생성되는 테이블에는 RLS를 활성화한다.
- 클라이언트에는 Supabase URL과 publishable key만 노출한다.
- `service_role` 또는 secret key는 사용하지 않는다.
- 사용자 권한 판단에는 user-editable metadata를 사용하지 않는다.

## 인증

- 로그인 방식: GitHub OAuth
- 클라이언트 라이브러리: Supabase JS
- Supabase project ref: `zzdxwwnoxxyietlvqaas`
- Supabase project URL: `https://zzdxwwnoxxyietlvqaas.supabase.co`
- 로컬 redirect URL 예시: `http://localhost:5173`
- Vercel redirect URL: 다음 단계에서 배포 URL 확정 후 등록

현재 단계에서는 Supabase Auth 설정에 로컬 URL을 허용한다. OAuth callback은 Supabase Auth가 처리하고, 앱은 로그인 완료 후 홈 화면으로 이동한다. Vercel URL은 배포 단계에서 추가한다.

## 테이블 설계

테이블 이름: `diary_entries`

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | `auth.users.id`와 연결되는 소유자 ID |
| `entry_date` | `date` | 사용자가 지정한 일기 날짜 |
| `title` | `text` | 일기 제목 |
| `body` | `text` | 일기 본문 |
| `photo_path` | `text` | Storage object path, 사진이 없으면 `null` |
| `created_at` | `timestamptz` | 생성 시각 |
| `updated_at` | `timestamptz` | 수정 시각 |

## 데이터 제약

- `user_id`는 로그인한 사용자 ID로 저장한다.
- `entry_date`, `title`, `body`는 필수 값이다.
- `photo_path`는 일기 1편당 최대 1개의 사진 경로만 저장한다.
- `title`은 1~120자, `body`는 1~8000자로 제한한다.

## RLS 정책

`diary_entries`에는 RLS를 활성화한다.

정책 방향:

- SELECT: `auth.uid() = user_id`인 row만 조회할 수 있다.
- INSERT: `auth.uid() = user_id`인 row만 생성할 수 있다.
- UPDATE: `auth.uid() = user_id`인 row만 수정할 수 있다.
- DELETE: `auth.uid() = user_id`인 row만 삭제할 수 있다.

Postgres RLS에서 UPDATE는 SELECT policy도 필요하므로 SELECT와 UPDATE 정책을 함께 검증한다.

## Storage 설계

bucket 이름: `diary-photos`

bucket 설정:

- private bucket
- 일기 사진 저장 전용
- public URL 사용 금지

object path 규칙:

```text
{user_id}/{entry_id}/{file_name}
```

파일 처리 원칙:

- 일기 1편당 사진은 최대 1장만 저장한다.
- 사진 교체 시 기존 object를 삭제한 뒤 새 object path를 저장한다.
- 일기 삭제 시 연결된 object도 함께 삭제한다.
- 업로드 가능한 파일 타입은 JPG, PNG, WebP, GIF로 제한한다.
- 최대 파일 크기는 6MB로 제한한다.

## Storage Policy 방향

`diary-photos` bucket에는 사용자별 object path를 기준으로 policy를 적용한다.

- SELECT: 본인 `user_id` prefix의 object만 조회한다.
- INSERT: 본인 `user_id` prefix에만 업로드한다.
- UPDATE: MVP에서는 직접 update 대신 삭제 후 재업로드를 기본 흐름으로 둔다.
- DELETE: 본인 `user_id` prefix의 object만 삭제한다.

Storage upsert를 사용할 경우 INSERT, SELECT, UPDATE 권한이 모두 필요하므로 MVP에서는 upsert를 기본 동작으로 사용하지 않는다.

## 구현 상태

- [x] `supabase/schema.sql`에 `diary_entries` 테이블, RLS policy, `diary-photos` private bucket, Storage policy가 정리되어 있다.
- [x] Supabase MCP로 project `zzdxwwnoxxyietlvqaas`에 SQL을 적용했다.
- [x] `diary_entries`의 RLS 활성화와 `diary-photos` private bucket 설정을 SQL 조회로 확인했다.
- [x] Supabase security advisor 결과는 경고 없음으로 확인했다.
- [x] 로컬 앱에서 로그인한 사용자 기준의 실제 CRUD와 사진 흐름을 검증했다.
- [ ] 다음 Supabase 변경 전 Auth, Storage, RLS 관련 최신 문서와 changelog를 다시 확인한다.

## 구현 후 검증

- [x] `diary_entries` 테이블에 RLS가 활성화되어 있다.
- [x] `diary-photos` bucket이 private bucket으로 생성되어 있다.
- [x] `diary_entries`와 `storage.objects` owner 기반 policy가 적용되어 있다.
- [x] Supabase security advisor에서 경고 없음으로 확인했다.
- [x] 로그인한 사용자가 본인 일기만 조회할 수 있다.
- [x] 로그인한 사용자가 본인 일기만 생성할 수 있다.
- [x] 로그인한 사용자가 본인 일기만 수정할 수 있다.
- [x] 로그인한 사용자가 본인 일기만 삭제할 수 있다.
- [x] 다른 사용자의 `diary_entries` row에 접근할 수 없다.
- [x] 다른 사용자의 Storage object에 접근할 수 없다.
- [x] `service_role` 키가 클라이언트 코드와 로컬 `.env`에 존재하지 않는다.
- [ ] Vercel 환경변수 등록 후 `service_role` 또는 secret key가 등록되지 않았는지 확인한다.
