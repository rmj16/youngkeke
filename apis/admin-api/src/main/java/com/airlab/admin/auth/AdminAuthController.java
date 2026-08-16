package com.airlab.admin.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private static final String SESSION_ADMIN_ID = "ADMIN_ID";
    private static final String SESSION_LOGIN_ID = "ADMIN_LOGIN_ID";
    private static final String SESSION_DISPLAY_NAME = "ADMIN_DISPLAY_NAME";
    private static final String SESSION_ROLE = "ADMIN_ROLE";

    private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder(12);

    public AdminAuthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminSession>> login(
            @Valid @RequestBody LoginRequest input,
            HttpServletRequest request) {

        String loginId = input.loginId().trim();
        Optional<AdminAccount> account = findAccount(loginId);

        boolean authenticated = account
                .filter(AdminAccount::enabled)
                .map(value -> passwordEncoder.matches(
                        input.password(),
                        value.passwordHash()))
                .orElse(false);

        if (!authenticated) {
            recordAudit(
                    account.map(AdminAccount::id).orElse(null),
                    "ADMIN_LOGIN",
                    "ADMIN_ACCOUNT",
                    loginId,
                    "관리자 로그인 실패",
                    clientIp(request),
                    "FAILURE");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(
                            "관리자 ID 또는 비밀번호가 올바르지 않습니다."));
        }

        AdminAccount authenticatedAccount = account.orElseThrow();

        HttpSession previousSession = request.getSession(false);
        if (previousSession != null) {
            previousSession.invalidate();
        }

        HttpSession session = request.getSession(true);
        session.setMaxInactiveInterval(30 * 60);
        session.setAttribute(SESSION_ADMIN_ID, authenticatedAccount.id());
        session.setAttribute(SESSION_LOGIN_ID, authenticatedAccount.loginId());
        session.setAttribute(
                SESSION_DISPLAY_NAME,
                authenticatedAccount.displayName());
        session.setAttribute(SESSION_ROLE, authenticatedAccount.role());

        AdminSession response = new AdminSession(
                authenticatedAccount.id(),
                authenticatedAccount.loginId(),
                authenticatedAccount.displayName(),
                authenticatedAccount.role());

        recordAudit(
                authenticatedAccount.id(),
                "ADMIN_LOGIN",
                "ADMIN_ACCOUNT",
                authenticatedAccount.loginId(),
                "관리자 로그인 성공",
                clientIp(request),
                "SUCCESS");

        return ResponseEntity.ok(
                ApiResponse.ok(response, "로그인되었습니다."));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AdminSession>> me(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null ||
                session.getAttribute(SESSION_ADMIN_ID) == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("로그인이 필요합니다."));
        }

        AdminSession response = new AdminSession(
                (Long) session.getAttribute(SESSION_ADMIN_ID),
                (String) session.getAttribute(SESSION_LOGIN_ID),
                (String) session.getAttribute(SESSION_DISPLAY_NAME),
                (String) session.getAttribute(SESSION_ROLE));

        return ResponseEntity.ok(
                ApiResponse.ok(response, "세션이 유효합니다."));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            Long adminId = (Long) session.getAttribute(SESSION_ADMIN_ID);
            String loginId =
                    (String) session.getAttribute(SESSION_LOGIN_ID);

            recordAudit(
                    adminId,
                    "ADMIN_LOGOUT",
                    "ADMIN_ACCOUNT",
                    loginId,
                    "관리자 로그아웃",
                    clientIp(request),
                    "SUCCESS");

            session.invalidate();
        }

        return ResponseEntity.ok(
                ApiResponse.ok(null, "로그아웃되었습니다."));
    }

    private Optional<AdminAccount> findAccount(String loginId) {
        return jdbcTemplate.query(
                """
                SELECT id,
                       login_id,
                       password_hash,
                       display_name,
                       role,
                       enabled
                FROM admin_accounts
                WHERE login_id = ?
                """,
                (resultSet, rowNumber) -> new AdminAccount(
                        resultSet.getLong("id"),
                        resultSet.getString("login_id"),
                        resultSet.getString("password_hash"),
                        resultSet.getString("display_name"),
                        resultSet.getString("role"),
                        resultSet.getBoolean("enabled")),
                loginId)
                .stream()
                .findFirst();
    }

    private void recordAudit(
            Long adminId,
            String actionType,
            String targetType,
            String targetId,
            String detail,
            String clientIp,
            String result) {

        jdbcTemplate.update(
                """
                INSERT INTO admin_audit_logs (
                    admin_id,
                    action_type,
                    target_type,
                    target_id,
                    detail,
                    client_ip,
                    result
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                adminId,
                actionType,
                targetType,
                targetId,
                detail,
                clientIp,
                result);
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");

        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    public record LoginRequest(
            @NotBlank
            @Size(max = 50)
            String loginId,

            @NotBlank
            @Size(max = 200)
            String password) {
    }

    public record AdminSession(
            Long id,
            String loginId,
            String displayName,
            String role) {
    }

    public record ApiResponse<T>(
            boolean success,
            T data,
            String message,
            Instant timestamp) {

        public static <T> ApiResponse<T> ok(
                T data,
                String message) {

            return new ApiResponse<>(
                    true,
                    data,
                    message,
                    Instant.now());
        }

        public static <T> ApiResponse<T> error(String message) {
            return new ApiResponse<>(
                    false,
                    null,
                    message,
                    Instant.now());
        }
    }

    private record AdminAccount(
            Long id,
            String loginId,
            String passwordHash,
            String displayName,
            String role,
            boolean enabled) {
    }
}