# 실제 비밀번호 검증 API 연동 안내

## 1. 중요한 원칙

- 비밀번호 정답을 HTML이나 JavaScript에 넣지 않습니다.
- 브라우저는 입력값을 HTTPS로 Spring Boot에 전달합니다.
- Spring Boot가 MySQL의 비밀번호 해시와 비교합니다.
- DB에는 평문 비밀번호가 아니라 BCrypt 해시만 저장합니다.
- 로그인 성공 후 서버가 세션 쿠키(`HttpOnly`, `Secure`, `SameSite`)를 발급합니다.

## 2. 프론트엔드 요청 규격

`assets/js/config.js`의 `AUTH_MODE`를 `api`로 바꾸면 다음 요청을 보냅니다.

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "catering_user",
  "password": "사용자가 입력한 비밀번호"
}
```

성공 응답 예시:

```json
{
  "username": "catering_user",
  "partnerCode": "catering",
  "partnerName": "영크크케이터링",
  "role": "PARTNER_OPERATOR"
}
```

- 성공: `200 OK`
- 계정 또는 비밀번호 오류: `401 Unauthorized`
- 권한 없음 또는 비활성 계정: `403 Forbidden`

## 3. MySQL 테이블 예시

```sql
CREATE TABLE partner_accounts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  partner_code VARCHAR(30) NOT NULL,
  partner_name VARCHAR(100) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'PARTNER_OPERATOR',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  failed_attempts INT NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 4. Spring Boot 핵심 코드 예시

의존성은 `spring-boot-starter-web`, `spring-boot-starter-security`, `spring-boot-starter-data-jpa`, `mysql-connector-j`를 사용합니다.

```java
@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

```java
public record LoginRequest(String username, String password) {}

public record LoginResponse(
    String username,
    String partnerCode,
    String partnerName,
    String role
) {}
```

```java
@PostMapping("/api/auth/login")
public ResponseEntity<LoginResponse> login(
        @RequestBody LoginRequest request,
        HttpServletRequest httpRequest) {

    PartnerAccount account = repository.findByUsername(request.username())
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."));

    if (!account.isEnabled() ||
        !passwordEncoder.matches(request.password(), account.getPasswordHash())) {
        throw new ResponseStatusException(
            HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    HttpSession session = httpRequest.getSession(true);
    session.setAttribute("accountId", account.getId());
    session.setAttribute("partnerCode", account.getPartnerCode());
    session.setAttribute("role", account.getRole());

    return ResponseEntity.ok(new LoginResponse(
        account.getUsername(),
        account.getPartnerCode(),
        account.getPartnerName(),
        account.getRole()));
}
```

## 5. 인증된 API에서 소속 확인

클라이언트가 보내는 `partnerCode`를 그대로 믿으면 다른 협력사 정보에 접근할 수 있습니다. 작업 목록 API는 반드시 로그인 세션의 `partnerCode`로 조회해야 합니다.

```java
@GetMapping("/api/work-orders")
public List<WorkOrderDto> workOrders(HttpSession session) {
    String partnerCode = (String) session.getAttribute("partnerCode");
    if (partnerCode == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
    return workOrderService.findByPartnerCode(partnerCode);
}
```

## 6. Nginx 또는 Apache 프록시

프론트와 API를 같은 도메인으로 제공하면 CORS 문제를 줄일 수 있습니다.

```apache
ProxyPass        /api http://10.10.20.11:8081/api
ProxyPassReverse /api http://10.10.20.11:8081/api
```

그러면 프론트의 API 주소는 계속 `/api`를 사용합니다.

## 7. 백엔드 연결 완료 후 점검

1. 잘못된 비밀번호가 `401`을 반환하는지 확인
2. 비활성 계정이 `403`을 반환하는지 확인
3. A 협력사 계정으로 B 협력사 작업을 조회할 수 없는지 확인
4. 비밀번호가 DB에 BCrypt 해시로 저장됐는지 확인
5. 쿠키에 `HttpOnly`, 운영 HTTPS 환경에서는 `Secure`가 설정됐는지 확인
6. 로그아웃 시 서버 세션이 폐기되는지 확인
7. 로그인 실패 횟수 제한과 감사로그가 남는지 확인
