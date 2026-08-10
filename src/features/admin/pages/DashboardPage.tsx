import { CardHead } from "@/src/features/admin/components/SectionHeader";
import { InquiryTable } from "@/src/features/admin/components/InquiryTable";
import { Kpi } from "@/src/features/admin/components/KpiCard";
import type { Inquiry } from "@/src/shared/types/inquiry";

export function DashboardPage({ inquiries, navigate }: { inquiries: Inquiry[]; navigate: (v: string) => void }) {
  const received = inquiries.filter((i) => i.status === "접수").length;
  const working = inquiries.filter((i) => i.status === "처리 중").length;
  const done = inquiries.filter((i) => i.status === "답변 완료").length;
  return (
    <div className="admin-content">
      <div className="page-title"><div><h1>운영 대시보드</h1><p>2026년 8월 10일 월요일 · 오늘의 고객지원 현황입니다.</p></div><button className="jira-primary" onClick={() => navigate("admin-inquiries")}>문의 관리로 이동</button></div>
      <div className="kpi-grid"><Kpi title="오늘 접수" value={received + 12} unit="건" trend="어제보다 8% 증가" tone="blue" icon="?" /><Kpi title="처리 중" value={working + 5} unit="건" trend="우선 확인 3건" tone="amber" icon="↻" /><Kpi title="답변 완료" value={done + 26} unit="건" trend="완료율 82%" tone="green" icon="✓" /><Kpi title="평균 응답 시간" value="1.8" unit="시간" trend="목표보다 12분 빠름" tone="purple" icon="◷" /></div>
      <div className="dashboard-grid">
        <section className="admin-card chart-card"><CardHead title="주간 문의 추이" subtitle="최근 7일간 접수 및 완료 건수" action="최근 7일⌄" /><div className="chart-legend"><span><i className="dot blue" />접수</span><span><i className="dot green" />답변 완료</span></div><div className="bar-chart">{[[58,44],[72,56],[65,54],[88,70],[76,65],[47,40],[82,68]].map((v,i)=><div className="bar-day" key={i}><div className="bar-pair"><i style={{height:`${v[0]}%`}}/><i style={{height:`${v[1]}%`}}/></div><span>{["월","화","수","목","금","토","일"][i]}</span></div>)}</div></section>
        <section className="admin-card donut-card"><CardHead title="문의 유형" subtitle="이번 달 카테고리 비율" /><div className="donut-wrap"><div className="donut"><div><strong>184</strong><span>전체 문의</span></div></div><ul><li><i className="dot blue"/><span>예약/결제</span><strong>38%</strong></li><li><i className="dot purple"/><span>환불/취소</span><strong>24%</strong></li><li><i className="dot cyan"/><span>수하물</span><strong>18%</strong></li><li><i className="dot amber"/><span>회원/기타</span><strong>20%</strong></li></ul></div></section>
      </div>
      <section className="admin-card recent-card"><CardHead title="최근 문의" subtitle="새로 접수된 고객 문의를 확인하세요" action="전체 보기 →" onAction={() => navigate("admin-inquiries")} /><InquiryTable inquiries={inquiries.slice(0,4)} compact /></section>
    </div>
  );
}
