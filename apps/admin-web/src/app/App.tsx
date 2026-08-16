import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity, BadgeCheck, Bell, BookOpenCheck, Building2, CalendarDays, Check,
  ChevronDown, ChevronRight, CircleHelp, Clock3, FileClock, Headphones,
  LayoutDashboard, LogOut, Mail, Menu, MessageSquareText, Plane, RefreshCw,
  Search, ShieldCheck, TicketCheck, UserRound, UsersRound, X,
} from "lucide-react";
import "./admin.css";

type PageId = "dashboard" | "reservations" | "inquiries" | "crew" | "partners" | "audit";
type Inquiry = { id: string; category: string; customer: string; title: string; createdAt: string; status: "답변 대기" | "답변 완료"; content: string; answer?: string };
type PartnerRequest = { id: string; company: string; type: string; manager: string; createdAt: string; status: "검토 대기" | "승인" | "반려" };
type AuditItem = { id: number; action: string; target: string; time: string; result: "성공" | "실패"; ip: string };

const reservations = [
  { code: "AL-260813-0142", passenger: "김서연", flight: "AL204", route: "ICN → DPS", departure: "2026.08.14 10:35", seat: "12A", baggage: "20kg", status: "예약 확정" },
  { code: "AL-260813-0138", passenger: "박민준", flight: "AL118", route: "GMP → CJU", departure: "2026.08.14 08:20", seat: "7C", baggage: "15kg", status: "예약 확정" },
  { code: "AL-260812-0119", passenger: "이지우", flight: "AL502", route: "ICN → NRT", departure: "2026.08.15 13:10", seat: "18F", baggage: "20kg", status: "결제 대기" },
  { code: "AL-260812-0107", passenger: "정하늘", flight: "AL338", route: "PUS → TPE", departure: "2026.08.16 16:45", seat: "9D", baggage: "25kg", status: "예약 확정" },
  { code: "AL-260811-0094", passenger: "최유진", flight: "AL204", route: "ICN → DPS", departure: "2026.08.17 10:35", seat: "21B", baggage: "15kg", status: "취소 요청" },
];
const crewMembers = [
  { employeeNo: "CR-1042", name: "한지원", role: "객실 사무장", flight: "AL204", route: "ICN → DPS", duty: "탑승 준비", contact: "010-42**-1087" },
  { employeeNo: "CR-1128", name: "윤서진", role: "객실 승무원", flight: "AL204", route: "ICN → DPS", duty: "탑승 준비", contact: "010-73**-2261" },
  { employeeNo: "FO-0314", name: "장도윤", role: "부기장", flight: "AL118", route: "GMP → CJU", duty: "근무 중", contact: "010-31**-7204" },
  { employeeNo: "CP-0088", name: "오현우", role: "기장", flight: "AL502", route: "ICN → NRT", duty: "대기", contact: "010-64**-8832" },
  { employeeNo: "CR-1210", name: "임채원", role: "객실 승무원", flight: "AL338", route: "PUS → TPE", duty: "휴무", contact: "010-19**-3408" },
];
const initialInquiries: Inquiry[] = [
  { id: "Q-240813-038", category: "예약/발권", customer: "김서연", title: "예약 영문 이름 수정이 가능한가요?", createdAt: "오늘 10:42", status: "답변 대기", content: "예약 과정에서 영문 성의 철자를 잘못 입력했습니다. 출발 전에 수정할 수 있는지 확인 부탁드립니다." },
  { id: "Q-240813-035", category: "수하물", customer: "박민준", title: "추가 수하물 결제 확인 요청", createdAt: "오늘 09:18", status: "답변 대기", content: "추가 수하물 5kg을 결제했는데 예약 상세에는 아직 15kg으로 표시됩니다." },
  { id: "Q-240812-121", category: "좌석", customer: "이지우", title: "비상구 좌석 변경 문의", createdAt: "어제 16:20", status: "답변 완료", content: "현재 좌석을 비상구 좌석으로 바꾸고 싶습니다.", answer: "좌석 조건 확인 후 변경 방법을 이메일로 안내해 드렸습니다." },
  { id: "Q-240812-116", category: "운항", customer: "최유진", title: "태풍으로 인한 운항 여부 문의", createdAt: "어제 14:02", status: "답변 완료", content: "태풍 예보가 있어 출발편 운항 여부를 확인하고 싶습니다.", answer: "현재 정상 운항 예정이며 변경 시 등록된 연락처로 안내됩니다." },
];
const initialPartners: PartnerRequest[] = [
  { id: "PR-2026-0813", company: "스카이케이터링", type: "기내식 납품 일정 변경", manager: "배지훈", createdAt: "2026.08.13", status: "검토 대기" },
  { id: "PR-2026-0811", company: "에어포트로지스", type: "수하물 운송 인력 추가", manager: "문예린", createdAt: "2026.08.13", status: "검토 대기" },
  { id: "PR-2026-0804", company: "클린윙서비스", type: "정기 방역 작업 승인", manager: "강태호", createdAt: "2026.08.12", status: "승인" },
  { id: "PR-2026-0798", company: "글로벌라운지", type: "라운지 운영시간 변경", manager: "조수아", createdAt: "2026.08.11", status: "반려" },
];
const initialAudit: AuditItem[] = [
  { id: 4, action: "고객문의 답변", target: "Q-240812-121", time: "2026.08.13 09:42", result: "성공", ip: "10.10.40.21" },
  { id: 3, action: "협력 요청 승인", target: "PR-2026-0804", time: "2026.08.12 17:26", result: "성공", ip: "10.10.40.21" },
  { id: 2, action: "관리자 로그인", target: "admin01", time: "2026.08.12 09:01", result: "성공", ip: "10.10.40.21" },
  { id: 1, action: "관리자 로그인", target: "admin01", time: "2026.08.11 18:44", result: "실패", ip: "10.10.40.39" },
];
const navItems = [
  { id: "dashboard" as PageId, label: "통합 대시보드", icon: LayoutDashboard },
  { id: "reservations" as PageId, label: "예약 관리", icon: TicketCheck },
  { id: "inquiries" as PageId, label: "고객문의 관리", icon: MessageSquareText, badge: 2 },
  { id: "crew" as PageId, label: "직원·승무원", icon: UsersRound },
  { id: "partners" as PageId, label: "협력사 요청", icon: Building2, badge: 2 },
  { id: "audit" as PageId, label: "작업 이력", icon: FileClock },
];
const pageCopy: Record<PageId, { eyebrow: string; title: string; description: string }> = {
  dashboard: { eyebrow: "OVERVIEW", title: "통합 대시보드", description: "항공 서비스 운영 현황을 한눈에 확인하세요." },
  reservations: { eyebrow: "BOOKING SERVICE", title: "예약 관리", description: "고객 예약과 탑승 정보를 조회합니다." },
  inquiries: { eyebrow: "CUSTOMER CARE", title: "고객문의 관리", description: "접수된 문의를 확인하고 답변을 처리합니다." },
  crew: { eyebrow: "CREW OPERATIONS", title: "직원·승무원 현황", description: "직원 근무 상태와 배정 항공편을 확인합니다." },
  partners: { eyebrow: "PARTNER REQUESTS", title: "협력사 요청 관리", description: "협력사 요청을 검토하고 승인 또는 반려합니다." },
  audit: { eyebrow: "AUDIT LOG", title: "관리자 작업 이력", description: "관리자 계정의 주요 처리 내역을 확인합니다." },
};

