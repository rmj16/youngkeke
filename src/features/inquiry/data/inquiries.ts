import type { Inquiry } from "@features/inquiry/types/inquiry";

export const seedInquiries: Inquiry[] = [
  { id: "GA-2026-0810", category: "예약/결제", title: "결제는 완료됐는데 예약번호가 보이지 않아요", email: "minji.kim@example.com", booking: "GA4K2P", content: "인천–자카르타 왕복 항공권 결제를 완료했습니다. 결제 문자는 받았지만 나의 여행에서 예약이 확인되지 않습니다.", status: "접수", createdAt: "2026.08.10 09:42", customer: "김민지" },
  { id: "GA-2026-0805", category: "수하물", title: "기내 반입 수하물 무게 기준이 궁금합니다", email: "minji.kim@example.com", booking: "GA4K2P", content: "노트북 가방과 작은 캐리어를 함께 기내에 반입할 수 있는지, 합산 무게 기준도 알려주세요.", status: "처리 중", createdAt: "2026.08.08 16:20", customer: "김민지" },
  { id: "GA-2026-0803", category: "회원/마일리지", title: "Youngkeke Miles 누락 적립 문의", email: "minji.kim@example.com", booking: "GA1T7M", content: "지난달 탑승한 인천–발리 구간의 마일리지가 아직 적립되지 않아 확인 부탁드립니다.", status: "답변 완료", createdAt: "2026.08.05 11:08", customer: "김민지" },
  { id: "GA-2026-0809", category: "환불/취소", title: "일정 변경으로 인한 환불 수수료 문의", email: "jun.park@example.com", booking: "GA9M7A", content: "출발 12일 전 취소할 경우 발생하는 수수료와 환불 소요 기간을 알고 싶습니다.", status: "처리 중", createdAt: "2026.08.10 08:17", customer: "박준호" },
  { id: "GA-2026-0808", category: "수하물", title: "스포츠 장비 위탁 가능 여부", email: "soyeon.lee@example.com", booking: "GA2L8C", content: "서핑보드 1개를 위탁하려고 합니다. 사전 신청 방법과 추가 요금을 안내해 주세요.", status: "답변 완료", createdAt: "2026.08.09 18:05", customer: "이소연" },
  { id: "GA-2026-0807", category: "회원/마일리지", title: "탑승 완료 후 마일리지 적립이 안 됐어요", email: "taeho.choi@example.com", booking: "GA8Q1D", content: "지난주 부산–도쿄 노선 이용 후에도 마일리지가 반영되지 않았습니다.", status: "처리 중", createdAt: "2026.08.09 14:21", customer: "최태호" },
  { id: "GA-2026-0806", category: "기타", title: "영문 이름 순서 수정 요청", email: "yuna.han@example.com", booking: "GA6B3N", content: "여권과 예약 정보의 영문 이름 순서가 다릅니다. 수정 가능한지 확인 부탁드립니다.", status: "답변 완료", createdAt: "2026.08.09 11:48", customer: "한유나" },
];

export const adminNavigation = [
  { key: "dashboard", label: "대시보드", icon: "⌂" },
  { key: "inquiries", label: "문의 관리", icon: "?" },
  { key: "members", label: "회원 관리", icon: "♙" },
  { key: "bookings", label: "예약 관리", icon: "▣" },
  { key: "flights", label: "항공편", icon: "✈" },
];
