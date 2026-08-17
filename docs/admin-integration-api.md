# YOUNGKEKE AIR 관리자 연동 API

관리자 React는 예약·승무원·협력사 서비스를 직접 호출하지 않는다.
브라우저는 `admin.war`의 `/api/admin/**`만 호출하고, 관리자 API가 내부 서비스로 요청을 전달한다.

## 관리자 자체 API

| Method | Endpoint | 기능 | 데이터 저장 위치 |
| --- | --- | --- | --- |
| POST | `/api/admin/auth/login` | 관리자 로그인·세션 생성 | MySQL `admin_db` |
| GET | `/api/admin/auth/me` | 로그인 세션 확인 | HTTP Session |
| POST | `/api/admin/auth/logout` | 로그아웃 | MySQL 감사 로그 |
| GET | `/api/admin/audit-logs` | 관리자 작업 이력 조회 | MySQL `admin_db` |

## 예약·Q&A 연동

| 관리자 웹 Endpoint | 관리자 API가 호출할 booking Endpoint | 기능 |
| --- | --- | --- |
| `GET /api/admin/reservations` | `GET /api/admin/reservations` | 전체 예약 조회 |
| `GET /api/admin/qna` | `GET /api/qna` | 문의 목록 조회 |
| `GET /api/admin/qna/{id}` | `GET /api/qna/{id}` | 문의 상세 조회 |
| `PATCH /api/admin/qna/{id}/answer` | `PATCH /api/admin/qna/{id}/answer` | 관리자 답변 저장 |
| `PATCH /api/admin/qna/{id}/status` | `PATCH /api/admin/qna/{id}/status` | 문의 상태 변경 |

답변 요청:

```json
{
  "answer": "고객에게 전달할 실제 답변"
}
```

PC3 실제 배포 소스 기준 확정 사항:

- WAS context path: `/booking`
- 직접 호출 base URL: `http://10.10.20.11:8080/booking/api`
- 목록 페이지네이션: 없음
- 예약 식별자: `reservation_id`, 항공편 식별자: `flight_id`
- 예약 목록 회원 식별자: `member_id`
- Q&A 작성자명: `author_name`
- booking의 `/api/admin/**`에는 인증이 의도적으로 적용되지 않음

booking 관리자 API가 무인증인 것은 취약점 시연용 설계다. 브라우저가 booking을
직접 호출하게 두지 않고, `admin.war`가 자체 관리자 세션을 먼저 검증한 뒤 내부
booking API를 호출한다. 따라서 booking의 회원용 `JSESSIONID`를 전달하지 않는다.

## 승무원 현황 연동

승무원 페이지에서 여권 확인, 수하물 처리, 발권 처리를 입력한다.
관리자 페이지는 해당 업무를 대신 입력하지 않고 처리 현황만 조회한다.

| 관리자 웹 Endpoint | crew 서비스 요청 Endpoint | 기능 |
| --- | --- | --- |
| `GET /api/admin/crew` | `GET /api/admin/crew` | 직원·배정·업무 현황 |
| `GET /api/admin/crew/flights` | `GET /api/admin/crew/flights` | 담당 항공편 현황 |
| `GET /api/admin/crew/operations` | `GET /api/admin/crew/operations` | 처리 건수 집계 |

PC4가 제공할 최소 응답 필드:

```json
{
  "employeeNo": "E2026001",
  "name": "직원명",
  "role": "CREW",
  "assignedFlightId": "FL001",
  "assignedFlightNo": "YK081",
  "status": "WORKING",
  "passportStatus": "VERIFIED",
  "baggageStatus": "COMPLETED",
  "ticketStatus": "ISSUED"
}
```

원본 여권번호는 관리자 응답에서 제외하고 확인 상태만 제공한다.

## 협력사 연동

| 관리자 웹 Endpoint | partner 서비스 요청 Endpoint | 기능 |
| --- | --- | --- |
| `GET /api/admin/partner/requests` | `GET /api/admin/partner/requests` | 요청 목록 조회 |
| `GET /api/admin/partner/requests/{id}` | `GET /api/admin/partner/requests/{id}` | 요청 상세 조회 |
| `PATCH /api/admin/partner/requests/{id}/status` | `PATCH /api/admin/partner/requests/{id}/status` | 승인·반려 |

승인·반려 요청:

```json
{
  "status": "APPROVED",
  "reason": "처리 사유"
}
```

허용 상태값:

```text
PENDING
APPROVED
REJECTED
```

## 서버 환경변수

실제 비밀번호는 이 문서나 Git에 기록하지 않는다.

```text
BOOKING_SERVICE_URL=http://127.0.0.1:8080/booking
CREW_SERVICE_URL=http://127.0.0.1:8080/crew
PARTNER_SERVICE_URL=http://127.0.0.1:8081/partner
```

각 담당자가 context path를 변경하면 WildFly의 환경변수만 수정하고 다시 배포한다.

프론트엔드를 Vite 개발 서버로 실행하면서 실제 배포 API를 호출할 때만
`apps/admin-web/.env.local`에 아래 값을 넣는다. 이 파일은 Git에 올리지 않는다.

```text
VITE_ADMIN_API_TARGET=http://admin.youngkeke-air:8082
```

운영 빌드는 Apache의 `/api` 프록시를 사용하므로 이 값이 없어도 된다.

## 관리자 데이터 저장 원칙

- `admin_db`: 관리자 계정, 역할, 로그인·로그아웃·처리 작업 이력
- 예약 데이터: booking 서비스 API에서 조회
- 직원·여권·수하물·발권 데이터: crew 서비스 API에서 조회
- 협력 요청 데이터: partner 서비스 API에서 조회
- Oracle XE: 홈페이지와 연결하지 않는 DBMS 백업·복구 실습용
