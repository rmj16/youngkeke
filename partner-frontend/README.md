# 영크크항공 협력사 포털 프론트엔드

영크크케이터링, 영크크클린, 영크크테크의 작업지시와 완료 보고를 처리하는 협력사 포털 프론트엔드입니다.

## 실행

별도의 설치 없이 `index.html`을 열거나 정적 웹 서버로 실행합니다.

```powershell
python -m http.server 8080
```

브라우저에서 `http://localhost:8080`으로 접속합니다.

## 주요 파일

- `index.html`: 협력사 로그인 화면
- `portal.html`: 협력사별 업무 포털
- `assets/css/login.css`: 로그인 화면 스타일
- `assets/js/config.js`: 인증 모드와 API 주소 설정
- `assets/js/login.js`: 로그인 처리
- `BACKEND_API_GUIDE.md`: Spring Boot·MySQL 인증 연동 안내

## 인증 모드

현재 `assets/js/config.js`는 `prototype` 모드입니다. 이 모드는 화면 발표를 위한 임시 동작이며 실제 비밀번호를 검증하지 않습니다.

백엔드가 준비되면 다음처럼 변경합니다.

```javascript
window.PARTNER_PORTAL_CONFIG = {
  AUTH_MODE: "api",
  API_BASE_URL: "/api"
};
```

실제 운영에서는 반드시 HTTPS, 서버 세션 또는 HttpOnly 쿠키, BCrypt 비밀번호 해시를 사용해야 합니다.
