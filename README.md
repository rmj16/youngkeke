# Garuda Indonesia 고객지원 프론트엔드

AWS의 `WEB-01 (Ubuntu + Nginx)`에서 정적 파일로 서비스하도록 만든 **Vite + React + TypeScript SPA**입니다. Next.js, Vinext, Cloudflare 전용 구성은 사용하지 않습니다.

## 화면 주소

- 사용자 문의 페이지: `http://localhost:5173/`
- 관리자 대시보드: `http://localhost:5173/admin`
- 관리자 문의 관리: `http://localhost:5173/admin/inquiries`

사용자 페이지에서 접수한 문의는 현재 브라우저의 `localStorage`에 저장되며 관리자 문의 관리 화면에 바로 표시됩니다. Spring Boot 서버가 완성되면 `src/shared/hooks/useInquiries.ts`를 API 호출 방식으로 교체하면 됩니다.

## Windows에서 실행

VS Code에서 이 폴더를 연 뒤 터미널에서 실행합니다.

```powershell
npm.cmd install
npm.cmd run dev
```

터미널에 표시되는 `http://localhost:5173/` 주소를 Ctrl을 누른 채 클릭합니다.

## 운영용 정적 파일 생성

```powershell
npm.cmd run build
```

생성되는 `dist` 폴더의 내용을 WEB-01의 `/var/www/garuda-frontend`에 배치합니다. `nginx/garuda-frontend.conf`는 React 경로 새로고침과 `/api` → Spring Boot 전달을 포함한 예시입니다.

## 폴더 구조

```text
garuda-react-nginx-frontend/
├─ public/                 이미지와 아이콘
├─ nginx/                  WEB-01 Nginx 설정 예시
├─ src/
│  ├─ features/
│  │  ├─ customer/         사용자 문의 기능
│  │  └─ admin/            관리자 대시보드/문의 관리
│  ├─ shared/              공통 데이터, 타입, 훅, 컴포넌트
│  ├─ styles/              사용자/관리자 분리 스타일
│  └─ main.tsx             SPA 진입점 및 화면 경로 분기
├─ index.html
├─ package.json
└─ vite.config.ts
```

## 향후 Spring Boot 연동

- 로컬 개발: Vite가 `/api`를 `http://localhost:8080`으로 전달합니다.
- AWS 운영: Nginx가 `/api`를 APP-01의 프라이빗 주소 `:8080`으로 전달합니다.
- 실제 APP-01 주소에 맞게 `nginx/garuda-frontend.conf`의 `server 10.0.20.10:8080`을 변경하세요.
- 인터넷에서 APP-01에 직접 접근시키지 말고 APP 보안 그룹은 WEB 보안 그룹에서 오는 8080 요청만 허용하는 구성이 적절합니다.
