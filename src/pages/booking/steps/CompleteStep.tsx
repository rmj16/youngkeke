import { BadgeCheck, Check, Download, Luggage, Mail, Phone, Plane, Printer, UserRound } from "lucide-react";
export function CompleteStep({
booking,
onBack
}) {
const flights = [booking.outbound, booking.inbound].filter(Boolean);
return <div className="confirmation-page">
<main className="confirmation-main">
  <div className="confirmation-hero">
    <span className="success-icon">
      <Check size={34} />
    </span>
    <p>BOOKING COMPLETE</p>
    <h1>결제가 완료되었습니다</h1>
    <span>예약 확인서와 전자항공권을 입력하신 이메일로 보내드렸습니다.</span>
  </div>
  <section className="booking-number">
    <div>
      <small>예약번호</small>
      <strong>YK82LF</strong>
    </div>
    <div>
      <small>전자항공권 번호</small>
      <strong>280-8492 7301</strong>
    </div>
    <BadgeCheck size={36} />
  </section>
  {flights.map((flight, index) =>
  <section className="confirmation-card" key={flight.id}>
    <div className="confirmation-title">
      <div>
        <Plane size={20} />
        <span>
          <strong>{index === 0 ? "가는 편" : "오는 편"} · {flight.from} → {flight.to}</strong>
          <small>{index === 0 ? "2026. 08. 28 (금)" : "2026. 09. 03 (목)"}</small>
        </span>
      </div>
      <span>예약 확정</span>
    </div>
    <div className="confirmation-flight">
      <div>
        <strong>{flight.departure}</strong>
        <span>{index === 0 ? "ICN" : "DPS"}</span>
        <small>{flight.from}</small>
      </div>
      <div className="confirmation-route">
        <Plane size={19} />
        <i />
        <small>{flight.duration} · 직항</small>
      </div>
      <div className="right">
        <strong>{flight.arrival}</strong>
        <span>{index === 0 ? "DPS" : "ICN"}</span>
        <small>{flight.to}</small>
      </div>
    </div>
  </section>)}
  <section className="traveler-confirm-card">
    <h3>탑승객 및 연락처 정보</h3>
    <div>
      <UserRound />
      <span>
        <small>탑승객</small>
        <strong>{booking.name}</strong>
        <em>성인 · 여권 {booking.passport}</em>
      </span>
    </div>
    <div>
      <Mail />
      <span>
        <small>이메일</small>
        <strong>{booking.email}</strong>
      </span>
    </div>
    <div>
      <Phone />
      <span>
        <small>전화번호</small>
        <strong>{booking.phone}</strong>
      </span>
    </div>
    <div>
      <span className="seat-glyph">{booking.seat}</span>
      <span>
        <small>좌석 / 수하물</small>
        <strong>{booking.seat} · {booking.baggage === "none" ? "추가 없음" : `추가 ${booking.baggage}kg`}</strong>
      </span>
    </div>
  </section>
  <section className="notice-card">
    <Luggage size={20} />
    <div>
      <strong>탑승 전 확인해 주세요</strong>
      <p>출발 3시간 전까지 공항에 도착해 주세요. 체크인 시 예약 확인서와 유효한 여권이 필요하며 여권 영문명과 항공권 이름이 반드시 일치해야 합니다.</p>
    </div>
  </section>
  <div className="confirmation-total">
    <span>결제 완료 금액<small>{booking.methodLabel} · 일시불</small>
  </span>
  <strong>₩ {booking.total}</strong>
</div>
<div className="confirmation-actions">
  <button onClick={() => window.print()}>
    <Printer size={17} />예약 정보 인쇄</button>
    <button>
      <Download size={17} />e-티켓 다운로드</button>
      <button className="primary" onClick={onBack}>처음으로</button>
    </div>
  </main>
</div>;
}

