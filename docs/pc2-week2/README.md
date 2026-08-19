# PC2 관리자 담당 2주차 구축 기록

기간: 2026-08-14 ~ 2026-08-17

## 완료 범위

- WIN-01 Windows Server 2022, IIS 10, Oracle XE 21c 구축·재부팅·Data Pump 검증
- Java 21, Spring Boot 4.0.7, Maven 3.9.12, WAR 구성
- `admin.war`를 UNIX-03 WildFly 41의 8081에 배포
- 관리자 React를 UNIX-02 Apache `/var/www/admin`에 배포
- UNIX-04 MySQL `admin_db`, `admin_user`, 관리자 계정·감사 로그 구축
- 로그인·세션·새로고침 유지·로그아웃과 KST 감사 로그 구현
- booking 예약·Q&A API 실연동
- partner 협력사 요청 목록·승인·반려 API 명세 반영
- 내부 서비스 도메인을 `booking/crew/partner/admin.airlab.test`로 통일
- 고객 문의 등록 → 관리자 답변 → 고객 답변 확인 왕복 검증
- 예약·문의·승무원·협력사·감사 로그를 페이지당 10건으로 표시
- 고객 문의는 목록과 답변 모달을 분리
- Packet Tracer 구역 분리와 MGMT→서버, DMZ→APP, DMZ→DB 차단, APP→DB 시험

## 관리자 배포 구조

```text
브라우저
→ UNIX-02 Apache :80
→ UNIX-03 WildFly :8081/admin
→ UNIX-04 MySQL :3306/admin_db
```

Oracle XE는 실서비스 홈페이지 DB가 아니라 DBMS 설치·SQL·백업·복구 증빙용이다.

## PC4 crew API 연동

PC4가 Tomcat 11.0.24와 `crew.war`를 구성했으며 관리자 서비스는 다음 API를 사용한다.

| Method | Endpoint | 용도 |
|---|---|---|
| GET | `/api/admin/crew` | 승무원 직원 현황 |
| GET | `/api/flights/{flightId}/crew` | 항공편 편성 승무원 명단 |

항공편 자체 정보는 crew 서비스가 중복 제공하지 않는다. PC3 booking 서비스의 `GET /api/flights/{flightId}`를 사용한다.

승무원 응답의 `crewId`, `employeeNo`, `name`, `rank`, `baseAirport`, `phone`, `status` camelCase는 관리자 React adapter가 직접 수용한다. booking의 snake_case와 형식을 억지로 하나로 바꾸지 않고 서비스 경계에서 변환한다.

## 주요 시행착오와 해결

| 문제 | 원인 | 해결 |
|---|---|---|
| Oracle `ORA-01017` | 비밀번호·접속 문자열 혼동 | 비밀번호를 프롬프트로 입력하고 `XEPDB1` 별칭 검증 |
| `tnsping XEPDB1` 실패 | `tnsnames.ora` 별칭 누락 | 별칭 추가 후 Data Pump 성공 |
| WildFly `.failed` | 환경파일·DB 통신·WAR 조건 불일치 | 환경파일 권한, APP→DB 경로, 재배포 마커 확인 |
| Actuator `DOWN` | MySQL 3306 통신 불가 | pfSense 경로 복구 후 health `UP` 확인 |
| UNIX-03 자원 부족 | RAM 2GB, 루트 LVM 10GB | RAM 4GB, 루트 약 28GB로 확장 |
| React 새로고침 404 | SPA fallback 누락 | Apache `FallbackResource` 적용 |
| 로그인 후 세션 소실 | `/admin` context의 쿠키 경로 | Apache reverse cookie path 보정 |
| `ens37` 경로 혼선 | VMware NAT 관리 NIC가 서비스 경로로 선택 | SSH NAT는 유지하고 서비스 대역은 pfSense 내부 NIC로 라우팅 |
| ASA 명령 오류 | EXEC·config 모드 혼동, 명령 지원 차이 | 프롬프트를 확인하고 `show access-list`로 검증 |
| Git 미추적 폴더 혼선 | 서로 다른 프로젝트 계보에서 브랜치 전환 | 깨끗한 clone과 worktree로 작업 분리 |

## Wazuh 공유값

| 항목 | 값 |
|---|---|
| Manager | `100.117.65.81` |
| 이벤트 수집 | TCP 1514 |
| Agent 등록 | TCP 1515 |
| 서비스 | Manager·Indexer·Dashboard 4.14 정상 |

## 남은 공동 작업

- PC1 협력사 API의 UNIX-03 경유 목록·승인·반려 HTTP 200 최종 증빙
- PC4 Wazuh Dashboard에서 `win-web01` Active 최종 캡처
- 실제 pfSense MGMT 정책 확정 및 전체 재부팅 시험
- 팀 전용 브랜치 검토 후 `integration` PR 병합

날짜별 원본 증빙 125개는 로컬 `영크크프로젝트/260814~260817`과 `노션정리_PC2/PC2_증빙_파일_인덱스.md`에서 관리한다. 비밀번호·토큰·세션 쿠키가 보이는 캡처는 저장소에 올리지 않는다.
