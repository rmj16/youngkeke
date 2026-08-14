"use client";

import { AdminApp } from "./AdminApp";

// 관리자 대시보드/문의관리 (inquires 브랜치 통합) — CSS는 .inq-root 로 스코프됨
export function AdminPage({ view }: { view: "dashboard" | "admin-inquiries" }) {
  return (
    <div className="inq-root">
      <AdminApp view={view} />
    </div>
  );
}
