import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity, BadgeCheck, Bell, BookOpenCheck, Building2, CalendarDays, Check,
  ChevronDown, ChevronRight, CircleHelp, Clock3, FileClock, Headphones,
  LayoutDashboard, LogOut, Mail, Menu, MessageSquareText, Plane, RefreshCw,
  Search, ShieldCheck, TicketCheck, UserRound, UsersRound, X,
} from "lucide-react";
import {
  AuditItem,
  CrewMember,
  Inquiry,
  PartnerRequest,
  Reservation,
  errorMessage,
  fetchAuditLogs,
  fetchCrew,
  fetchInquiries,
  fetchPartnerRequests,
  fetchReservations,
  saveInquiryAnswer,
  savePartnerStatus,
} from "./adminApi";
import "./admin.css";

type PageId = "dashboard" | "reservations" | "inquiries" | "crew" | "partners" | "audit";
const navItems = [
  { id: "dashboard" as PageId, label: "통합 대시보드", icon: LayoutDashboard },
  { id: "reservations" as PageId, label: "예약 관리", icon: TicketCheck },
  { id: "inquiries" as PageId, label: "고객문의 관리", icon: MessageSquareText },
  { id: "crew" as PageId, label: "직원·승무원", icon: UsersRound },
  { id: "partners" as PageId, label: "협력사 요청", icon: Building2 },
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

function Sidebar({ page, setPage, onLogout, open, onClose, admin }: { page: PageId; setPage: (p: PageId) => void; onLogout: () => void; open: boolean; onClose: () => void; admin: AdminSession }) {
  return <>{open && <button className="sidebar-scrim" onClick={onClose} aria-label="메뉴 닫기" />}<aside className={`sidebar ${open ? "is-open" : ""}`}><div className="sidebar__brand"><Brand dark /><button className="sidebar__close" onClick={onClose}><X size={21} /></button></div><p className="sidebar__label">MANAGEMENT</p><nav>{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => { setPage(item.id); onClose() }}><Icon size={19} /><span>{item.label}</span></button> })}</nav><div className="sidebar__support"><div className="support-icon"><Headphones size={18} /></div><div><strong>시스템 문의</strong><span>운영 담당자</span></div></div><div className="sidebar__profile"><div className="avatar">{admin.displayName.slice(0,1)}</div><div><strong>{admin.displayName}</strong><span>{admin.role}</span></div><button onClick={onLogout} title="로그아웃"><LogOut size={18} /></button></div></aside></>;
}
function Topbar({ onMenu, admin }: { onMenu: () => void; admin: AdminSession }) { const now = new Date(); return <header className="topbar"><button className="mobile-menu" onClick={onMenu}><Menu size={22} /></button><div className="topbar__context"><CalendarDays size={17} /><span>{now.toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric",weekday:"long"})}</span><i /><span>운영센터 KST {now.toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})}</span></div><div className="topbar__actions"><button className="icon-button"><Bell size={19} /></button><div className="topbar__user"><div className="avatar avatar--small">{admin.displayName.slice(0,1)}</div><div><strong>{admin.displayName}</strong><span>{admin.role}</span></div><ChevronDown size={15} /></div></div></header> }
function PageHeading({ page }: { page: PageId }) { const copy = pageCopy[page]; return <div className="page-heading"><span>{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p></div> }
function StatusPill({ value }: { value: string }) { const status=value.toUpperCase(); const tone=/SUCCESS|APPROVED|ANSWERED|CONFIRMED|VERIFIED|COMPLETED|ISSUED|정상|성공|승인|완료/.test(status)?"success":/PENDING|WAITING|IN_PROGRESS|대기|처리 중|준비/.test(status)?"waiting":/FAIL|REJECT|CANCEL|반려|취소|실패|오류/.test(status)?"danger":"neutral"; return <span className={`status-pill ${tone}`}><i />{value}</span> }
function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) { return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div> }
function KpiCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Plane; tone: string }) { return <article className={`kpi-card kpi-card--${tone}`}><div className="kpi-card__top"><span>{label}</span><div><Icon size={20} /></div></div><strong>{value}</strong><p>{detail}</p></article> }