function Brand({ dark = false }: { dark?: boolean }) { return <div className={`brand ${dark ? "brand--dark" : ""}`}><div className="brand__mark"><Plane size={23} /></div><div><strong>YOUNGKEKE AIR</strong><span>OPERATIONS CENTER</span></div></div> }

type AdminSession = {
  id: number;
  loginId: string;
  displayName: string;
  role: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
  timestamp: string;
};

function Login({
  onLogin,
}: {
  onLogin: (admin: AdminSession) => void;
}) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (!id.trim() || !password) {
      setErrorMessage("관리자 ID와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          loginId: id.trim(),
          password,
        }),
      });

      const body =
        (await response.json()) as ApiResponse<AdminSession>;

      if (!response.ok || !body.success || !body.data) {
        setErrorMessage(
          body.message || "관리자 로그인에 실패했습니다.",
        );
        return;
      }

      setPassword("");
      onLogin(body.data);
    } catch {
      setErrorMessage(
        "관리자 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-visual">
        <div className="login-visual__grid" />
        <Brand dark />

        <div className="login-visual__content">
          <span className="login-visual__label">
            <ShieldCheck size={16} />
            SECURE OPERATIONS
          </span>

          <h1>
            하늘 위 모든 운영을
            <br />
            하나의 화면에서.
          </h1>

          <p>
            예약부터 운항, 고객문의와 협력사 업무까지
            <br />
            YOUNGKEKE AIR 통합 운영센터에서 관리합니다.
          </p>
        </div>

        <div className="login-visual__status">
          <span><i /> 관리자 보안 세션</span>
          <span>YOUNGKEKE AIR</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel__inner">
          <div className="login-mobile-brand">
            <Brand />
          </div>

          <span className="section-kicker">ADMIN CONSOLE</span>
          <h2>관리자 로그인</h2>
          <p className="login-lead">
            승인된 관리자 계정으로 로그인해주세요.
          </p>

          <form onSubmit={submit} className="login-form">
            <label>
              관리자 ID
              <div className="field-with-icon">
                <UserRound size={18} />
                <input
                  value={id}
                  autoComplete="username"
                  onChange={(event) => {
                    setId(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="관리자 ID 입력"
                />
              </div>
            </label>

            <label>
              비밀번호
              <div className="field-with-icon">
                <ShieldCheck size={18} />
                <input
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="비밀번호 입력"
                />
              </div>
            </label>

            {errorMessage && (
              <p className="form-error">{errorMessage}</p>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "로그인 확인 중..." : "로그인"}
              {!submitting && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="demo-note">
            <CircleHelp size={17} />
            <span>
              <strong>보안 세션 로그인</strong>
              계정 정보는 브라우저에 저장하지 않습니다.
            </span>
          </div>

          <p className="copyright">
            © 2026 YOUNGKEKE AIR. Authorized personnel only.
          </p>
        </div>
      </section>
    </main>
  );
}

function Sidebar({ page, setPage, onLogout, open, onClose }: { page: PageId; setPage: (p: PageId) => void; onLogout: () => void; open: boolean; onClose: () => void }) {
  return <>{open && <button className="sidebar-scrim" onClick={onClose} aria-label="메뉴 닫기" />}<aside className={`sidebar ${open ? "is-open" : ""}`}><div className="sidebar__brand"><Brand dark /><button className="sidebar__close" onClick={onClose}><X size={21} /></button></div><p className="sidebar__label">MANAGEMENT</p><nav>{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => { setPage(item.id); onClose() }}><Icon size={19} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button> })}</nav><div className="sidebar__support"><div className="support-icon"><Headphones size={18} /></div><div><strong>시스템 문의</strong><span>내선 204</span></div></div><div className="sidebar__profile"><div className="avatar">김</div><div><strong>김관리</strong><span>최고 관리자</span></div><button onClick={onLogout} title="로그아웃"><LogOut size={18} /></button></div></aside></>;
}
function Topbar({ onMenu }: { onMenu: () => void }) { return <header className="topbar"><button className="mobile-menu" onClick={onMenu}><Menu size={22} /></button><div className="topbar__context"><CalendarDays size={17} /><span>2026년 8월 13일 목요일</span><i /><span>운영센터 KST 11:50</span></div><div className="topbar__actions"><div className="system-ok"><span /> 시스템 정상</div><button className="icon-button"><Bell size={19} /><i /></button><div className="topbar__user"><div className="avatar avatar--small">김</div><div><strong>김관리</strong><span>ADMINISTRATOR</span></div><ChevronDown size={15} /></div></div></header> }
function PageHeading({ page }: { page: PageId }) { const copy = pageCopy[page]; return <div className="page-heading"><span>{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p></div> }
function StatusPill({ value }: { value: string }) { const tone = value.includes("확정") || value === "승인" || value === "답변 완료" || value === "근무 중" || value === "정상" || value === "성공" ? "success" : value.includes("대기") || value.includes("준비") ? "waiting" : value === "반려" || value.includes("취소") || value === "실패" ? "danger" : "neutral"; return <span className={`status-pill ${tone}`}><i />{value}</span> }
function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) { return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div> }
function KpiCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Plane; tone: string }) { return <article className={`kpi-card kpi-card--${tone}`}><div className="kpi-card__top"><span>{label}</span><div><Icon size={20} /></div></div><strong>{value}</strong><p>{detail}</p></article> }

