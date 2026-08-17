import { Fragment, useMemo, useState, type FormEvent } from "react";
import { BrandMark } from "@inq/shared/components/BrandMark";
import { faqCategories, faqs } from "@inq/shared/data/faqs";
import type { InquiryInput, Member } from "@inq/shared/api/qnaApi";
import type { Inquiry } from "@inq/shared/types/inquiry";

type SupportPanel = "board" | "faq";
type BoardFilter = "전체" | "진행중" | "진행완료";
type FormMode = "create" | "edit" | "reask";

type InquiryForm = {
  category: string;
  title: string;
  booking: string;
  content: string;
};

const EMPTY_FORM: InquiryForm = {
  category: "예약/결제",
  title: "",
  booking: "",
  content: "",
};

export function CustomerInquiryPage({
  inquiries,
  member,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  navigate,
}: {
  inquiries: Inquiry[];
  member: Member;
  createInquiry: (input: InquiryInput) => Promise<void>;
  updateInquiry: (id: string, input: InquiryInput) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  navigate: (path: string) => void;
}) {
  const [panel, setPanel] = useState<SupportPanel>("board");
  const [boardFilter, setBoardFilter] = useState<BoardFilter>("전체");
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<InquiryForm>(EMPTY_FORM);
  const [faqQuery, setFaqQuery] = useState("");
  const [faqCategory, setFaqCategory] = useState("전체");
  const [openedFaq, setOpenedFaq] = useState<number | null>(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");

  const myInquiries = inquiries;

  const visibleInquiries = useMemo(
    () =>
      myInquiries.filter((item) => {
        if (boardFilter === "진행중") return item.status !== "답변 완료";
        if (boardFilter === "진행완료") return item.status === "답변 완료";
        return true;
      }),
    [boardFilter, myInquiries],
  );

  const visibleFaqs = useMemo(() => {
    const query = faqQuery.trim().toLowerCase();
    return faqs.filter((faq) => {
      const categoryMatches = faqCategory === "전체" || faq.category === faqCategory;
      const queryMatches = !query || `${faq.question} ${faq.answer}`.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
  }, [faqCategory, faqQuery]);

  const updateForm = (key: keyof InquiryForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setFormOpen(true);
  };

  const openEditForm = (item: Inquiry) => {
    setFormMode("edit");
    setEditingId(item.id);
    setForm({
      category: item.category,
      title: item.title,
      booking: item.booking === "-" ? "" : item.booking,
      content: item.content,
    });
    setFormError("");
    setFormOpen(true);
  };

  const openReaskForm = (item: Inquiry) => {
    setFormMode("reask");
    setEditingId(null);
    setForm({
      category: item.category,
      title: `[재문의] ${item.title}`,
      booking: item.booking === "-" ? "" : item.booking,
      content: `기존 문의(${item.id})에 대해 추가로 문의드립니다.\n\n`,
    });
    setFormError("");
    setFormOpen(true);
  };

  const submitInquiry = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");

    const input: InquiryInput = {
      category: form.category,
      reservationId: form.booking.trim() || undefined,
      title: form.title.trim(),
      question: form.content.trim(),
    };

    try {
      if (formMode === "edit" && editingId) {
        await updateInquiry(editingId, input);
      } else {
        await createInquiry(input);
      }
      setFormOpen(false);
      setExpandedInquiry(null);
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : "문의 저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeInquiry = async (item: Inquiry) => {
    if (!window.confirm(`“${item.title}” 문의를 삭제하시겠습니까?`)) return;
    setActionError("");
    try {
      await deleteInquiry(item.id);
      setExpandedInquiry(null);
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "문의 삭제에 실패했습니다.");
    }
  };

  const progressCount = myInquiries.filter((item) => item.status !== "답변 완료").length;
  const completedCount = myInquiries.filter((item) => item.status === "답변 완료").length;

  return (
    <div className="support-center-page">
      <header className="support-topbar">
        <button className="support-logo" onClick={() => navigate("/")} aria-label="메인 페이지로 이동">
          <BrandMark />
        </button>
        <nav aria-label="사용자 메뉴">
          <button onClick={() => navigate("/")}>항공권 예약</button>
          <button onClick={() => navigate("/")}>예약 조회</button>
          <button className="active">고객지원</button>
        </nav>
        <div className="support-user">
          <span>{member.name.slice(0, 1)}</span>
          <div><strong>{member.name}</strong><small>{member.email}</small></div>
        </div>
      </header>

      <section className="support-title-band">
        <div>
          <span>HOME / 고객지원</span>
          <h1>고객지원</h1>
          <p>자주 묻는 질문을 확인하거나 나의 1:1 문의를 관리할 수 있습니다.</p>
        </div>
      </section>

      <div className="support-workspace">
        <aside className="support-side-menu">
          <div className="side-title"><small>SUPPORT</small><strong>고객지원 메뉴</strong></div>
          <button className={panel === "faq" ? "active" : ""} onClick={() => setPanel("faq")}>
            <span className="side-icon">?</span><div><strong>자주 묻는 질문</strong><small>FAQ 검색 및 안내</small></div><b>›</b>
          </button>
          <button className={panel === "board" ? "active" : ""} onClick={() => setPanel("board")}>
            <span className="side-icon">1:1</span><div><strong>1:1 문의 게시판</strong><small>나의 문의 내역</small></div><b>›</b>
          </button>
          <div className="side-status">
            <span>나의 문의 현황</span>
            <div><small>진행중</small><strong>{progressCount}</strong></div>
            <div><small>진행완료</small><strong>{completedCount}</strong></div>
          </div>
          <div className="support-contact-card">
            <small>Customer Care</small><strong>+62 21 2351 9999</strong><span>매일 24시간 운영</span>
          </div>
        </aside>

        <section className="support-panel">
          {panel === "faq" ? (
            <FaqPanel
              query={faqQuery}
              setQuery={setFaqQuery}
              category={faqCategory}
              setCategory={setFaqCategory}
              opened={openedFaq}
              setOpened={setOpenedFaq}
              items={visibleFaqs}
            />
          ) : (
            <div className="board-panel">
              <div className="support-panel-heading">
                <div><span>MY INQUIRIES</span><h2>1:1 문의 게시판</h2><p>로그인한 계정으로 작성한 문의만 확인할 수 있습니다.</p></div>
                <button className="write-inquiry-button" onClick={openCreateForm}>문의 작성</button>
              </div>

              <div className="board-summary">
                <div><span>전체 문의</span><strong>{myInquiries.length}</strong></div>
                <div><span>진행중</span><strong>{progressCount}</strong></div>
                <div><span>진행완료</span><strong>{completedCount}</strong></div>
              </div>

              <div className="board-filter" role="tablist" aria-label="문의 상태 필터">
                {(["전체", "진행중", "진행완료"] as BoardFilter[]).map((filter) => (
                  <button key={filter} className={boardFilter === filter ? "active" : ""} onClick={() => setBoardFilter(filter)}>{filter}</button>
                ))}
              </div>

              <div className="customer-board-wrap">
                {actionError && <div className="customer-form-error">{actionError}</div>}
                <table className="customer-board">
                  <thead><tr><th>No.</th><th>제목</th><th>문의 유형</th><th>등록일</th><th>처리상태</th><th>관리</th></tr></thead>
                  <tbody>
                    {visibleInquiries.map((item, index) => {
                      const completed = item.status === "답변 완료";
                      const displayStatus = item.userClosed ? "완료 확인" : completed ? "진행완료" : "진행중";
                      return (
                        <Fragment key={item.id}>
                          <tr className="board-row">
                            <td className="board-number">{visibleInquiries.length - index}</td>
                            <td className="board-title-cell"><button onClick={() => setExpandedInquiry(expandedInquiry === item.id ? null : item.id)}><strong>{item.title}</strong><small>{item.id}</small></button></td>
                            <td>{item.category}</td>
                            <td>{item.createdAt.split(" ").slice(0, 2).join(" ")}</td>
                            <td><span className={`customer-progress ${completed ? "done" : "working"}`}>{displayStatus}</span></td>
                            <td>
                              <div className="row-actions">
                                {!completed ? (
                                  <><button onClick={() => openEditForm(item)}>수정</button><button className="danger" onClick={() => void removeInquiry(item)}>삭제</button></>
                                ) : (
                                  <><button onClick={() => openReaskForm(item)}>재문의</button><button className="complete" disabled>답변 완료</button></>
                                )}
                              </div>
                            </td>
                          </tr>
                          {expandedInquiry === item.id && (
                            <tr className="board-detail-row"><td colSpan={6}><div><span>문의 내용</span><p>{item.content}</p>{completed && <section><strong>고객센터 답변</strong><p>{item.answer || "답변 내용이 등록되지 않았습니다."}</p>{item.answeredAt && <small>{item.answeredAt}</small>}</section>}</div></td></tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
                {visibleInquiries.length === 0 && <div className="board-empty">해당 상태의 문의가 없습니다.</div>}
              </div>
              <div className="board-note"><span>ⓘ</span> 답변이 등록된 문의는 수정하거나 삭제할 수 없습니다. 추가 질문은 재문의를 이용해 주세요.</div>
            </div>
          )}
        </section>
      </div>

      <footer className="support-simple-footer"><BrandMark inverse /><span>© 2026 Youngkeke Air. All rights reserved.</span><nav><a href="#">이용약관</a><a href="#">개인정보처리방침</a></nav></footer>

      {formOpen && (
        <div className="customer-modal-backdrop" onMouseDown={() => setFormOpen(false)}>
          <section className="customer-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-form-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="customer-modal-head"><div><span>1:1 INQUIRY</span><h2 id="inquiry-form-title">{formMode === "edit" ? "문의 수정" : formMode === "reask" ? "재문의 작성" : "새 문의 작성"}</h2></div><button onClick={() => setFormOpen(false)} aria-label="닫기">×</button></div>
            <form onSubmit={submitInquiry}>
              <div className="modal-account"><span>문의 계정</span><strong>{member.name}</strong><small>{member.email}</small></div>
              <label>문의 유형<select value={form.category} onChange={(event) => updateForm("category", event.target.value)}><option>예약/결제</option><option>변경/환불</option><option>수하물</option><option>공항/탑승</option><option>회원/마일리지</option><option>기타</option></select></label>
              <label>제목<input value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="문의 제목을 입력해 주세요" required /></label>
              <label>예약번호 <span>(선택)</span><input value={form.booking} onChange={(event) => updateForm("booking", event.target.value.toUpperCase())} placeholder="예: X7K2P9" maxLength={6} /></label>
              <label>문의 내용<textarea value={form.content} onChange={(event) => updateForm("content", event.target.value)} placeholder="문의 내용을 자세히 입력해 주세요" maxLength={1000} required /><small className="modal-counter">{form.content.length} / 1,000</small></label>
              {formError && <p className="customer-form-error">{formError}</p>}
              <div className="modal-buttons"><button type="button" onClick={() => setFormOpen(false)} disabled={submitting}>취소</button><button type="submit" disabled={submitting}>{submitting ? "처리 중..." : formMode === "edit" ? "수정 저장" : "문의 등록"}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function FaqPanel({
  query,
  setQuery,
  category,
  setCategory,
  opened,
  setOpened,
  items,
}: {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  opened: number | null;
  setOpened: (value: number | null) => void;
  items: typeof faqs;
}) {
  return (
    <div className="faq-panel">
      <div className="support-panel-heading"><div><span>FREQUENTLY ASKED QUESTIONS</span><h2>자주 묻는 질문</h2><p>항공권 예약부터 탑승까지 필요한 정보를 빠르게 찾아보세요.</p></div></div>
      <label className="faq-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="궁금한 내용을 검색해 주세요. 예: 수하물, 환불, 체크인" /><button type="button" onClick={() => setQuery("")} aria-label="검색어 지우기">{query ? "×" : "검색"}</button></label>
      <div className="faq-categories">{faqCategories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="faq-results-head"><strong>FAQ</strong><span>총 {items.length}개</span></div>
      <div className="faq-list">
        {items.map((faq) => (
          <article key={faq.id} className={opened === faq.id ? "open" : ""}>
            <button onClick={() => setOpened(opened === faq.id ? null : faq.id)}><span>Q</span><small>{faq.category}</small><strong>{faq.question}</strong><b>{opened === faq.id ? "−" : "+"}</b></button>
            {opened === faq.id && <div className="faq-answer"><span>A</span><p>{faq.answer}</p></div>}
          </article>
        ))}
        {items.length === 0 && <div className="faq-empty"><strong>검색 결과가 없습니다.</strong><span>다른 검색어를 입력하거나 1:1 문의를 이용해 주세요.</span></div>}
      </div>
    </div>
  );
}