function Dashboard({ onNavigate, reservations, inquiries, crew, partners, errors }: { onNavigate:(p:PageId)=>void; reservations:Reservation[]; inquiries:Inquiry[]; crew:CrewMember[]; partners:PartnerRequest[]; errors:Record<string,string> }) {
  const pendingInquiries=inquiries.filter((x)=>/PENDING|IN_PROGRESS|대기|처리 중/i.test(x.status)).length;
  const pendingPartners=partners.filter((x)=>/PENDING|대기|검토/i.test(x.status)).length;
  const pendingCrew=crew.filter((x)=>[x.passportStatus,x.baggageStatus,x.ticketStatus].some((value)=>/PENDING|WAITING|대기|미완료|미확인/i.test(value))).length;
  const services=[{name:"예약 서비스",desc:"Tomcat · PostgreSQL",error:errors.reservations},{name:"승무원 서비스",desc:"Tomcat · PostgreSQL",error:errors.crew},{name:"협력사 서비스",desc:"WildFly · MySQL",error:errors.partners},{name:"관리자 서비스",desc:"WildFly · MySQL",error:""}];
  return <><div className="kpi-grid"><KpiCard label="전체 예약" value={String(reservations.length)} detail="예약 API 실데이터" icon={TicketCheck} tone="blue"/><KpiCard label="직원 업무 현황" value={String(crew.length)} detail={`처리 확인 필요 ${pendingCrew}건`} icon={Plane} tone="navy"/><KpiCard label="답변 대기 문의" value={String(pendingInquiries)} detail="Q&A API 실데이터" icon={Mail} tone="sky"/><KpiCard label="승인 대기 요청" value={String(pendingPartners)} detail="협력사 API 실데이터" icon={BookOpenCheck} tone="amber"/></div><div className="dashboard-grid"><section className="panel"><SectionTitle title="최근 예약 현황" subtitle="예약 서비스가 반환한 데이터입니다." action={<button className="link-button" onClick={()=>onNavigate("reservations")}>전체 보기 <ChevronRight size={16}/></button>}/><div className="table-wrap"><table><thead><tr><th>예약번호</th><th>승객명</th><th>항공편</th><th>구간</th><th>출발 일시</th><th>상태</th></tr></thead><tbody>{reservations.slice(0,5).map((x)=><tr key={x.code}><td className="strong-cell">{x.code}</td><td>{x.passenger}</td><td>{x.flight}</td><td>{x.route}</td><td>{x.departure}</td><td><StatusPill value={x.status}/></td></tr>)}{!reservations.length&&<EmptyRow colSpan={6}/>}</tbody></table></div></section><section className="panel"><SectionTitle title="서비스 연결 상태" subtitle="최근 API 조회 결과"/><div className="service-list">{services.map((service)=><div key={service.name}><div className="service-icon"><Activity size={17}/></div><div><strong>{service.name}</strong><span>{service.desc}</span></div><StatusPill value={service.error?"연결 오류":"정상"}/></div>)}</div></section></div><div className="dashboard-grid dashboard-grid--bottom"><section className="panel"><SectionTitle title="처리 대기 업무" subtitle="실제 서비스에서 확인된 업무입니다."/><div className="task-row"><div className="task-icon"><Mail size={18}/></div><div><strong>답변을 기다리는 고객문의</strong><span>예약 서비스 Q&A</span></div><b>{pendingInquiries}건</b><button onClick={()=>onNavigate("inquiries")}>처리하기</button></div><div className="task-row"><div className="task-icon task-icon--partner"><Building2 size={18}/></div><div><strong>검토가 필요한 협력사 요청</strong><span>협력사 서비스 요청</span></div><b>{pendingPartners}건</b><button onClick={()=>onNavigate("partners")}>검토하기</button></div></section><section className="panel"><SectionTitle title="데이터 운영 원칙" subtitle="관리자 서비스 저장 범위"/><div className="audit-info"><ShieldCheck size={19}/><p><strong>중복 저장하지 않습니다.</strong>예약·직원·협력사 데이터는 원본 API에서 조회하고 admin_db에는 관리자 계정과 작업 이력만 저장합니다.</p></div></section></div></>;
}

