export type Reservation = {
  code: string;
  passenger: string;
  flight: string;
  flightId: string;
  route: string;
  departure: string;
  seat: string;
  baggage: string;
  status: string;
};

export type Inquiry = {
  id: string;
  category: string;
  customer: string;
  title: string;
  createdAt: string;
  status: string;
  content: string;
  answer?: string;
};

export type CrewMember = {
  crewId: string;
  employeeNo: string;
  name: string;
  rank: string;
  baseAirport: string;
  phone: string;
  status: string;
};

export type PartnerRequest = {
  id: string;
  company: string;
  type: string;
  manager: string;
  createdAt: string;
  status: string;
  reason?: string;
};

export type AuditItem = {
  id: number;
  adminLoginId: string;
  action: string;
  target: string;
  detail: string;
  time: string;
  result: string;
  ip: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
};

function value(source: unknown, ...keys: string[]): unknown {
  if (!source || typeof source !== "object") return undefined;
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return undefined;
}

function text(source: unknown, ...keys: string[]): string {
  const found = value(source, ...keys);
  if (found === undefined || found === null || found === "") return "-";
  if (Array.isArray(found)) return found.map(String).join(", ");
  return String(found);
}

function rows(body: unknown, ...keys: string[]): unknown[] {
  const root = value(body, "data") ?? body;
  if (Array.isArray(root)) return root;
  for (const key of [...keys, "content", "items", "results"]) {
    const found = value(root, key);
    if (Array.isArray(found)) return found;
  }
  return [];
}

function formatKstDateTime(source: unknown): string {
  const raw = source === undefined || source === null ? "" : String(source).trim();
  if (!raw || raw === "-") return "-";

  // admin_db stores audit DATETIME values in UTC. A DATETIME value has no
  // offset, so explicitly treat an offset-less API value as UTC before
  // rendering it in the service's fixed Asia/Seoul timezone.
  const hasOffset = /(?:Z|[+-]\d{2}:\d{2})$/i.test(raw);
  const parsed = new Date(hasOffset ? raw : `${raw}Z`);
  if (Number.isNaN(parsed.getTime())) return raw;

  const formatted = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(parsed);

  return `${formatted} KST`;
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = text(body, "message");
    throw new Error(message === "-" ? `요청 실패 (HTTP ${response.status})` : message);
  }
  return body;
}

export async function fetchReservations(): Promise<Reservation[]> {
  const body = await request("/api/admin/reservations");
  return rows(body, "reservations").map((item) => {
    const origin = text(item, "origin");
    const destination = text(item, "destination");
    const passengers = value(item, "passengers");
    const passenger = Array.isArray(passengers)
      ? passengers.map((entry) => text(entry, "name")).join(", ")
      : text(
          item,
          "passengerNames",
          "passenger_names",
          "passenger",
          "memberName",
          "member_id",
          "memberId",
        );
    return {
      code: text(item, "reservationId", "reservation_id", "id", "code"),
      passenger,
      flight: text(item, "flightNo", "flight_no"),
      flightId: text(item, "flightId", "flight_id"),
      route: origin !== "-" || destination !== "-" ? `${origin} → ${destination}` : text(item, "route"),
      departure: text(item, "bookedAt", "booked_at", "departAt", "depart_at", "departure"),
      seat: text(item, "seatNo", "seat_no", "seat"),
      baggage: text(item, "baggageOption", "baggage_option", "baggage"),
      status: text(item, "status"),
    };
  });
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const body = await request("/api/admin/qna");
  return rows(body, "qna", "inquiries").map((item) => {
    const answer = text(item, "answer");
    return {
      id: text(item, "id", "qnaId", "qna_id", "inquiryId"),
      category: text(item, "category"),
      customer: text(item, "customer", "memberName", "member_name", "authorName", "author_name"),
      title: text(item, "title"),
      createdAt: text(item, "createdAt", "created_at"),
      status: text(item, "status"),
      content: text(item, "question", "content"),
      answer: answer === "-" ? undefined : answer,
    };
  });
}

export async function saveInquiryAnswer(id: string, answer: string): Promise<void> {
  await request(`/api/admin/qna/${encodeURIComponent(id)}/answer`, {
    method: "PATCH",
    body: JSON.stringify({ answer }),
  });
}

export async function fetchCrew(): Promise<CrewMember[]> {
  const body = await request("/api/admin/crew");
  return rows(body, "crew", "members", "employees").map((item) => ({
    crewId: text(item, "crewId", "crew_id", "id"),
    employeeNo: text(item, "employeeNo", "employee_no", "loginId"),
    name: text(item, "name", "crewName", "displayName"),
    rank: text(item, "rank", "role", "position"),
    baseAirport: text(item, "baseAirport", "base_airport"),
    phone: text(item, "phone", "phoneNumber", "phone_number"),
    status: text(item, "status", "dutyStatus", "duty_status"),
  }));
}

export async function fetchPartnerRequests(): Promise<PartnerRequest[]> {
  const body = await request("/api/admin/partner/requests");
  return rows(body, "requests", "partnerRequests").map((item) => {
    const reason = text(item, "reason");
    return {
      id: text(item, "requestId", "request_id", "id"),
      company: text(item, "partnerName", "partner_name", "company"),
      type: text(item, "requestType", "request_type", "type", "title"),
      manager: text(item, "manager", "managerName", "contactName"),
      createdAt: text(item, "requestedAt", "createdAt", "created_at"),
      status: text(item, "status"),
      reason: reason === "-" ? undefined : reason,
    };
  });
}

export async function savePartnerStatus(
  id: string,
  status: "APPROVED" | "REJECTED",
  reason: string,
): Promise<void> {
  await request(`/api/admin/partner/requests/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, reason }),
  });
}

export async function fetchAuditLogs(): Promise<AuditItem[]> {
  const body = await request("/api/admin/audit-logs?limit=200");
  return rows(body, "logs", "auditLogs").map((item) => ({
    id: Number(value(item, "id") ?? 0),
    adminLoginId: text(item, "adminLoginId", "admin_login_id"),
    action: text(item, "actionType", "action_type", "action"),
    target: text(item, "targetId", "target_id", "target"),
    detail: text(item, "detail"),
    time: formatKstDateTime(value(item, "createdAt", "created_at", "time")),
    result: text(item, "result"),
    ip: text(item, "clientIp", "client_ip", "ip"),
  }));
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "서비스 데이터를 불러오지 못했습니다.";
}
