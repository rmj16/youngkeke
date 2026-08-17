"use client";

import { useEffect } from "react";
import { CustomerInquiryPage } from "@inq/features/customer/pages/CustomerInquiryPage";
import { useInquiries } from "@inq/shared/hooks/useInquiries";

export function CustomerApp() {
  const inquiryState = useInquiries();

  const navigate = (path: string) => window.location.assign(path);

  useEffect(() => {
    if (inquiryState.unauthenticated) {
      window.location.assign(`/login?redirect=${encodeURIComponent("/inquiry")}`);
    }
  }, [inquiryState.unauthenticated]);

  if (inquiryState.loading || inquiryState.unauthenticated) {
    return <div className="customer-api-notice">회원 로그인과 문의 내역을 확인하고 있습니다.</div>;
  }

  if (inquiryState.error || !inquiryState.member) {
    return (
      <div className="customer-api-notice error">
        <strong>문의 서비스를 불러오지 못했습니다.</strong>
        <span>{inquiryState.error}</span>
        <button onClick={() => void inquiryState.refresh()}>다시 시도</button>
      </div>
    );
  }

  return (
    <main>
      <CustomerInquiryPage
        inquiries={inquiryState.inquiries}
        member={inquiryState.member}
        createInquiry={inquiryState.create}
        updateInquiry={inquiryState.update}
        deleteInquiry={inquiryState.remove}
        navigate={navigate}
      />
    </main>
  );
}
