package com.example.partner;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class WorkOrderRepository {

    private final JdbcTemplate jdbcTemplate;

    public WorkOrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<WorkOrder> findAll() {
        String sql = "SELECT id, title, status FROM work_orders";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            WorkOrder w = new WorkOrder();
            w.setId(rs.getInt("id"));
            w.setTitle(rs.getString("title"));
            w.setStatus(rs.getString("status"));
            return w;
        });
    }

    public WorkOrder save(WorkOrder order) {
        String sql = "INSERT INTO work_orders (title, status) VALUES (?, ?)";
        jdbcTemplate.update(sql, order.getTitle(), order.getStatus());
        return order;
    }

    public void updateStatus(int id, String status) {
        String sql = "UPDATE work_orders SET status = ? WHERE id = ?";
        jdbcTemplate.update(sql, status, id);
    }
}
