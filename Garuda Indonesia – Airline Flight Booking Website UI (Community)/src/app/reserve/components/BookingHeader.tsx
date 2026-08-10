import { CircleUserRound } from "lucide-react";
import { Link } from "react-router";
export default function BookingHeader() {
  return <header className="booking-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="YOUNGKEKE AIR 메인 페이지">
          <span className="brand-mark"><span /><span /><span /></span>
          <span><strong>YOUNGKEKE AIR</strong><small>Fly Beyond Your Dreams</small></span>
        </Link>
        <nav aria-label="주요 메뉴">
          <Link className="active" to="/booking">항공권 예약</Link>
          <a href="#">예약 조회</a>
          <Link to="/inquiry">고객지원</Link>
        </nav>
        <div className="booking-user">
          <span><CircleUserRound size={17} /></span>
          <div><strong>YOUNGKEKE 회원</strong><small>YOUNGKEKE Miles</small></div>
        </div>
      </div>
    </header>;
}
export function BookingProgress({
  step = 1
}) {
  return <div className="page-stepper">{["항공편 선택", "예약 및 결제", "예약 완료"].map((name, index) => <span className={step >= index + 1 ? "active" : ""} key={name}><b>{index + 1}</b>{name}</span>)}</div>;
}
