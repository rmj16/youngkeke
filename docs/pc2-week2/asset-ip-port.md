# PC2 자산 · IP · 포트표

## 서비스 자산

| 자산 | 호스트명 | 서비스 IP | 역할 | 담당 상태 |
|---|---|---|---|---|
| UNIX-01 | `unix-01-apache` | `10.10.10.11` | booking·crew Apache | PC3/PC4 |
| UNIX-02 | `unix-02-apache` | `10.10.10.12` | partner·admin Apache | 관리자 배포 확인 |
| UNIX-03 | `unix-03-was` | `10.10.20.11` | Tomcat 11.0.24 :8080, WildFly 41 :8081 | 두 서비스 실행 확인 |
| UNIX-04 | `unix-04-db` | `10.10.30.11` | PostgreSQL :5432, MySQL :3306 | admin DB 연동 확인 |
| WIN-01 | `win-web01` | MGMT 설계 `10.10.40.11` | IIS 10, Oracle XE 21c | PC2 구축 완료 |
| SEC-01 | pfSense | 구역별 `.1` | 방화벽·라우팅 | MGMT 실제값 최종 확인 필요 |
| SEC-02 | Wazuh | Tailscale `100.117.65.81` | Manager·Indexer·Dashboard 4.14 | 1514·1515 포워딩 완료 |

## 서비스망

| 구역 | 대역 | 설계 게이트웨이 |
|---|---|---|
| DMZ | `10.10.10.0/24` | `10.10.10.1` |
| APP | `10.10.20.0/24` | `10.10.20.1` |
| DB | `10.10.30.0/24` | `10.10.30.1` |
| MGMT | `10.10.40.0/24` | `10.10.40.1` |

`192.168.183.0/24`는 PC1 VMware Host-only 임시 관리망이며 서비스 IP를 대체하지 않는다. 실제 pfSense MGMT 주소는 PC1·PC4 확인 후 확정한다.

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

비밀번호, API Key, 세션 쿠키 값은 자산표와 Git에 기록하지 않는다.
