"use client";

import { CustomerInquiryPage } from "@/src/features/customer/pages/CustomerInquiryPage";
import { useInquiries } from "@/src/shared/hooks/useInquiries";

export function CustomerApp() {
  const { inquiries, save } = useInquiries();

  const navigate = (path: string) => window.location.assign(path);

  return (
    <main>
      <CustomerInquiryPage inquiries={inquiries} save={save} navigate={navigate} />
    </main>
  );
}