function Dashboard({ onNavigate, inquiries, partners }: { onNavigate: (p: PageId) => void; inquiries: Inquiry[]; partners: PartnerRequest[] }) {
  const pendingInquiries = inquiries.filter((x) => x.status === "답변 대기").length, pendingPartners = partners.filter((x) => x.status === "검토 대기").length;
  return <><div className="kpi-grid"><KpiCard label="오늘 예약" value="128" detail="어제보다 12.4% 증가" icon={TicketCheck} tone="blue" /><KpiCard label="운항 예정" value="24" detail="지연 1편 · 결항 0편" icon={Plane} tone="navy" /><KpiCard label="답변 대기 문의" value={String(pendingInquiries)} detail="24시간 초과 0건" icon={Mail} tone="sky" /><KpiCard label="승인 대기 요청" value={String(pendingPartners)} detail="오늘 신규 2건" icon={BookOpenCheck} tone="amber" /></div><div className="dashboard-grid"><section className="panel"><SectionTitle title="최근 예약 현황" subtitle="오늘 등록된 예약을 확인하세요." action={<button className="link-button" onClick={() => onNavigate("reservations")}>전체 보기 <ChevronRight size={16} /></button>} /><div className="table-wrap"><table><thead><tr><th>예약번호</th><th>승객명</th><th>항공편</th><th>구간</th><th>출발 일시</th><th>상태</th></tr></thead><tbody>{reservations.slice(0,4).map((x) => <tr key={x.code}><td className="strong-cell">{x.code}</td><td>{x.passenger}</td><td>{x.flight}</td><td>{x.route}</td><td>{x.departure}</td><td><StatusPill value={x.status} /></td></tr>)}</tbody></table></div></section><section className="panel"><SectionTitle title="서비스 상태" subtitle="실시간 연결 현황" /><div className="service-list">{[{name:"예약 서비스",desc:"Tomcat · PostgreSQL"},{name:"승무원 서비스",desc:"Tomcat · PostgreSQL"},{name:"협력사 서비스",desc:"WildFly · MySQL"},{name:"관리자 서비스",desc:"WildFly · MySQL"}].map((s) => <div key={s.name}><div className="service-icon"><Activity size={17} /></div><div><strong>{s.name}</strong><span>{s.desc}</span></div><StatusPill value="정상" /></div>)}</div><div className="uptime"><div><span>오늘 가동률</span><strong>99.98%</strong></div><div className="progress"><i /></div></div></section></div><div className="dashboard-grid dashboard-grid--bottom"><section className="panel"><SectionTitle title="처리 대기 업무" subtitle="우선 확인이 필요한 업무입니다." /><div className="task-row"><div className="task-icon"><Mail size={18} /></div><div><strong>답변을 기다리는 고객문의</strong><span>예약/발권 및 수하물 문의</span></div><b>{pendingInquiries}건</b><button onClick={() => onNavigate("inquiries")}>처리하기</button></div><div className="task-row"><div className="task-icon task-icon--partner"><Building2 size={18} /></div><div><strong>검토가 필요한 협력사 요청</strong><span>납품 일정 및 인력 요청</span></div><b>{pendingPartners}건</b><button onClick={() => onNavigate("partners")}>검토하기</button></div></section><section className="panel flight-panel"><SectionTitle title="다음 운항" subtitle="출발 임박 항공편" /><div className="flight-route"><div><strong>ICN</strong><span>서울/인천</span></div><div><Plane size={20} /><i /></div><div><strong>DPS</strong><span>발리</span></div></div><div className="flight-meta"><span><b>AL204</b> · A330-300</span><span>10:35 출발 · 탑승 준비</span></div></section></div></>;
}

