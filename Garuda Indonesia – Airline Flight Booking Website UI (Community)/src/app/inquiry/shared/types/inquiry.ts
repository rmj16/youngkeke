export type InquiryStatus = "접수" | "처리 중" | "답변 완료";
export type Inquiry = {
  id: string;
  category: string;
  title: string;
  email: string;
  booking: string;
  content: string;
  status: InquiryStatus;
  createdAt: string;
  customer: string;
  answer?: string;
  answeredAt?: string;
  userClosed?: boolean;
};
