import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AdminApp } from "@/src/features/admin/AdminApp";
import { CustomerApp } from "@/src/features/customer/CustomerApp";
import "@/src/styles/index.css";

function AppRouter() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path === "/inquires" || path === "/inquiries") {
    return <CustomerApp />;
  }

  if (path === "/admin/inquiries") {
    return <AdminApp view="admin-inquiries" />;
  }

  if (path === "/admin") {
    return <AdminApp view="dashboard" />;
  }

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