function Toolbar({ value, setValue, placeholder, filter, setFilter, options }: { value: string; setValue: (v:string)=>void; placeholder:string; filter:string; setFilter:(v:string)=>void; options:string[] }) { return <div className="toolbar"><label className="search-field"><Search size={18} /><input value={value} onChange={(e)=>setValue(e.target.value)} placeholder={placeholder} /></label><label className="select-field"><select value={filter} onChange={(e)=>setFilter(e.target.value)}>{options.map((x)=><option key={x}>{x}</option>)}</select><ChevronDown size={16}/></label><button className="refresh-button" onClick={()=>{setValue("");setFilter(options[0])}}><RefreshCw size={17}/> 초기화</button></div> }
function EmptyRow({ colSpan }: { colSpan:number }) { return <tr><td colSpan={colSpan} className="empty-cell">조건에 맞는 데이터가 없습니다.</td></tr> }

function ReservationsPage() {
  const [search,setSearch]=useState(""),[filter,setFilter]=useState("전체 상태"),[selected,setSelected]=useState(reservations[0]);
  const filtered=reservations.filter((x)=>(filter==="전체 상태"||x.status===filter)&&Object.values(x).some((v)=>v.toLowerCase().includes(search.toLowerCase())));
  return <section className="panel page-panel"><SectionTitle title="예약 목록" subtitle={`전체 ${reservations.length}건 · 목업 데이터`} /><Toolbar value={search} setValue={setSearch} placeholder="예약번호, 승객명, 항공편 검색" filter={filter} setFilter={setFilter} options={["전체 상태","예약 확정","결제 대기","취소 요청"]}/><div className="table-wrap"><table><thead><tr><th>예약번호</th><th>승객명</th><th>항공편</th><th>구간</th><th>출발 일시</th><th>좌석</th><th>수하물</th><th>상태</th><th/></tr></thead><tbody>{filtered.length?filtered.map((x)=><tr key={x.code}><td className="strong-cell">{x.code}</td><td>{x.passenger}</td><td>{x.flight}</td><td>{x.route}</td><td>{x.departure}</td><td>{x.seat}</td><td>{x.baggage}</td><td><StatusPill value={x.status}/></td><td><button className="table-button" onClick={()=>setSelected(x)}>상세</button></td></tr>):<EmptyRow colSpan={9}/>}</tbody></table></div><div className="detail-strip"><div><span>선택한 예약</span><strong>{selected.code}</strong></div><div><span>탑승객</span><strong>{selected.passenger}</strong></div><div><span>여정</span><strong>{selected.route}</strong></div><div><span>좌석 / 수하물</span><strong>{selected.seat} / {selected.baggage}</strong></div><StatusPill value={selected.status}/></div></section>;
}

