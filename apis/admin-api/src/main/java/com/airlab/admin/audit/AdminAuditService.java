package com.airlab.admin.audit;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AdminAuditService {

    private final JdbcTemplate jdbcTemplate;

    public AdminAuditService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void record(
            Long adminId,
            String actionType,
            String targetType,
            String targetId,
            String detail,
            String result,
            HttpServletRequest request) {

        jdbcTemplate.update(
                """
                INSERT INTO admin_audit_logs (
                    admin_id, action_type, target_type, target_id,
                    detail, client_ip, result
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                adminId,
                actionType,
                targetType,
                targetId,
                detail,
                clientIp(request),
                result);
    }

    public List<AuditLogItem> findRecent(int limit) {
        return jdbcTemplate.query(
                """
                SELECT logs.id,
                       COALESCE(accounts.login_id, 'SYSTEM') AS admin_login_id,
                       logs.action_type,
                       logs.target_type,
                       logs.target_id,
                       logs.detail,
                       logs.result,
                       logs.client_ip,
                       logs.created_at
                FROM admin_audit_logs logs
                LEFT JOIN admin_accounts accounts ON accounts.id = logs.admin_id
                ORDER BY logs.id DESC
                LIMIT ?
                """,
                (resultSet, rowNumber) -> new AuditLogItem(
                        resultSet.getLong("id"),
                        resultSet.getString("admin_login_id"),
                        resultSet.getString("action_type"),
                        resultSet.getString("target_type"),
                        resultSet.getString("target_id"),
                        resultSet.getString("detail"),
                        resultSet.getString("result"),
                        resultSet.getString("client_ip"),
                        resultSet.getObject("created_at", LocalDateTime.class)),
                limit);
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    public record AuditLogItem(
            Long id,
            String adminLoginId,
            String actionType,
            String targetType,
            String targetId,
            String detail,
            String result,
            String clientIp,
            LocalDateTime createdAt) {
    }
}
