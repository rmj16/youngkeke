"use client";

import { AdminShell } from "@/src/features/admin/AdminShell";
import { useInquiries } from "@/src/shared/hooks/useInquiries";

type AdminView = "dashboard" | "admin-inquiries";

export function AdminApp({ view }: { view: AdminView }) {
  const { inquiries, save } = useInquiries();

  const navigate = (target: string) => {
    const routes: Record<string, string> = {
      contact: "/",
      dashboard: "/admin",
      "admin-inquiries": "/admin/inquiries",
    };

    window.location.assign(routes[target] ?? "/admin");
  };

  return (
    <main>
      <AdminShell
        view={view}
        navigate={navigate}
        inquiries={inquiries}
        save={save}
      />
    </main>
  );
}