function InquiriesPage({ inquiries,setInquiries,addAudit,notify }: { inquiries:Inquiry[]; setInquiries:React.Dispatch<React.SetStateAction<Inquiry[]>>; addAudit:(a:string,t:string)=>void; notify:(m:string)=>void }) {
  const [search,setSearch]=useState(""),[filter,setFilter]=useState("전체 상태"),[selectedId,setSelectedId]=useState(inquiries[0].id),[draft,setDraft]=useState(""); const selected=inquiries.find((x)=>x.id===selectedId)||inquiries[0]; const filtered=inquiries.filter((x)=>(filter==="전체 상태"||x.status===filter)&&`${x.id}${x.customer}${x.title}`.toLowerCase().includes(search.toLowerCase()));
  function answer(){if(!draft.trim())return;setInquiries((items)=>items.map((x)=>x.id===selected.id?{...x,status:"답변 완료",answer:draft}:x));addAudit("고객문의 답변",selected.id);notify("고객문의 답변이 저장되었습니다.");setDraft("")}
  return <div className="split-panel"><section className="panel page-panel"><SectionTitle title="문의 목록" subtitle={`${inquiries.filter((x)=>x.status==="답변 대기").length}건의 답변이 필요합니다.`}/><Toolbar value={search} setValue={setSearch} placeholder="문의번호, 고객명, 제목 검색" filter={filter} setFilter={setFilter} options={["전체 상태","답변 대기","답변 완료"]}/><div className="inquiry-list">{filtered.map((x)=><button key={x.id} onClick={()=>setSelectedId(x.id)} className={selected.id===x.id?"active":""}><div><span>{x.category}</span><StatusPill value={x.status}/></div><strong>{x.title}</strong><p>{x.customer} · {x.id}</p><time>{x.createdAt}</time></button>)}</div></section><aside className="panel detail-panel"><div className="detail-panel__header"><span>{selected.category}</span><StatusPill value={selected.status}/></div><h2>{selected.title}</h2><div className="detail-meta"><span>문의번호 <b>{selected.id}</b></span><span>고객명 <b>{selected.customer}</b></span><span>접수일 <b>{selected.createdAt}</b></span></div><div className="message-box"><span>고객 문의</span><p>{selected.content}</p></div>{selected.answer&&<div className="message-box message-box--answer"><span>관리자 답변</span><p>{selected.answer}</p></div>}<label className="answer-field"><span>{selected.answer?"답변 수정":"답변 작성"}</span><textarea value={draft} onChange={(e)=>setDraft(e.target.value)} placeholder="고객에게 전달할 답변을 입력하세요." rows={6}/></label><div className="detail-actions"><button className="primary-button" onClick={answer} disabled={!draft.trim()}><Check size={17}/> 답변 저장</button></div></aside></div>;
}

