package com.airlab.admin.audit;

import com.airlab.admin.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AdminAuditController {

    private final AdminAuditService auditService;

    public AdminAuditController(AdminAuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ApiResponse<List<AdminAuditService.AuditLogItem>> list(
            @RequestParam(defaultValue = "100") int limit) {

        int safeLimit = Math.max(1, Math.min(limit, 500));
        return ApiResponse.ok(
                auditService.findRecent(safeLimit),
                "관리자 작업 이력을 조회했습니다.");
    }
}
