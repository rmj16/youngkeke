import type { Inquiry, InquiryStatus } from "@inq/shared/types/inquiry";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type QnaRow = {
  qna_id: number | string;
  category?: string | null;
  reservation_id?: string | null;
  title?: string | null;
  question?: string | null;
  answer?: string | null;
  status?: string | null;
  created_at?: string | null;
  answered_at?: string | null;
  author_name?: string | null;
  author_email?: string | null;
};

export type Member = {
  memberId: string;
  name: string;
  email: string;
};

export type InquiryInput = {
  category: string;
  reservationId?: string;
  title: string;
  question: string;
};

export class BookingApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !body?.success) {
    throw new BookingApiError(
      body?.message || `예약 서비스 요청에 실패했습니다. (HTTP ${response.status})`,
      response.status,
    );
  }
  return body.data;
}

function inquiryStatus(status?: string | null): InquiryStatus {
  if (status === "ANSWERED") return "답변 완료";
  if (status === "IN_PROGRESS") return "처리 중";
  return "접수";
}

function displayDateTime(value?: string | null): string {
  if (!value) return "-";
  return value.replace("T", " ").slice(0, 16);
}

function toInquiry(row: QnaRow): Inquiry {
  return {
    id: String(row.qna_id),
    category: row.category || "기타",
    title: row.title || "제목 없음",
    email: row.author_email || "",
    booking: row.reservation_id || "-",
    content: row.question || "",
    answer: row.answer || undefined,
    status: inquiryStatus(row.status),
    createdAt: displayDateTime(row.created_at),
    answeredAt: row.answered_at ? displayDateTime(row.answered_at) : undefined,
    customer: row.author_name || "회원",
  };
}

export async function fetchCurrentMember(): Promise<Member> {
  const row = await request<Record<string, unknown>>("/api/members/me");
  return {
    memberId: String(row.member_id ?? row.memberId ?? ""),
    name: String(row.name ?? "회원"),
    email: String(row.email ?? ""),
  };
}

export async function fetchMyInquiries(): Promise<Inquiry[]> {
  const rows = await request<QnaRow[]>("/api/members/me/qna");
  return rows.map(toInquiry);
}

export async function createInquiry(input: InquiryInput): Promise<void> {
  await request<number>("/api/qna", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateInquiry(id: string, input: InquiryInput): Promise<void> {
  await request<null>(`/api/qna/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteInquiry(id: string): Promise<void> {
  await request<null>(`/api/qna/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
