"use client";

import { CustomerInquiryPage } from "@inq/features/customer/pages/CustomerInquiryPage";
import { useInquiries } from "@inq/shared/hooks/useInquiries";

export function CustomerApp() {
  const { inquiries, save } = useInquiries();

  const navigate = (path: string) => window.location.assign(path);

  return (
    <main>
      <CustomerInquiryPage inquiries={inquiries} save={save} navigate={navigate} />
    </main>
  );
}
