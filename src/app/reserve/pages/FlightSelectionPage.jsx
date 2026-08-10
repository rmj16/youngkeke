import { useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react";
import BookingHeader from "../components/BookingHeader";
import FlightCard from "../components/FlightCard";

const airports = {
  ICN: { city: "서울/인천", code: "ICN" },
  GMP: { city: "서울/김포", code: "GMP" },
  PUS: { city: "부산", code: "PUS" },
  CJU: { city: "제주", code: "CJU" },
  NRT: { city: "도쿄/나리타", code: "NRT" },
  KIX: { city: "오사카", code: "KIX" },
  DPS: { city: "발리", code: "DPS" },
  BKK: { city: "방콕", code: "BKK" },
};
const baseOutbound = [
  { id:"YK879", code:"YK879", aircraft:"Boeing 787-9", departure:"09:35", arrival:"15:05", duration:"7시간 30분", price:"826,400", left:4 },
  { id:"YK629", code:"YK629", aircraft:"Airbus A330-300", departure:"17:40", arrival:"23:15", duration:"7시간 35분", price:"774,200", left:7 },
  { id:"YK633", code:"YK633", aircraft:"Boeing 777-300ER", departure:"20:05", arrival:"01:35+1", duration:"7시간 30분", price:"891,500", left:3 },
];
const baseInbound = [
  { id:"YK630", code:"YK630", aircraft:"Airbus A330-300", departure:"01:10", arrival:"09:15", duration:"7시간 05분", price:"642,100", left:6 },
  { id:"YK634", code:"YK634", aircraft:"Boeing 787-9", departure:"16:25", arrival:"00:35+1", duration:"7시간 10분", price:"715,800", left:5 },
];

export default function FlightSelectionPage({ onContinue }) {
  const [tripType,setTripType] = useState("round");
  const [form,setForm] = useState({ from:"ICN", to:"DPS", depart:"2026-08-28", returnDate:"2026-09-03" });
  const [search,setSearch] = useState(form);
  const [going,setGoing] = useState("YK879");
  const [returning,setReturning] = useState("YK630");
  const [tab,setTab] = useState("outbound");
  const [searched,setSearched] = useState(true);
  const from = airports[search.from], to = airports[search.to];
  const outbound = useMemo(() => baseOutbound.map(f => ({...f,from:`${from.city} ${from.code}`,to:`${to.city} ${to.code}`})),[search]);
  const inbound = useMemo(() => baseInbound.map(f => ({...f,from:`${to.city} ${to.code}`,to:`${from.city} ${from.code}`})),[search]);
  const selectedGoing = outbound.find(x=>x.id===going), selectedReturn = inbound.find(x=>x.id===returning);
  const dateLabels = [-2,-1,0,1,2].map(offset => { const date = new Date(`${tab==="outbound"?search.depart:search.returnDate}T00:00:00`); date.setDate(date.getDate()+offset); return { offset, label:date.toLocaleDateString("ko-KR",{month:"2-digit",day:"2-digit",weekday:"short"}) }; });
  const update = (key,value) => { setForm(current=>({...current,[key]:value})); setSearched(false); };
  const swap = () => setForm(current=>({...current,from:current.to,to:current.from}));
  const submit = (event) => { event.preventDefault(); if(form.from===form.to){ alert("출발지와 도착지는 서로 달라야 합니다."); return; } if(tripType==="round"&&form.returnDate<form.depart){ alert("오는 날은 가는 날 이후여야 합니다."); return; } setSearch(form); setGoing("YK879"); setReturning("YK630"); setTab("outbound"); setSearched(true); };
  const proceed = () => onContinue({tripType,outbound:selectedGoing,inbound:tripType==="round"?selectedReturn:null,departDate:search.depart,returnDate:search.returnDate});

  return <div className="flight-selection-page"><BookingHeader step={1}/>
    <section className="flight-search-hero"><div><p>BOOK YOUR JOURNEY</p><h1>어디로 떠나시나요?</h1><div className="trip-toggle"><button className={tripType==="round"?"active":""} onClick={()=>setTripType("round")}>왕복</button><button className={tripType==="oneway"?"active":""} onClick={()=>{setTripType("oneway");setTab("outbound")}}>편도</button></div>
      <form className="search-form" onSubmit={submit}>
        <label><span>출발지</span><select value={form.from} onChange={e=>update("from",e.target.value)}>{Object.values(airports).map(a=><option value={a.code} key={a.code}>{a.city} ({a.code})</option>)}</select></label>
        <button type="button" className="swap-button" onClick={swap} aria-label="출발지와 도착지 바꾸기"><ArrowLeftRight/></button>
        <label><span>도착지</span><select value={form.to} onChange={e=>update("to",e.target.value)}>{Object.values(airports).map(a=><option value={a.code} key={a.code}>{a.city} ({a.code})</option>)}</select></label>
        <label><span><CalendarDays/> 가는 날</span><input type="date" value={form.depart} min="2026-01-01" onChange={e=>update("depart",e.target.value)}/></label>
        {tripType==="round"&&<label><span><CalendarDays/> 오는 날</span><input type="date" value={form.returnDate} min={form.depart} onChange={e=>update("returnDate",e.target.value)}/></label>}
        <button type="submit" className="search-submit"><Search/> 항공편 조회</button>
      </form>
      {!searched&&<p className="search-changed">검색 조건이 변경되었습니다. ‘항공편 조회’를 눌러 결과를 갱신해 주세요.</p>}
    </div></section>
    <main className="flight-results"><div className="result-heading"><div><p>{tab==="outbound"?"가는 편":"오는 편"}</p><h2>{tab==="outbound"?`${from.city} → ${to.city}`:`${to.city} → ${from.city}`}</h2></div><span>성인 1명 · 일반석</span></div>
      {tripType==="round"&&<div className="direction-tabs"><button className={tab==="outbound"?"active":""} onClick={()=>setTab("outbound")}><b>1</b>가는 편<small>{selectedGoing.code} · {selectedGoing.departure}</small></button><button className={tab==="inbound"?"active":""} onClick={()=>setTab("inbound")}><b>2</b>오는 편<small>{selectedReturn.code} · {selectedReturn.departure}</small></button></div>}
      <div className="date-strip"><button><ChevronLeft/></button>{dateLabels.map(({offset,label})=><div className={offset===0?"active":""} key={offset}><span>{label}</span><small>{offset===0?"₩ 774,200~":"₩ 812,000~"}</small></div>)}<button><ChevronRight/></button></div>
      <div className="flight-list">{(tab==="outbound"?outbound:inbound).map(f=><FlightCard key={f.id} flight={f} selected={(tab==="outbound"?going:returning)===f.id} onSelect={()=>{if(tab==="outbound"){setGoing(f.id);if(tripType==="round")setTimeout(()=>setTab("inbound"),250)}else setReturning(f.id)}}/>)}</div>
    </main>
    <div className="selection-bar"><div><small>선택한 여정</small><strong>{selectedGoing.code}{tripType==="round"&&` + ${selectedReturn.code}`}</strong></div><div><small>예상 총액</small><strong>₩ {tripType==="round"?"1,468,500":selectedGoing.price}</strong></div><button onClick={proceed}>탑승객 정보 입력 <ArrowRight/></button></div>
  </div>;
}
