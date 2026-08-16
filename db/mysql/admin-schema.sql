-- YOUNGKEKE AIR 관리자 서비스 DB 스키마
-- 실제 DB 계정 비밀번호는 이 파일에 기록하지 않는다.

CREATE DATABASE IF NOT EXISTS admin_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE admin_db;

CREATE TABLE IF NOT EXISTS admin_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    login_id VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id BIGINT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NULL,
    detail VARCHAR(500) NULL,
    result VARCHAR(20) NOT NULL,
    client_ip VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_audit_account
        FOREIGN KEY (admin_id)
        REFERENCES admin_accounts(id)
        ON DELETE SET NULL,

    INDEX idx_admin_audit_created_at (created_at),
    INDEX idx_admin_audit_action_type (action_type)
) ENGINE=InnoDB;