function Toolbar({ value, setValue, placeholder, filter, setFilter, options, onRefresh }: { value: string; setValue: (v:string)=>void; placeholder:string; filter:string; setFilter:(v:string)=>void; options:string[]; onRefresh?:()=>void }) { return <div className="toolbar"><label className="search-field"><Search size={18}/><input value={value} onChange={(e)=>setValue(e.target.value)} placeholder={placeholder}/></label><label className="select-field"><select value={filter} onChange={(e)=>setFilter(e.target.value)}>{options.map((x)=><option key={x}>{x}</option>)}</select><ChevronDown size={16}/></label><button className="refresh-button" onClick={()=>{setValue("");setFilter(options[0]);onRefresh?.()}}><RefreshCw size={17}/> 새로고침</button></div> }
function EmptyRow({ colSpan }: { colSpan:number }) { return <tr><td colSpan={colSpan} className="empty-cell">조회된 실제 데이터가 없습니다.</td></tr> }
function DataError({ message }: { message:string }) { return message?<div className="audit-info"><CircleHelp size={19}/><p><strong>API 연동 확인 필요</strong>{message}</p></div>:null }

function ReservationsPage({reservations,error,reload}:{reservations:Reservation[];error:string;reload:()=>void}) {
  const [search,setSearch]=useState(""),[filter,setFilter]=useState("전체 상태"),[selected,setSelected]=useState<Reservation|null>(null);
  const options=["전체 상태",...Array.from(new Set(reservations.map((x)=>x.status)))];
  const filtered=reservations.filter((x)=>(filter==="전체 상태"||x.status===filter)&&Object.values(x).some((v)=>v.toLowerCase().includes(search.toLowerCase())));
  return <section className="panel page-panel"><SectionTitle title="예약 목록" subtitle={`예약 서비스 조회 결과 ${reservations.length}건`}/><DataError message={error}/><Toolbar value={search} setValue={setSearch} placeholder="예약번호, 회원 ID, 항공편 검색" filter={filter} setFilter={setFilter} options={options} onRefresh={reload}/><div className="table-wrap"><table><thead><tr><th>예약번호</th><th>회원 ID</th><th>항공편 ID</th><th>편명</th><th>구간</th><th>예약 일시</th><th>좌석</th><th>수하물</th><th>상태</th><th/></tr></thead><tbody>{filtered.length?filtered.map((x)=><tr key={x.code}><td className="strong-cell">{x.code}</td><td>{x.passenger}</td><td>{x.flightId}</td><td>{x.flight}</td><td>{x.route}</td><td>{x.departure}</td><td>{x.seat}</td><td>{x.baggage}</td><td><StatusPill value={x.status}/></td><td><button className="table-button" onClick={()=>setSelected(x)}>상세</button></td></tr>):<EmptyRow colSpan={10}/>}</tbody></table></div>{selected&&<div className="detail-strip"><div><span>선택한 예약</span><strong>{selected.code}</strong></div><div><span>회원 ID</span><strong>{selected.passenger}</strong></div><div><span>여정</span><strong>{selected.route}</strong></div><div><span>좌석 / 수하물</span><strong>{selected.seat} / {selected.baggage}</strong></div><StatusPill value={selected.status}/></div>}</section>;
}

