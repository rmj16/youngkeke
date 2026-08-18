# Booking → Crew 연동 API 최종 계약

- 확정일: 2026-08-18
- 제공: PC3 booking
- 소비: PC4 crew
- 배포 Base URL: `http://10.10.20.11:8080/booking`
- 공통 응답: `{ "success": boolean, "data": ..., "message": "...", "timestamp": "..." }`
- 요청 JSON: camelCase
- 응답 `data`: snake_case

## 배포 상태

- 2026-08-18 PC3 담당자 공유 기준 최종 배포 완료
- `booking.war`: UNIX-03 Tomcat 11, context path `/booking`
- 예약 프론트엔드: 최종 운영 빌드 배포 완료
- PC4 crew 서비스는 이 문서의 Base URL과 계약을 기준으로 연동
- PC2 관리자 서비스의 예약·Q&A API 경로에는 변경 없음

배포 완료 공유와 별개로 팀 최종 재부팅시험에서는 Tomcat 서비스, WAR 배포
마커, 핵심 API HTTP 200을 다시 확인해 증빙으로 남긴다.

실제 계정과 비밀번호는 이 문서와 Git에 기록하지 않는다.

## 읽기 API

| Method | Endpoint | 기능 | 인증 |
| --- | --- | --- | --- |
| GET | `/api/flights/{flightId}` | 항공편 단건 조회 | 불필요 |
| GET | `/api/flights/{flightId}/reservations` | 항공편별 예약·승객명단 | 불필요 |
| GET | `/api/reservations/{reservationId}` | 예약·항공편·탑승객 상세 | 불필요 |
| GET | `/api/flights/{flightId}/taken-seats` | 취소되지 않은 점유 좌석 | 불필요 |

## 쓰기 API

| Method | Endpoint | 기능 | 요청 body |
| --- | --- | --- | --- |
| PATCH | `/api/flights/{flightId}/status` | 운항 상태 변경 | `{ "status": "BOARDING" }` |
| PATCH | `/api/reservations/{reservationId}/seat` | 좌석 변경 | `{ "seatNo": "14C" }` |
| POST | `/api/reservations/{reservationId}/baggage` | 수하물 변경·금액 재계산 | `{ "baggageOption": "KG20" }` |

현재 쓰기 3종은 PC3의 취약점 시연 설계에 따라 세션 인증 없이 열려 있다.
운영 환경의 권장 보안 구성이 아니며, 최종 보고서에는 접근제어 취약점으로
명시하고 방화벽·내부 서비스 경계로 접근 범위를 제한한다.

## 주요 응답 필드

### 항공편

```json
{
  "flight_id": "FL001",
  "flight_no": "YK081",
  "origin": "ICN",
  "destination": "JFK",
  "depart_at": "2026-08-18T10:30:00",
  "arrive_at": "2026-08-19T00:30:00",
  "status": "SCHEDULED",
  "price": 1200000
}
```

### 항공편별 예약

```json
{
  "reservation_id": "X7K2P9",
  "seat_no": "12A",
  "baggage_option": "KG10",
  "total_price": 1242000,
  "status": "CONFIRMED",
  "member_id": "M0001",
  "passenger_names": "테스트 승객"
}
```

### 예약 상세 추가 필드

```text
booked_at
flight_status
flight_price
passengers[].passenger_id
passengers[].name
passengers[].passport_no
passengers[].special_note
```

여권번호는 crew 업무 화면에서만 필요한 민감정보다. 관리자 목록 응답이나
관리자 감사 로그에는 원문을 저장하지 않는다.

## 상태값

| 대상 | 허용 값 |
| --- | --- |
| 항공편 | `SCHEDULED`, `BOARDING`, `DEPARTED`, `ARRIVED`, `DELAYED`, `CANCELLED` |
| 예약 | `CONFIRMED`, `CANCELLED` |
| 수하물 | `NONE`, `KG10`, `KG20` |

PC3 서버가 현재 항공편 상태값을 엄격히 검증하지 않더라도 PC4 화면은 위 값만
전송해야 한다.

## 오류 계약

| 상황 | HTTP 상태 |
| --- | --- |
| 필수 status 또는 seatNo 누락 | 400 |
| 항공편·예약 없음 | 404 |
| 동일 항공편의 좌석 중복 | 409 |

## 서비스 소유권

- 항공편과 `flights.status`의 원본 소유자는 booking이다.
- crew는 별도 항공편 원본을 중복 관리하지 않고 booking API를 사용한다.
- 연결 키는 `flight_id`와 `reservation_id`이며 서비스 간 DB 외래키는 만들지 않는다.
- crew 세션 쿠키는 Apache의 `/api` 경로에서도 전달되도록 쿠키 Path `/` 설정이 필요하다.

## 최종 배포 데이터 범위

- PC3 최종본의 항공편 식별자 범위는 `FL001`~`FL082`다.
- 최종 샘플 예약에는 `FL001`뿐 아니라 `FL013`, `FL041`도 포함된다.
- 이전 팀 초안의 `FL001`~`FL005` 5편 고정 가정은 최종 booking 데이터의 원본 범위로 사용하지 않는다.
- PC4 crew 화면과 PC2 관리자 화면은 항공편 ID를 하드코딩하지 않고 booking 응답을 그대로 사용한다.
- Packet Tracer에는 항공편 레코드를 각각 그리지 않으므로 네트워크 구성도 변경은 필요 없다.

## PC2 관리자 서비스에 미치는 영향

- 관리자 예약·Q&A API 경로 변경 없음
- `admin.war`의 booking base URL 변경 없음
- 관리자 예약 adapter는 snake_case 최종 필드와 기존 camelCase 변형을 모두 수용
- 좌석·수하물·운항상태 쓰기 API는 관리자 화면에 중복 구현하지 않음
