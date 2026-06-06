# From My Diary 디자인 시스템

## 개요

`From My Diary`는 사용자가 GitHub로 로그인해 본인만 볼 수 있는 일상을 기록하는 개인 일기장 앱이다. 디자인은 따뜻한 종이 질감, 조용한 사적 공간, 사진 한 장을 붙여 둔 다이어리의 감각을 기준으로 한다.

Clay 디자인 시스템의 cream canvas, rounded type, saturated card rhythm, playful depth를 참고하되 B2B SaaS 문맥과 Clay 고유 표현은 사용하지 않는다. 이 문서는 Vite + React + Tailwind 구현을 위한 UI 스타일 기준이며, 기능 범위는 `docs/MVP_SPEC.md`, Supabase 정책은 `docs/SUPABASE_PLAN.md`를 따른다.

## 브랜드 원칙

- Warm private: 화면은 차갑거나 관리 도구처럼 보이지 않고, 개인 기록을 열어보는 느낌을 준다.
- Clear writing: 작성 화면은 장식보다 날짜, 제목, 본문, 사진 입력에 집중한다.
- Soft memory: 사진, 카드, 빈 상태는 paper, photo, diary, soft keepsake 이미지를 떠올리게 한다.
- Protected by default: 비공개 일기장임을 badge, copy, empty state에서 조용히 드러낸다.
- Light throughout: 어두운 footer나 heavy dashboard 스타일을 사용하지 않는다.

## Color Tokens

기본 배경은 cream-tinted canvas를 사용한다. Accent는 한 화면에서 2~3개만 사용하고, 같은 saturated color를 반복해서 지배적인 테마로 만들지 않는다.

| Token | Value | Use |
| --- | --- | --- |
| `colors.canvas` | `#fffaf0` | 기본 page background |
| `colors.surfaceSoft` | `#faf5e8` | header, footer, soft section |
| `colors.surfaceCard` | `#f5f0e0` | diary card, empty state |
| `colors.surfaceRaised` | `#ffffff` | form panel, input background |
| `colors.ink` | `#0a0a0a` | h1, h2, primary text |
| `colors.body` | `#34312d` | 본문 텍스트 |
| `colors.muted` | `#6d665d` | 보조 설명, 날짜, metadata |
| `colors.hairline` | `#e7ddca` | border, divider |
| `colors.primary` | `#0a0a0a` | primary button |
| `colors.onPrimary` | `#ffffff` | primary button text |
| `colors.diaryPink` | `#ff7aa8` | warm highlight, photo accent |
| `colors.diaryTeal` | `#1f4a46` | private badge, featured state |
| `colors.diaryLavender` | `#c5b5f2` | secondary card accent |
| `colors.diaryPeach` | `#ffb58f` | empty state, soft illustration |
| `colors.diaryOchre` | `#e5b84d` | date chip, small highlight |
| `colors.success` | `#22c55e` | success feedback |
| `colors.warning` | `#f59e0b` | warning feedback |
| `colors.error` | `#dc2626` | destructive action, validation error |

## Typography

Plain Black은 사용할 수 없으므로 Inter를 기본 font로 사용한다. Display text는 Inter 500~600과 약한 negative letter-spacing으로 rounded display의 인상을 대체한다.

| Token | Size | Weight | Line Height | Letter Spacing | Use |
| --- | --- | --- | --- | --- | --- |
| `type.displayLg` | `56px` | `600` | `1.04` | `-0.04em` | login hero h1 |
| `type.displayMd` | `40px` | `600` | `1.08` | `-0.035em` | page title |
| `type.displaySm` | `32px` | `600` | `1.15` | `-0.025em` | section title |
| `type.titleLg` | `24px` | `600` | `1.3` | `0` | diary title |
| `type.titleMd` | `18px` | `600` | `1.4` | `0` | card title, form label group |
| `type.bodyMd` | `16px` | `400` | `1.6` | `0` | diary body, running text |
| `type.bodySm` | `14px` | `400` | `1.55` | `0` | metadata, helper text |
| `type.caption` | `13px` | `500` | `1.4` | `0` | badge, date chip |
| `type.button` | `14px` | `600` | `1` | `0` | button label |