function InquiriesPage({ inquiries,error,reload,notify }: { inquiries:Inquiry[];error:string;reload:()=>Promise<void>;notify:(m:string)=>void }) {
  const [search,setSearch]=useState(""),[filter,setFilter]=useState("전체 상태"),[selectedId,setSelectedId]=useState<string|null>(null),[draft,setDraft]=useState(""),[saving,setSaving]=useState(false);
  const selected=inquiries.find((x)=>x.id===selectedId)||inquiries[0];
  const options=["전체 상태",...Array.from(new Set(inquiries.map((x)=>x.status)))];
  const filtered=inquiries.filter((x)=>(filter==="전체 상태"||x.status===filter)&&`${x.id}${x.customer}${x.title}`.toLowerCase().includes(search.toLowerCase()));
  async function answer(){if(!selected||!draft.trim())return;setSaving(true);try{await saveInquiryAnswer(selected.id,draft.trim());notify("고객문의 답변이 실제 예약 서비스에 저장되었습니다.");setDraft("");await reload()}catch(error){notify(errorMessage(error))}finally{setSaving(false)}}
  return <div className="split-panel"><section className="panel page-panel"><SectionTitle title="문의 목록" subtitle={`Q&A 서비스 조회 결과 ${inquiries.length}건`}/><DataError message={error}/><Toolbar value={search} setValue={setSearch} placeholder="문의번호, 고객명, 제목 검색" filter={filter} setFilter={setFilter} options={options} onRefresh={()=>void reload()}/><div className="inquiry-list">{filtered.map((x)=><button key={x.id} onClick={()=>{setSelectedId(x.id);setDraft(x.answer||"")}} className={selected?.id===x.id?"active":""}><div><span>{x.category}</span><StatusPill value={x.status}/></div><strong>{x.title}</strong><p>{x.customer} · {x.id}</p><time>{x.createdAt}</time></button>)}{!filtered.length&&<p className="empty-cell">조회된 실제 문의가 없습니다.</p>}</div></section><aside className="panel detail-panel">{selected?<><div className="detail-panel__header"><span>{selected.category}</span><StatusPill value={selected.status}/></div><h2>{selected.title}</h2><div className="detail-meta"><span>문의번호 <b>{selected.id}</b></span><span>고객명 <b>{selected.customer}</b></span><span>접수일 <b>{selected.createdAt}</b></span></div><div className="message-box"><span>고객 문의</span><p>{selected.content}</p></div>{selected.answer&&<div className="message-box message-box--answer"><span>현재 관리자 답변</span><p>{selected.answer}</p></div>}<label className="answer-field"><span>{selected.answer?"답변 수정":"답변 작성"}</span><textarea value={draft} onChange={(e)=>setDraft(e.target.value)} placeholder="고객에게 전달할 실제 답변을 입력하세요." rows={6}/></label><div className="detail-actions"><button className="primary-button" onClick={()=>void answer()} disabled={!draft.trim()||saving}><Check size={17}/>{saving?"저장 중...":"답변 저장"}</button></div></>:<p className="empty-cell">왼쪽에서 문의를 선택하세요.</p>}</aside></div>;
}

function CrewPage({crew,error,reload}:{crew:CrewMember[];error:string;reload:()=>void}){const[search,setSearch]=useState(""),[filter,setFilter]=useState("전체 상태");const options=["전체 상태",...Array.from(new Set(crew.map((x)=>x.duty)))];const filtered=crew.filter((x)=>(filter==="전체 상태"||x.duty===filter)&&`${x.employeeNo}${x.name}${x.flight}${x.role}`.toLowerCase().includes(search.toLowerCase()));const passportPending=crew.filter((x)=>/PENDING|WAITING|대기|미확인/i.test(x.passportStatus)).length;const operationPending=crew.filter((x)=>[x.baggageStatus,x.ticketStatus].some((value)=>/PENDING|WAITING|대기|미완료|미발권/i.test(value))).length;return <><div className="mini-kpis"><div><UsersRound size={19}/><span>조회 직원<strong>{crew.length}명</strong></span></div><div><ShieldCheck size={19}/><span>여권 확인 대기<strong>{passportPending}건</strong></span></div><div><Clock3 size={19}/><span>수하물·발권 대기<strong>{operationPending}건</strong></span></div></div><section className="panel page-panel"><SectionTitle title="직원 및 업무 처리 현황" subtitle="관리자는 현황만 조회하며 여권·수하물·발권 입력은 직원 페이지에서 처리합니다."/><DataError message={error}/><Toolbar value={search} setValue={setSearch} placeholder="직원번호, 이름, 항공편 검색" filter={filter} setFilter={setFilter} options={options} onRefresh={reload}/><div className="table-wrap"><table><thead><tr><th>직원번호</th><th>이름</th><th>직책</th><th>배정 항공편</th><th>근무 상태</th><th>여권 확인</th><th>수하물 처리</th><th>발권 처리</th></tr></thead><tbody>{filtered.length?filtered.map((x)=><tr key={x.employeeNo}><td className="strong-cell">{x.employeeNo}</td><td>{x.name}</td><td>{x.role}</td><td>{x.flight}</td><td><StatusPill value={x.duty}/></td><td><StatusPill value={x.passportStatus}/></td><td><StatusPill value={x.baggageStatus}/></td><td><StatusPill value={x.ticketStatus}/></td></tr>):<EmptyRow colSpan={8}/>}</tbody></table></div></section></>}

