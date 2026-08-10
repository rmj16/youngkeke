import { Check, Plane } from "lucide-react";
export default function FlightCard({
  flight,
  selected,
  onSelect
}) {
  return <button className={`k-flight-card ${selected ? "selected" : ""}`} onClick={onSelect}><div className="flight-code"><span>{flight.code}</span><small>{flight.aircraft}</small></div><div className="flight-time"><strong>{flight.departure}</strong><small>{flight.from}</small></div><div className="flight-duration"><span>{flight.duration}</span><div><Plane size={16} /><i /></div><small>직항</small></div><div className="flight-time right"><strong>{flight.arrival}</strong><small>{flight.to}</small></div><div className="fare"><small>일반석 스탠다드</small><strong>₩ {flight.price}</strong><span>잔여 {flight.left}석</span></div><span className="select-indicator">{selected ? <Check size={16} /> : "선택"}</span></button>;
}
