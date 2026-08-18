# YOUNGKEKE AIR 관리자 웹

예약, 고객문의, 직원 현황, 협력사 요청과 관리자 작업 이력을 통합 관리하는 React 프론트엔드입니다.

## 관리자 도메인

- 최종 내부 도메인: `admin.airlab.test`
- 개발 서버 기본 포트: `5173`
- 다른 홈페이지의 도메인은 이 프로젝트에서 변경하지 않습니다.

로컬 개발 중 해당 이름으로 접속하려면 Windows `hosts` 파일에 다음 항목이 필요합니다.

```text
127.0.0.1 admin.airlab.test
```

이후 개발 주소는 `http://admin.airlab.test:5173`입니다. Apache 배포 후에는 포트 번호 없이 `http://admin.airlab.test`로 접속합니다.

## 실행

`start-admin-web.cmd`를 더블클릭하고 Windows 관리자 권한 요청을 승인하면 다음 작업을 한 번에 처리합니다.

1. `hosts` 파일에 `127.0.0.1 admin.airlab.test` 등록
2. DNS 캐시 갱신
3. 관리자 웹 개발 서버 실행
4. `http://admin.airlab.test:5173` 브라우저 열기

직접 실행하려면 PowerShell의 스크립트 실행 정책과 관계없이 다음 명령을 사용합니다.

```powershell
npm.cmd run dev
```
