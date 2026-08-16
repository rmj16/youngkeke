package com.airlab.admin.auth;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrapRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder(12);

    public AdminBootstrapRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        String loginId = trim(System.getenv("ADMIN_BOOTSTRAP_ID"));
        String password = System.getenv("ADMIN_BOOTSTRAP_PASSWORD");
        String displayName = trim(System.getenv("ADMIN_BOOTSTRAP_NAME"));

        // 환경변수를 설정하지 않았다면 아무 작업도 하지 않습니다.
        if (loginId == null || password == null || password.isBlank()) {
            return;
        }

        if (displayName == null) {
            displayName = "System Administrator";
        }

        Integer accountCount = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM admin_accounts
                WHERE login_id = ?
                """,
                Integer.class,
                loginId
        );

        // 같은 로그인 ID가 있으면 중복 생성하지 않습니다.
        if (accountCount != null && accountCount > 0) {
            System.out.println(
                    "Administrator bootstrap skipped: account already exists."
            );
            return;
        }

        jdbcTemplate.update(
                """
                INSERT INTO admin_accounts
                    (login_id, password_hash, display_name, role, enabled)
                VALUES (?, ?, ?, 'ADMIN', TRUE)
                """,
                loginId,
                passwordEncoder.encode(password),
                displayName
        );

        System.out.println(
                "Administrator bootstrap account created."
        );
    }

    private String trim(String value) {
        if (value == null) {
            return null;
        }

        String trimmedValue = value.trim();
        return trimmedValue.isEmpty() ? null : trimmedValue;
    }
}