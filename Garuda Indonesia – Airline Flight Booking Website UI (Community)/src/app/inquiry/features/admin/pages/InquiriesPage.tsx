"use client";

import { useMemo, useState } from "react";
import { InquiryTable } from "@inq/features/admin/components/InquiryTable";
import type { Inquiry, InquiryStatus } from "@inq/shared/types/inquiry";

export function InquiriesPage({ inquiries, save }: { inquiries: Inquiry[]; save: (i: Inquiry[]) => void }) {
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("전체"); const [selected, setSelected] = useState<Inquiry | null>(null);
  const filtered = useMemo(() => inquiries.filter((i) => (filter === "전체" || i.status === filter) && `${i.title} ${i.customer} ${i.id}`.toLowerCase().includes(query.toLowerCase())), [inquiries, query, filter]);
  const setInquiryStatus = (id: string, status: InquiryStatus) => { const next = inquiries.map((i) => i.id === id ? { ...i, status } : i); save(next); setSelected(next.find((i) => i.id === id) || null); };
  return (
    <div className="admin-content inquiry-admin">
      <div className="page-title"><div><h1>문의 관리</h1><p>고객 문의를 확인하고 처리 상태를 관리합니다.</p></div><button className="jira-primary">CSV 내보내기</button></div>
      <section className="admin-card inquiry-list-card">
        <div className="filter-row"><div className="status-tabs">{["전체","접수","처리 중","답변 완료"].map((f)=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}<span>{f==="전체"?inquiries.length:inquiries.filter(i=>i.status===f).length}</span></button>)}</div><div className="list-tools"><label>⌕<input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="제목, 고객명, 문의번호 검색" /></label><button>☷ 필터</button></div></div>
        <InquiryTable inquiries={filtered} onSelect={setSelected} />
        <div className="table-footer"><span>총 {filtered.length}개 문의</span><div><button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div></div>
      </section>
      {selected && <div className="drawer-backdrop" onClick={()=>setSelected(null)}><aside className="detail-drawer" onClick={(e)=>e.stopPropagation()}><div className="drawer-head"><div><span>{selected.id}</span><h2>{selected.title}</h2></div><button onClick={()=>setSelected(null)} aria-label="닫기">×</button></div><div className="drawer-status"><span>처리 상태</span><div>{(["접수","처리 중","답변 완료"] as InquiryStatus[]).map(s=><button key={s} className={selected.status===s?"active":""} onClick={()=>setInquiryStatus(selected.id,s)}>{s}</button>)}</div></div><dl><div><dt>고객</dt><dd>{selected.customer}</dd></div><div><dt>이메일</dt><dd>{selected.email}</dd></div><div><dt>예약번호</dt><dd>{selected.booking}</dd></div><div><dt>문의 유형</dt><dd>{selected.category}</dd></div><div><dt>접수 일시</dt><dd>{selected.createdAt}</dd></div></dl><section className="message-box"><small>고객 문의</small><p>{selected.content}</p></section><label className="reply-label">답변 작성<textarea placeholder="고객에게 전달할 답변을 입력해 주세요." /></label><div className="drawer-actions"><button className="jira-secondary" onClick={()=>setSelected(null)}>취소</button><button className="jira-primary" onClick={()=>setInquiryStatus(selected.id,"답변 완료")}>답변 등록</button></div></aside></div>}
    </div>
  );
}