모바일에서는 display size를 줄이되 viewport width로 font-size를 직접 스케일하지 않는다. 긴 한국어 문구는 줄바꿈을 허용하고, 버튼 안에서는 텍스트가 넘치지 않게 한다.

## Layout Tokens

| Token | Value | Use |
| --- | --- | --- |
| `spacing.xs` | `8px` | inline gap |
| `spacing.sm` | `12px` | compact control gap |
| `spacing.md` | `16px` | input group gap |
| `spacing.lg` | `24px` | card padding |
| `spacing.xl` | `32px` | panel padding |
| `spacing.section` | `72px` | major vertical section gap |
| `container.max` | `1120px` | authenticated app content |
| `container.narrow` | `720px` | editor form width |

일기 앱은 반복 사용 도구이므로 랜딩 페이지처럼 과한 hero section을 만들지 않는다. 로그인 전 화면만 브랜드 hero를 허용하고, 로그인 후 화면은 목록과 작성 동선을 우선한다.

## Shape & Elevation

| Token | Value | Use |
| --- | --- | --- |
| `radius.sm` | `8px` | small chip, small image |
| `radius.md` | `12px` | button, input |
| `radius.lg` | `16px` | diary card, form panel |
| `radius.xl` | `24px` | login visual, empty state |
| `radius.full` | `9999px` | badge, avatar, icon button |

Heavy shadow는 사용하지 않는다. Depth는 cream background, hairline border, accent card color, photo preview의 겹침으로 만든다.

| Level | Treatment | Use |
| --- | --- | --- |
| `elevation.flat` | no shadow | page background |
| `elevation.hairline` | `1px solid colors.hairline` | card, input |
| `elevation.soft` | `0 12px 30px rgb(10 10 10 / 0.06)` | focused modal-like panel only |

## Core Components

### `login-hero`

- Cream canvas 위에 앱 이름, 짧은 소개, GitHub login button을 배치한다.
- 오른쪽 또는 하단에 paper, photo, diary, keepsake 느낌의 부드러운 visual area를 둔다.
- 사용자가 로그인해야 개인 일기를 볼 수 있다는 점을 명확히 안내한다.

### `app-shell`

- 로그인 후 기본 shell이다.
- 상단에는 `From My Diary`, 사용자 상태, logout button을 둔다.
- 본문은 `container.max` 안에서 최근 일기 목록과 작성 진입점을 보여준다.
- marketing nav처럼 많은 메뉴를 만들지 않는다.

### `diary-list`

- 최근 일기를 카드 목록으로 보여준다.
- desktop은 2-column까지 허용하고, mobile은 1-column만 사용한다.
- 목록 위에는 page title, private badge, new entry button을 둔다.

### `diary-card`

- `surfaceCard` 또는 `surfaceRaised` 배경, `radius.lg`, hairline border를 사용한다.
- 날짜, 제목, 본문 일부, 사진 thumbnail, edit/delete action을 포함한다.
- 사진이 없으면 작은 accent block이나 paper texture placeholder를 보여준다.
- 카드 내부 버튼은 layout을 흔들지 않도록 고정 높이를 사용한다.

### `editor-form`

- 날짜, 제목, 본문, 사진 1장 입력만 포함한다.
- 본문 textarea는 충분한 높이를 제공하고, 입력 영역은 흰 종이 위에 쓰는 느낌을 준다.
- 저장은 primary button, 취소는 secondary button, 삭제는 destructive button으로 구분한다.
- 저장 중 상태와 validation error를 form 안에서 표시한다.

### `photo-preview`

- 사진은 1장만 허용한다.
- preview는 `radius.md` 또는 `radius.lg`를 사용하고, 교체/삭제 action을 함께 제공한다.
- 업로드 전 placeholder는 peach 또는 lavender accent로 따뜻하게 처리한다.

### `button-primary`

- background `colors.primary`
- text `colors.onPrimary`
- height `44px`
- padding `12px 20px`
- radius `radius.md`
- typography `type.button`

### `button-secondary`

- background `colors.canvas`
- text `colors.ink`
- border `1px solid colors.hairline`
- height `44px`
- radius `radius.md`

### `button-destructive`

- background는 기본적으로 transparent 또는 light surface를 사용한다.
- text와 border에 `colors.error`를 사용한다.
- 실제 삭제 전에는 confirm state를 제공한다.

