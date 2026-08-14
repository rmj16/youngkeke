"use client";

import { CustomerInquiryPage } from "./CustomerInquiryPage";
import { useInquiries } from "@features/inquiry/hooks/useInquiries";

export function CustomerApp() {
  const { inquiries, save } = useInquiries();

  const navigate = (path: string) => window.location.assign(path);

  return (
    <main>
      <CustomerInquiryPage inquiries={inquiries} save={save} navigate={navigate} />
    </main>
  );
}