function PartnersPage({partners,error,reload,notify}:{partners:PartnerRequest[];error:string;reload:()=>Promise<void>;notify:(m:string)=>void}){const[search,setSearch]=useState(""),[filter,setFilter]=useState("전체 상태"),[selected,setSelected]=useState<PartnerRequest|null>(null),[reason,setReason]=useState(""),[saving,setSaving]=useState(false);const options=["전체 상태",...Array.from(new Set(partners.map((x)=>x.status)))];const filtered=partners.filter((x)=>(filter==="전체 상태"||x.status===filter)&&`${x.id}${x.company}${x.type}`.toLowerCase().includes(search.toLowerCase()));async function changeStatus(status:"APPROVED"|"REJECTED"){if(!selected)return;if(status==="REJECTED"&&!reason.trim()){notify("반려 사유를 입력해주세요.");return}setSaving(true);try{await savePartnerStatus(selected.id,status,reason.trim());notify(`협력사 요청이 ${status==="APPROVED"?"승인":"반려"} 처리되었습니다.`);setSelected(null);setReason("");await reload()}catch(error){notify(errorMessage(error))}finally{setSaving(false)}}return <><section className="panel page-panel"><SectionTitle title="협력사 요청 목록" subtitle={`협력사 서비스 조회 결과 ${partners.length}건`}/><DataError message={error}/><Toolbar value={search} setValue={setSearch} placeholder="요청번호, 협력사명, 요청 내용 검색" filter={filter} setFilter={setFilter} options={options} onRefresh={()=>void reload()}/><div className="table-wrap"><table><thead><tr><th>요청번호</th><th>협력사</th><th>요청 내용</th><th>담당자</th><th>접수일</th><th>상태</th><th/></tr></thead><tbody>{filtered.length?filtered.map((x)=><tr key={x.id}><td className="strong-cell">{x.id}</td><td>{x.company}</td><td>{x.type}</td><td>{x.manager}</td><td>{x.createdAt}</td><td><StatusPill value={x.status}/></td><td><button className="table-button" onClick={()=>{setSelected(x);setReason(x.reason||"")}}>검토</button></td></tr>):<EmptyRow colSpan={7}/>}</tbody></table></div></section>{selected&&<div className="modal-layer" onMouseDown={(e)=>e.target===e.currentTarget&&setSelected(null)}><section className="modal"><button className="modal__close" onClick={()=>setSelected(null)}><X size={20}/></button><span className="section-kicker">PARTNER REQUEST</span><h2>협력사 요청 검토</h2><div className="modal-card"><span>요청번호</span><strong>{selected.id}</strong><span>협력사</span><strong>{selected.company}</strong><span>담당자</span><strong>{selected.manager}</strong><span>요청 내용</span><strong>{selected.type}</strong></div><label className="answer-field"><span>승인·반려 사유</span><textarea value={reason} onChange={(e)=>setReason(e.target.value)} rows={4} placeholder="실제 처리 사유를 입력하세요. 반려 시 필수입니다."/></label><div className="modal__actions"><button className="danger-button" disabled={saving} onClick={()=>void changeStatus("REJECTED")}><X size={17}/> 반려</button><button className="primary-button" disabled={saving} onClick={()=>void changeStatus("APPROVED")}><Check size={17}/> 승인</button></div></section></div>}</>}