### `private-badge`

- background `colors.diaryTeal`
- text `colors.onPrimary`
- radius `radius.full`
- label 예시: `Private diary`
- 데이터가 본인에게만 보인다는 신호로 사용한다.

### `empty-state`

- 일기가 없을 때 보여준다.
- `surfaceSoft` 또는 `surfaceCard` 배경, `radius.xl`, 충분한 padding을 사용한다.
- copy는 짧게 쓴다. 예: `첫 일기를 남겨보세요.`
- 과한 설명이나 기능 소개 문구를 넣지 않는다.

### `loading-state`

- cream background 위에 skeleton row 또는 small spinner를 사용한다.
- 화면 전체를 어둡게 덮지 않는다.

### `error-state`

- error color는 validation이나 실패 메시지에만 사용한다.
- Supabase 연결 실패는 짧은 설명과 retry action으로 표현한다.

## Screen Guidelines

### 로그인 전

- 첫 화면은 브랜드 신호가 분명해야 한다.
- `From My Diary`를 큰 제목으로 보여준다.
- GitHub 로그인 버튼은 유일한 primary action이다.
- visual asset은 diary, paper, photo 중심으로 구성한다.

### 로그인 후 홈

- 최근 일기 목록이 첫 화면의 중심이다.
- 작성 버튼은 항상 쉽게 찾을 수 있어야 한다.
- 불필요한 대시보드 통계나 마케팅 카드는 넣지 않는다.

### 작성/수정 화면

- `container.narrow` 안에 form을 배치한다.
- 입력 필드는 안정적인 높이와 간격을 가진다.
- 사진 preview와 action이 서로 겹치지 않게 한다.

## Tailwind Implementation Notes

Tailwind config에는 위 token을 `theme.extend.colors`, `borderRadius`, `spacing`, `boxShadow`, `fontFamily`에 매핑한다.

권장 class 방향:

- page: `min-h-screen bg-canvas text-ink`
- shell: `mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8`
- card: `rounded-2xl border border-hairline bg-surface-card`
- input: `h-11 rounded-xl border border-hairline bg-surface-raised px-4`
- primary button: `h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary`

구현 시 색상 hex를 component 안에 직접 반복하지 말고 Tailwind token을 사용한다.

## Do

- cream canvas를 기본 배경으로 사용한다.
- 일기 작성 흐름을 시각 장식보다 우선한다.
- 카드, 입력, 버튼은 둥글고 안정적인 크기를 유지한다.
- 비공개 데이터라는 점을 조용하지만 명확하게 보여준다.
- 사진 1장 preview가 목록과 form에서 자연스럽게 보이게 한다.

## Don't

- Clay의 제품명, GTM-data 문맥, B2B feature card 내용을 복사하지 않는다.
- Next.js, 서버 API, Edge Functions 전제의 UI를 만들지 않는다.
- 공개 공유, 다중 사진 갤러리, 검색, 태그, 달력 보기 UI를 MVP에 넣지 않는다.
- 어두운 footer나 heavy admin dashboard 스타일을 사용하지 않는다.
- 화면을 한 가지 hue만으로 지배하지 않는다.
- 장식용 gradient orb, bokeh blob, 과한 shadow를 사용하지 않는다.

## Responsive Behavior

| Breakpoint | Behavior |
| --- | --- |
| `< 768px` | 1-column layout, compact header, full-width actions |
| `768px - 1024px` | diary list 1~2 columns, editor remains narrow |
| `> 1024px` | max container 1120px, diary list up to 2 columns |

버튼과 input은 최소 44px 높이를 유지한다. 텍스트가 버튼이나 카드 밖으로 넘치면 줄바꿈을 허용하고, layout shift가 생기지 않도록 고정된 spacing과 min-height를 사용한다.

## Validation Checklist

- `From My Diary`가 따뜻한 개인 일기장처럼 보인다.
- 로그인 후 첫 화면은 최근 일기 목록과 새 일기 작성에 집중한다.
- 디자인 기준이 Vite + React + Tailwind로 바로 구현 가능하다.
- MVP 제외 기능이 UI에 암시되지 않는다.
- 비공개 일기와 사진 1장 제한이 UI에 반영된다.
