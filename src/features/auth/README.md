# features/auth

인증 **메커니즘**을 두는 자리입니다. (로그인/회원가입 *화면*은 `pages/login`, `pages/signup`에 있습니다.)

현재는 세션/인증 로직이 없어 비어 있습니다. 추후 아래를 여기에 추가하세요.

- `hooks/useAuth.ts` — 로그인 상태·사용자 정보 훅
- `context/AuthProvider.tsx` — 세션 컨텍스트
- `types/` — 사용자/세션 타입

이렇게 하면 `Header`(user prop)·`pages/login`·`pages/mypage` 등 여러 화면이
같은 인증 로직을 공유할 수 있습니다.