function AuditPage({audit,error,reload}:{audit:AuditItem[];error:string;reload:()=>void}){const[search,setSearch]=useState(""),[filter,setFilter]=useState("전체 결과");const filtered=audit.filter((x)=>(filter==="전체 결과"||x.result===filter)&&`${x.adminLoginId}${x.action}${x.target}${x.ip}`.toLowerCase().includes(search.toLowerCase()));return <section className="panel page-panel"><SectionTitle title="작업 이력" subtitle="admin_db에 서버가 기록한 실제 감사 로그입니다."/><DataError message={error}/><Toolbar value={search} setValue={setSearch} placeholder="관리자, 작업 내용, 대상, IP 검색" filter={filter} setFilter={setFilter} options={["전체 결과","SUCCESS","FAILURE"]} onRefresh={reload}/><div className="audit-info"><ShieldCheck size={19}/><p><strong>감사 로그 안내</strong>작업 이력은 보안 정책에 따라 기록되며 임의로 수정하거나 삭제할 수 없습니다.</p></div><div className="table-wrap"><table><thead><tr><th>일시</th><th>관리자</th><th>작업 종류</th><th>작업 대상</th><th>상세</th><th>접속 IP</th><th>결과</th></tr></thead><tbody>{filtered.length?filtered.map((x)=><tr key={x.id}><td>{x.time}</td><td>{x.adminLoginId}</td><td>{x.action}</td><td className="strong-cell">{x.target}</td><td>{x.detail}</td><td className="mono-cell">{x.ip}</td><td><StatusPill value={x.result}/></td></tr>):<EmptyRow colSpan={7}/>}</tbody></table></div></section>}

export default function App() {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [page, setPage] = useState<PageId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [partners, setPartners] = useState<PartnerRequest[]>([]);
  const [audit, setAudit] = useState<AuditItem[]>([]);
  const [errors, setErrors] = useState<Record<string,string>>({});
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

  async function loadReservations() {
    try { setReservations(await fetchReservations()); setErrors((current)=>({...current,reservations:""})); }
    catch(error){ setReservations([]); setErrors((current)=>({...current,reservations:errorMessage(error)})); }
  }

  async function loadInquiries() {
    try { setInquiries(await fetchInquiries()); setErrors((current)=>({...current,inquiries:""})); }
    catch(error){ setInquiries([]); setErrors((current)=>({...current,inquiries:errorMessage(error)})); }
  }

  async function loadCrew() {
    try { setCrew(await fetchCrew()); setErrors((current)=>({...current,crew:""})); }
    catch(error){ setCrew([]); setErrors((current)=>({...current,crew:errorMessage(error)})); }
  }

  async function loadPartners() {
    try { setPartners(await fetchPartnerRequests()); setErrors((current)=>({...current,partners:""})); }
    catch(error){ setPartners([]); setErrors((current)=>({...current,partners:errorMessage(error)})); }
  }

  async function loadAudit() {
    try { setAudit(await fetchAuditLogs()); setErrors((current)=>({...current,audit:""})); }
    catch(error){ setAudit([]); setErrors((current)=>({...current,audit:errorMessage(error)})); }
  }

  useEffect(() => {
    if (!admin) return;
    void Promise.all([loadReservations(),loadInquiries(),loadCrew(),loadPartners(),loadAudit()]);
  }, [admin?.id]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
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
        admin={admin}
      />

      <div className="admin-main">
        <Topbar onMenu={() => setSidebarOpen(true)} admin={admin} />

        <main className="content" aria-label={title}>
          <PageHeading page={page} />

          {page === "dashboard" && (
            <Dashboard
              onNavigate={setPage}
              reservations={reservations}
              inquiries={inquiries}
              crew={crew}
              partners={partners}
              errors={errors}
            />
          )}

          {page === "reservations" && <ReservationsPage reservations={reservations} error={errors.reservations||""} reload={()=>void loadReservations()} />}

          {page === "inquiries" && (
            <InquiriesPage
              inquiries={inquiries}
              error={errors.inquiries||""}
              reload={loadInquiries}
              notify={notify}
            />
          )}

          {page === "crew" && <CrewPage crew={crew} error={errors.crew||""} reload={()=>void loadCrew()} />}

          {page === "partners" && (
            <PartnersPage
              partners={partners}
              error={errors.partners||""}
              reload={loadPartners}
              notify={notify}
            />
          )}

          {page === "audit" && <AuditPage audit={audit} error={errors.audit||""} reload={()=>void loadAudit()} />}
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
