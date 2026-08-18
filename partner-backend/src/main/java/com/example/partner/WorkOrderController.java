package com.example.partner;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
@RestController
public class WorkOrderController {

    private final WorkOrderRepository repository;

    public WorkOrderController(WorkOrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/partner/requests")
    public List<WorkOrder> getRequests() {
        return repository.findAll();
    }

    @PostMapping("/api/partner/requests")
    public WorkOrder createRequest(@RequestBody WorkOrder newOrder) {
        return repository.save(newOrder);
    }

    @PatchMapping("/api/partner/requests/{id}/status")
    public String updateStatus(@PathVariable int id, @RequestParam String status) {
        repository.updateStatus(id, status);
        return "상태가 변경되었습니다";
    }
}
