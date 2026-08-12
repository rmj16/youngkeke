import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleUserRound, Info, Luggage, Plane, UserRound, X } from "lucide-react";
import PaymentPopup from "./PaymentPopup";

const stepNames = ["탑승자 정보", "예약자 연락처", "좌석 선택", "부가 서비스", "발권 옵션"];
const blockedSeats = new Set(["2B", "3E", "5A", "5F", "7C", "8D", "10B", "11E"]);

function Field({ label, placeholder, type = "text" }) {
  return <label className="booking-field"><span>{label}</span><input type={type} placeholder={placeholder} /></label>;
}

function Step({ number, active, complete, title, summary, onOpen, children }) {
  return <motion.section layout className={`step-card ${active ? "is-active" : ""} ${complete ? "is-complete" : ""}`}>
    <button className="step-heading" onClick={onOpen}><span className="step-number">{complete ? <Check size={17} /> : String(number).padStart(2, "0")}</span><span className="step-title-wrap"><strong>{title}</strong><small>{complete ? summary : active ? "필수 정보를 입력해 주세요" : "이전 단계를 완료하면 입력할 수 있어요"}</small></span><ChevronDown className={active ? "rotate" : ""} /></button>
    <AnimatePresence initial={false}>{active && <motion.div className="step-content-wrap" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><div className="step-content">{children}</div></motion.div>}</AnimatePresence>
  </motion.section>;
}

