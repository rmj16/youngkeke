export function BookingProgress({ step = 1 }) {
  return (
    <div className="page-stepper">
      {["항공편 선택", "예약 및 결제", "예약 완료"].map((name, index) => (
        <span className={step >= index + 1 ? "active" : ""} key={name}>
          <b>{index + 1}</b>{name}
        </span>
      ))}
    </div>
  );
}
