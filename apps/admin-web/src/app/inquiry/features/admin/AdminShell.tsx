import { adminNavigation } from "@inq/shared/data/inquiries";
import { DashboardPage as Dashboard } from "@inq/features/admin/pages/DashboardPage";
import { InquiriesPage as InquiryAdmin } from "@inq/features/admin/pages/InquiriesPage";
import type { Inquiry } from "@inq/shared/types/inquiry";

export function AdminShell({ view, navigate, inquiries, save }: { view: string; navigate: (v: string) => void; inquiries: Inquiry[]; save: (i: Inquiry[]) => void }) {
  return (
    <div className="admin-app">
      <aside className="global-rail"><div className="jira-dot">J</div><button aria-label="검색">⌕</button><button aria-label="만들기">＋</button><div className="rail-spacer" /><button aria-label="알림">♢</button><button aria-label="도움말">?</button><div className="avatar">A</div></aside>
      <aside className="admin-sidebar">
        <div className="admin-brand"><div className="jira-product">J</div><strong>Jira Software</strong><span>↗</span></div>
        <div className="workspace-select"><div className="workspace-icon">MC</div><div><strong>My Company</strong><small>Customer Support</small></div><span>⌄</span></div>
        <nav>{adminNavigation.map((item) => <button key={item.key} className={(view === item.key || (view === "admin-inquiries" && item.key === "inquiries")) ? "active" : ""} onClick={() => item.key === "dashboard" ? navigate("dashboard") : item.key === "inquiries" ? navigate("admin-inquiries") : undefined}><span>{item.icon}</span>{item.label}{item.key === "inquiries" && <b>{inquiries.filter((i) => i.status === "접수").length}</b>}</button>)}</nav>
        <div className="sidebar-bottom"><button onClick={() => navigate("contact")}><span>↗</span>사용자 페이지</button><button><span>⚙</span>설정</button></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar"><div className="breadcrumbs">Home <span>/</span> Customer Support <span>/</span> {view === "dashboard" ? "Dashboard" : "Inquiries"}</div><div className="top-actions"><label className="admin-search">⌕<input placeholder="Search" /></label><button aria-label="알림">♧<i /></button><div className="profile"><span>A</span><div><strong>Admin</strong><small>Administrator</small></div><b>⌄</b></div></div></header>
        <div className="component-banner"><span>ⓘ</span><strong>Customer Support Center</strong><p>Monitor requests, response times, and customer care performance from one workspace.</p></div>
        <div className="component-tabs"><button className={view === "dashboard" ? "active" : ""} onClick={() => navigate("dashboard")}>Overview</button><button className={view === "admin-inquiries" ? "active" : ""} onClick={() => navigate("admin-inquiries")}>Inquiries</button><button>Data Tables</button><button>Text Editor</button><button>Email</button><button>Accordion</button></div>
        {view === "dashboard" ? <Dashboard inquiries={inquiries} navigate={navigate} /> : <InquiryAdmin inquiries={inquiries} save={save} />}
      </section>
    </div>
  );
}