export default function Reservation({ itinerary, onBack, onComplete }) {
  const [active, setActive] = useState(0);
  const [available, setAvailable] = useState(0);
  const [seatOpen, setSeatOpen] = useState(false);
  const [seat, setSeat] = useState("4A");
  const [draftSeat, setDraftSeat] = useState("4A");
  const [baggage, setBaggage] = useState("20");
  const [cargo, setCargo] = useState("none");
  const [paymentOpen, setPaymentOpen] = useState(false);

  const next = (current) => { const target = Math.min(current + 1, 4); setAvailable(Math.max(available, target)); setActive(target); };
  const total = baggage === "20" ? "899,400" : baggage === "10" ? "868,400" : "826,400";
  const completePayment = (method) => {
    const labels = { easy: "간편 결제", bank: "계좌이체", card: "신용카드" };
    setPaymentOpen(false);
    onComplete({ name: "KIM GARUDA", email: "garuda@example.com", phone: "+82 10-1234-5678", passport: "M12345678", seat, baggage, total, methodLabel: labels[method] });
  };

  return <div className="booking-page">
    <header className="booking-header"><div className="header-inner"><div className="brand"><span className="brand-mark"><span /><span /><span /></span><span><strong>YOUNKEKE AIR</strong><small>Fly Beyond Your Dreams</small></span></div><nav><a href="#">예약</a><a href="#">여행 준비</a><a href="#">서비스</a><a href="#">YOUNKEKE CLUB</a></nav><button className="member-button"><CircleUserRound size={19} /> 로그인</button></div></header>
    <div className="booking-hero"><div className="hero-shape" /><div className="hero-inner"><button className="back-button" onClick={onBack}><ArrowLeft size={18} /> 항공편 선택으로</button><p>FLIGHT BOOKING</p><h1>여행자 정보를 입력해 주세요</h1><span>{itinerary?.tripType === "round" ? "왕복" : "편도"} 여정 · 입력한 정보는 안전하게 보호됩니다.</span></div></div>
    <main className="booking-main">
      <section className="journey-card"><div className="route-date"><small>출국편 · 2026. 08. 28 (금)</small><strong>인천 <span>ICN</span></strong></div><div className="flight-line"><span>09:35</span><div><Plane size={18} /><i /></div><span>15:05</span><small>7시간 30분 · 직항</small></div><div className="route-date align-right"><small>GA879 · Economy</small><strong><span>DPS</span> 발리</strong></div><div className="price-summary"><small>총 결제 예정 금액</small><strong>₩ {total}</strong><span>성인 1명 · 세금 포함</span></div></section>
      <div className="progress-row">{stepNames.map((name, index) => <div key={name} className={index <= available ? "on" : ""}><span>{index < available ? <Check size={13} /> : index + 1}</span><small>{name}</small></div>)}</div>
      <div className="booking-layout"><div className="steps-column">
        <Step number={1} active={active === 0} complete={available > 0} title="탑승자 정보" summary="KIM GARUDA · 성인 1명" onOpen={() => setActive(0)}><div className="notice"><Info size={18} />여권에 기재된 영문 이름과 정확히 일치해야 합니다.</div><div className="form-grid passenger-grid"><label className="booking-field"><span>성별</span><select><option>남성</option><option>여성</option></select></label><Field label="성 (영문)" placeholder="KIM" /><Field label="이름 (영문)" placeholder="GARUDA" /><Field label="회원번호 (선택)" placeholder="회원번호 9자리" /></div><button className="primary-action" onClick={() => next(0)}>다음 <ArrowRight size={18} /></button></Step>
        <Step number={2} active={active === 1} complete={available > 1} title="예약자 연락처" summary="garuda@example.com · +82 10-1234-5678" onOpen={() => available >= 1 && setActive(1)}><div className="form-grid"><Field label="이메일" placeholder="garuda@example.com" type="email" /><Field label="전화번호" placeholder="010-1234-5678" /><Field label="여권번호" placeholder="M12345678" /><label className="booking-field"><span>발행 국가</span><select><option>대한민국</option><option>인도네시아</option></select></label></div><button className="primary-action" onClick={() => next(1)}>다음 <ArrowRight size={18} /></button></Step>
        <Step number={3} active={active === 2} complete={available > 2} title="좌석 선택" summary={`${seat} · 창가 좌석`} onOpen={() => available >= 2 && setActive(2)}><div className="seat-preview"><div className="seat-icon"><UserRound /></div><div><strong>KIM GARUDA</strong><span>{seat} · 일반석 · 창가</span></div><button onClick={() => { setDraftSeat(seat); setSeatOpen(true); }}>좌석 변경</button></div><button className="primary-action" onClick={() => next(2)}>다음 <ArrowRight size={18} /></button></Step>
        <Step number={4} active={active === 3} complete={available > 3} title="수하물 사전 구매" summary={baggage === "none" ? "추가 없음" : `추가 수하물 ${baggage}kg`} onOpen={() => available >= 3 && setActive(3)}><div className="option-grid baggage-options">{[{ v: "none", t: "추가 안 함", p: "₩ 0" }, { v: "10", t: "+ 10kg", p: "₩ 42,000" }, { v: "20", t: "+ 20kg", p: "₩ 73,000" }].map((item) => <button key={item.v} className={baggage === item.v ? "selected" : ""} onClick={() => setBaggage(item.v)}><Luggage /><strong>{item.t}</strong><span>{item.p}</span></button>)}</div><button className="primary-action" onClick={() => next(3)}>다음 <ArrowRight size={18} /></button></Step>
        <Step number={5} active={active === 4} complete={false} title="발권 및 화물 예약" summary="발권 옵션" onOpen={() => available >= 4 && setActive(4)}><div className="ticket-options"><button className={cargo === "none" ? "selected" : ""} onClick={() => setCargo("none")}><span className="radio-dot" /><div><strong>일반 여객 발권</strong><small>선택한 항공편을 바로 발권합니다.</small></div></button><button className={cargo === "cargo" ? "selected" : ""} onClick={() => setCargo("cargo")}><span className="radio-dot" /><div><strong>항공 화물 예약 상담</strong><small>담당자가 별도로 연락드립니다.</small></div></button></div><button className="pay-action" onClick={() => setPaymentOpen(true)}>결제 방식 선택 <ArrowRight size={18} /></button></Step>
      </div><aside className="booking-aside"><div className="aside-card"><Info /><div><strong>안심하고 예약하세요</strong><p>모든 개인정보와 결제 정보는 암호화되어 안전하게 보호됩니다.</p></div></div></aside></div>
    </main>
    <AnimatePresence>{seatOpen && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSeatOpen(false)}><motion.div className="seat-modal" onMouseDown={(e) => e.stopPropagation()} initial={{ scale: .97 }} animate={{ scale: 1 }}><div className="modal-header"><div><small>GA879 · ICN → DPS</small><h2>좌석을 선택해 주세요</h2></div><button onClick={() => setSeatOpen(false)}><X /></button></div><div className="modal-body"><div className="plane-shell"><div className="cockpit"><Plane /><span>FRONT</span></div><div className="seat-labels"><span>A</span><span>B</span><span>C</span><i /><span>D</span><span>E</span><span>F</span></div>{Array.from({ length: 12 }, (_, row) => row + 1).map((row) => <div className="seat-row" key={row}><small>{row}</small>{["A", "B", "C", "D", "E", "F"].map((letter) => { const id = `${row}${letter}`; return <button key={id} disabled={blockedSeats.has(id)} className={draftSeat === id ? "chosen" : blockedSeats.has(id) ? "unavailable" : ""} onClick={() => setDraftSeat(id)}><span>{id}</span></button>; })}</div>)}</div></div><div className="modal-footer"><div><small>선택한 좌석</small><strong>{draftSeat}</strong></div><button onClick={() => { setSeat(draftSeat); setSeatOpen(false); }}>좌석 선택 완료</button></div></motion.div></motion.div>}</AnimatePresence>
    <PaymentPopup open={paymentOpen} total={total} onClose={() => setPaymentOpen(false)} onComplete={completePayment} />
  </div>;
}
