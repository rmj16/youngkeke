# PC2 자산 식별 자동화

## 1. PC2 물리 호스트 수집

관리자 PowerShell에서 저장소 루트로 이동한 후 실행한다.

```powershell
Set-ExecutionPolicy -Scope Process Bypass
./scripts/asset-inventory/Collect-PC2Assets.ps1 -AssetId PC2-HOST
```

## 2. WIN-01 수집

WIN-01의 관리자 PowerShell에서 이 폴더를 복사하거나 저장소를 받은 뒤 실행한다.

```powershell
Set-ExecutionPolicy -Scope Process Bypass
./scripts/asset-inventory/Collect-PC2Assets.ps1 -AssetId WIN-01
```

결과에는 OS·CPU·RAM·디스크·IPv4·라우팅·서비스·수신 TCP 포트·설치 프로그램·도구 버전·IIS·Wazuh 연결 로그가 포함된다. 실제 비밀번호, API Key, 세션 쿠키는 수집하지 않는다.

## 3. PC2 원격 관리 포트 교차검증

```powershell
./scripts/asset-inventory/Test-ProjectPorts.ps1 -Profile Remote
```

`2201~2204`는 VM이 켜져 있을 때 `OPEN`이어야 한다. 로컬 `8080`, `8082`는 해당 SSH 터널을 실행한 동안에만 열린다. `CLOSED_OR_FILTERED`는 서비스 중지, VM 종료, 포트포워딩 문제, 방화벽 차단을 구분하지 않으므로 SSH 또는 서비스 상태를 추가 확인한다.

## 4. 내부 서비스 포트 교차검증

내부 `10.10.x.x`로 라우팅 가능한 PC1 또는 관리 위치에서만 실행한다.

```powershell
./scripts/asset-inventory/Test-ProjectPorts.ps1 -Profile Internal
```

일반 PC2 Wi-Fi에서는 내부망으로 라우팅되지 않으므로 실패가 정상일 수 있다. 방화벽 정책 검증은 출발 구역별로 따로 수행한다.

- UNIX-02(DMZ) → UNIX-03(APP) 8080·8081: 허용
- UNIX-02(DMZ) → UNIX-04(DB) 3306·5432: 차단
- UNIX-03(APP) → UNIX-04(DB) 3306·5432: 허용

Nmap이 설치되어 있으면 별도로 다음을 실행해 결과를 교차검증한다.

```powershell
nmap -Pn -sT -n -p 2201-2204 100.67.232.28
nmap -Pn -sT -n -p 1514,1515 100.117.65.81
```

DB나 WAS 포트를 인터넷/Tailscale 전체에 공개하지 않는다. 원격 홈페이지 확인은 Apache 80번으로 향하는 SSH 로컬 포워딩만 사용한다.
