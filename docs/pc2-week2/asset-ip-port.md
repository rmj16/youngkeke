# PC2 자산 · IP · 포트표

## 서비스 자산

| 자산 | 호스트명 | 서비스 IP | 역할 | 담당 상태 |
|---|---|---|---|---|
| UNIX-01 | `unix-01-apache` | `10.10.10.11` | booking·crew Apache | PC3/PC4 |
| UNIX-02 | `unix-02-apache` | `10.10.10.12` | partner·admin Apache | 관리자 배포 확인 |
| UNIX-03 | `unix-03-was` | `10.10.20.11` | Tomcat 11.0.24 :8080, WildFly 41 :8081 | 두 서비스 실행 확인 |
| UNIX-04 | `unix-04-db` | `10.10.30.11` | PostgreSQL :5432, MySQL :3306 | admin DB 연동 확인 |
| WIN-01 | `win-web01` | 현재 VMware NAT `192.168.250.133` / MGMT 설계 `10.10.40.11` | IIS 10, Oracle XE 21c, Wazuh Agent 4.14.7 | PC2 구축 완료 |
| SEC-01 | pfSense | 구역별 `.1` | 방화벽·라우팅 | MGMT 실제값 최종 확인 필요 |
| SEC-02 | Wazuh | Tailscale `100.117.65.81` | Manager·Indexer·Dashboard 4.14 | 1514·1515 포워딩 완료 |

## 내부 서비스 도메인

| 서비스 | 내부 도메인 | 실제 WEB/WAS 경로 |
|---|---|---|
| 예약 | `booking.airlab.test` | UNIX-01 Apache → UNIX-03 Tomcat `/booking` |
| 승무원 | `crew.airlab.test` | UNIX-01 Apache → UNIX-03 Tomcat `/crew` |
| 협력사 | `partner.airlab.test` | UNIX-02 Apache → 협력사 API `/admin-api` |
| 관리자 | `admin.airlab.test` | UNIX-02 Apache → UNIX-03 WildFly `/admin` |

도메인은 Apache 이름 기반 가상호스트이므로 IP로 직접 호출하면 다른 사이트로
라우팅될 수 있다. 원격 개발 시 PC2는 `127.0.0.1 admin.airlab.test`와 SSH 터널
`127.0.0.1:8082 → UNIX-02:80`을 사용한다. UNIX-03의 관리자 백엔드가 협력사
API를 호출하려면 UNIX-03에서도 `10.10.10.12 partner.airlab.test`를 해석할 수
있어야 한다.

## 서비스망

| 구역 | 대역 | 설계 게이트웨이 |
|---|---|---|
| DMZ | `10.10.10.0/24` | `10.10.10.1` |
| APP | `10.10.20.0/24` | `10.10.20.1` |
| DB | `10.10.30.0/24` | `10.10.30.1` |
| MGMT | `10.10.40.0/24` | `10.10.40.1` |

`192.168.183.0/24`는 PC1 VMware Host-only 임시 관리망이며 서비스 IP를 대체하지 않는다. 팀 노트북의 유선 LAN 연결은 최종적으로 사용하지 않으므로 `10.10.40.0/24`는 Packet Tracer의 목표 설계망이다. 실제 원격 관리는 Tailscale과 PC1 VMware NAT 포트포워딩을 사용하며, 이 관리 트래픽은 pfSense 서비스 구역 정책을 통과하지 않는다.

## 원격 관리

PC1 Tailscale: `100.67.232.28`

| 외부 포트 | 대상 |
|---:|---|
| 2201 | UNIX-01 `10.0.0.102:22` |
| 2202 | UNIX-02 `10.0.0.103:22` |
| 2203 | UNIX-03 `10.0.0.104:22` |
| 2204 | UNIX-04 `10.0.0.105:22` |

## 주요 포트

| 포트 | 서비스 |
|---:|---|
| 22 | UNIX SSH |
| 80 / 443 | Apache HTTP / HTTPS |
| 8080 | Tomcat booking·crew |
| 8081 | WildFly partner·admin |
| 3306 | MySQL partner·admin DB |
| 5432 | PostgreSQL booking·crew DB |
| 1521 | WIN-01 Oracle Listener |
| 1514 | Wazuh 이벤트 수집 |
| 1515 | Wazuh Agent 등록 |

## 실제망과 설계망 구분

| 구분 | 실제 운영 | 설계·시뮬레이션 |
|---|---|---|
| 팀원 원격 관리 | Tailscale → PC1 `100.67.232.28` → TCP 2201~2204 | MGMT `10.10.40.0/24` |
| 서버 간 서비스 통신 | pfSense를 경유하는 DMZ·APP·DB `10.10.x.0/24` | Packet Tracer ASA로 동일 정책 표현 |
| WIN-01 주소 | VMware NAT가 할당한 현재 주소를 자산대장에 기록 | `10.10.40.11` |
| 외부 공개 | 공개 인터넷 미개방. 팀원은 Tailscale SSH 터널 사용 | Cloud 장비는 인터넷 경계의 논리 표현 |

Packet Tracer의 ASA 장비 이름은 pfSense의 논리 대체물일 뿐 실제 pfSense 설정 백업이 아니다. 실제 통제 증빙은 pfSense의 Interfaces, Rules, Routes, Firewall Logs 화면으로 별도 확보한다.

비밀번호, API Key, 세션 쿠키 값은 자산표와 Git에 기록하지 않는다.
