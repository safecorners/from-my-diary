# From My Diary 디자인 시스템 문서화 계획

## Summary
- `DESIGN.md`를 루트에 생성해 Clay 디자인 시스템을 `From My Diary` 브랜드에 맞게 변환한다.
- Clay의 핵심 감성인 cream canvas, rounded typography, saturated cards, playful 3D-like warmth는 유지하되 B2B SaaS 표현은 개인 일기 앱에 맞게 바꾼다.
- `DESIGN.md`는 구현 기준 문서로 사용하고, 도메인/기능 범위는 기존 `docs/MVP_SPEC.md`를 기준으로 둔다.

## Key Changes
- 브랜드 톤: “따뜻하고 사적인 일상 기록 앱”으로 정의한다.
- 색상: cream 기반 배경, near-black ink, diary accent palette를 사용한다.
  - 예: soft pink, muted teal, lavender, peach, ochre, paper cream.
- 타이포그래피: Clay의 Plain Black은 사용할 수 없으므로 Inter 기반으로 대체한다.
  - 큰 제목은 Inter 500~600, 약한 negative letter-spacing.
  - 본문과 UI는 Inter 400~600.
- 컴포넌트 기준:
  - 로그인 화면 hero
  - 최근 일기 목록
  - 일기 카드
  - 작성/수정 form
  - 사진 preview 영역
  - primary/secondary/destructive button
  - private-data badge와 empty state
- 시각 소재:
  - Clay의 3D claymation을 그대로 복제하지 않고, `From My Diary`에는 paper, photo, diary, soft clay keepsake 느낌의 따뜻한 이미지/일러스트 방향으로 변환한다.
  - 실제 구현에서 이미지가 필요하면 생성 이미지나 간단한 3D-like asset을 사용한다.

## Test Plan
- `DESIGN.md`가 `From My Diary` MVP와 충돌하지 않는지 확인한다.
- Next.js, 서버 기능, 공개 공유, 다중 사진 같은 제외 범위가 디자인 문서에 들어가지 않게 한다.
- UI 기준이 Vite + React + Tailwind 구현에 바로 옮길 수 있는 token/component 형태인지 확인한다.
- Clay 원문을 복사하는 문서가 아니라, `From My Diary` 브랜드에 맞춘 재해석 문서인지 확인한다.

## Assumptions
- 파일 위치는 루트 `DESIGN.md`로 한다.
- 문서는 한국어로 작성하고, token 이름, class 개념, component 이름은 English를 유지한다.
- 디자인 문서는 UI 스타일 기준이며, Supabase 정책이나 기능 범위의 source of truth는 기존 `docs/` 문서로 유지한다.
