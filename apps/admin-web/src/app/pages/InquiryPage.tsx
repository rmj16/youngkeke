"use client";

import "@inq/inquiry.scoped.css";
import { CustomerApp } from "@inq/features/customer/CustomerApp";

// 예약/고객 문의 페이지 (inquires 브랜치 통합) — CSS는 .inq-root 로 스코프됨
export function InquiryPage() {
  return (
    <div className="inq-root">
      <CustomerApp />
    </div>
  );
}