function CrewPage(){const[search,setSearch]=useState(""),[filter,setFilter]=useState("전체 상태");const filtered=crewMembers.filter((x)=>(filter==="전체 상태"||x.duty===filter)&&`${x.employeeNo}${x.name}${x.flight}${x.role}`.toLowerCase().includes(search.toLowerCase()));return <><div className="mini-kpis"><div><UsersRound size={19}/><span>전체 직원<strong>184명</strong></span></div><div><Plane size={19}/><span>오늘 배정<strong>68명</strong></span></div><div><Clock3 size={19}/><span>대기 인원<strong>21명</strong></span></div></div><section className="panel page-panel"><SectionTitle title="직원 및 배정 현황" subtitle="직원별 근무 상태와 항공편 배정을 조회합니다."/><Toolbar value={search} setValue={setSearch} placeholder="직원번호, 이름, 항공편 검색" filter={filter} setFilter={setFilter} options={["전체 상태","근무 중","탑승 준비","대기","휴무"]}/><div className="table-wrap"><table><thead><tr><th>직원번호</th><th>이름</th><th>직책</th><th>배정 항공편</th><th>운항 구간</th><th>연락처</th><th>근무 상태</th></tr></thead><tbody>{filtered.length?filtered.map((x)=><tr key={x.employeeNo}><td className="strong-cell">{x.employeeNo}</td><td><div className="person-cell"><span>{x.name[0]}</span><strong>{x.name}</strong></div></td><td>{x.role}</td><td>{x.flight}</td><td>{x.route}</td><td>{x.contact}</td><td><StatusPill value={x.duty}/></td></tr>):<EmptyRow colSpan={7}/>}</tbody></table></div></section></>}

function PartnersPage({partners,setPartners,addAudit,notify}:{partners:PartnerRequest[];setPartners:React.Dispatch<React.SetStateAction<PartnerRequest[]>>;addAudit:(a:string,t:string)=>void;notify:(m:string)=>void}){const[search,setSearch]=useState(""),[filter,setFilter]=useState("전체 상태"),[selected,setSelected]=useState<PartnerRequest|null>(null);const filtered=partners.filter((x)=>(filter==="전체 상태"||x.status===filter)&&`${x.id}${x.company}${x.type}`.toLowerCase().includes(search.toLowerCase()));function changeStatus(status:"승인"|"반려"){if(!selected)return;setPartners((items)=>items.map((x)=>x.id===selected.id?{...x,status}:x));addAudit(`협력 요청 ${status}`,selected.id);notify(`협력사 요청이 ${status} 처리되었습니다.`);setSelected(null)}return <><section className="panel page-panel"><SectionTitle title="협력사 요청 목록" subtitle={`${partners.filter((x)=>x.status==="검토 대기").length}건의 요청이 검토를 기다리고 있습니다.`}/><Toolbar value={search} setValue={setSearch} placeholder="요청번호, 협력사명, 요청 내용 검색" filter={filter} setFilter={setFilter} options={["전체 상태","검토 대기","승인","반려"]}/><div className="table-wrap"><table><thead><tr><th>요청번호</th><th>협력사</th><th>요청 내용</th><th>담당자</th><th>접수일</th><th>상태</th><th/></tr></thead><tbody>{filtered.length?filtered.map((x)=><tr key={x.id}><td className="strong-cell">{x.id}</td><td>{x.company}</td><td>{x.type}</td><td>{x.manager}</td><td>{x.createdAt}</td><td><StatusPill value={x.status}/></td><td><button className="table-button" onClick={()=>setSelected(x)}>{x.status==="검토 대기"?"검토":"상세"}</button></td></tr>):<EmptyRow colSpan={7}/>}</tbody></table></div></section>{selected&&<div className="modal-layer" onMouseDown={(e)=>e.target===e.currentTarget&&setSelected(null)}><section className="modal"><button className="modal__close" onClick={()=>setSelected(null)}><X size={20}/></button><span className="section-kicker">PARTNER REQUEST</span><h2>협력사 요청 검토</h2><div className="modal-card"><span>요청번호</span><strong>{selected.id}</strong><span>협력사</span><strong>{selected.company}</strong><span>담당자</span><strong>{selected.manager}</strong><span>요청 내용</span><strong>{selected.type}</strong></div><label className="answer-field"><span>검토 메모</span><textarea rows={4} placeholder="승인 또는 반려 사유를 입력하세요."/></label>{selected.status==="검토 대기"?<div className="modal__actions"><button className="danger-button" onClick={()=>changeStatus("반려")}><X size={17}/> 반려</button><button className="primary-button" onClick={()=>changeStatus("승인")}><Check size={17}/> 승인</button></div>:<div className="modal__done"><BadgeCheck size={19}/>이미 {selected.status} 처리된 요청입니다.</div>}</section></div>}</>}

function AuditPage({audit}:{audit:AuditItem[]}){const[search,setSearch]=useState(""),[filter,setFilter]=useState("전체 결과");const filtered=audit.filter((x)=>(filter==="전체 결과"||x.result===filter)&&`${x.action}${x.target}${x.ip}`.toLowerCase().includes(search.toLowerCase()));return <section className="panel page-panel"><SectionTitle title="작업 이력" subtitle="중요 관리자 작업은 자동으로 기록됩니다."/><Toolbar value={search} setValue={setSearch} placeholder="작업 내용, 대상, IP 검색" filter={filter} setFilter={setFilter} options={["전체 결과","성공","실패"]}/><div className="audit-info"><ShieldCheck size={19}/><p><strong>감사 로그 안내</strong>작업 이력은 보안 정책에 따라 기록되며 임의로 수정하거나 삭제할 수 없습니다.</p></div><div className="table-wrap"><table><thead><tr><th>일시</th><th>관리자</th><th>작업 종류</th><th>작업 대상</th><th>접속 IP</th><th>결과</th></tr></thead><tbody>{filtered.length?filtered.map((x)=><tr key={x.id}><td>{x.time}</td><td><div className="person-cell"><span>김</span><strong>김관리</strong></div></td><td>{x.action}</td><td className="strong-cell">{x.target}</td><td className="mono-cell">{x.ip}</td><td><StatusPill value={x.result}/></td></tr>):<EmptyRow colSpan={6}/>}</tbody></table></div></section>}

export default function App() {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [page, setPage] = useState<PageId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [partners, setPartners] = useState(initialPartners);
  const [audit, setAudit] = useState(initialAudit);
  const [toast, setToast] = useState("");

  const title = useMemo(() => pageCopy[page].title, [page]);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const response = await fetch("/api/admin/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const body =
          (await response.json()) as ApiResponse<AdminSession>;

        if (active && body.success && body.data) {
          setAdmin(body.data);
        }
      } catch {
        // 서버 연결 전에는 로그인 화면을 표시합니다.
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function addAudit(action: string, target: string) {
    setAudit((items) => [
      {
        id: Date.now(),
        action,
        target,
        time: new Date().toLocaleString("ko-KR"),
        result: "성공",
        ip: "-",
      },
      ...items,
    ]);
  }

  function login(session: AdminSession) {
    setAdmin(session);
  }

  async function logout() {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAdmin(null);
      setPage("dashboard");
    }
  }

  if (checkingSession) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <p>관리자 세션 확인 중...</p>
        </section>
      </main>
    );
  }

  if (!admin) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="admin-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <Topbar onMenu={() => setSidebarOpen(true)} />

        <main className="content" aria-label={title}>
          <PageHeading page={page} />

          {page === "dashboard" && (
            <Dashboard
              onNavigate={setPage}
              inquiries={inquiries}
              partners={partners}
            />
          )}

          {page === "reservations" && <ReservationsPage />}

          {page === "inquiries" && (
            <InquiriesPage
              inquiries={inquiries}
              setInquiries={setInquiries}
              addAudit={addAudit}
              notify={notify}
            />
          )}

          {page === "crew" && <CrewPage />}

          {page === "partners" && (
            <PartnersPage
              partners={partners}
              setPartners={setPartners}
              addAudit={addAudit}
              notify={notify}
            />
          )}

          {page === "audit" && <AuditPage audit={audit} />}
        </main>
      </div>

      {toast && (
        <div className="toast">
          <Check size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
