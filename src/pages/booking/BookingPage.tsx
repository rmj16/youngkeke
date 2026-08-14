"use client";

import { useState } from "react";
import { FlightSelectionStep } from "./steps/FlightSelectionStep";
import { ReservationStep } from "./steps/ReservationStep";
import { CompleteStep } from "./steps/CompleteStep";

// 항공권 예약(부킹) 플로우 — 항공편 선택 → 예약/결제 → 완료.
// 스타일은 .booking-root 로 스코프됨 (styles/pages/booking.css, index.css에서 전역 로드).
export function BookingPage() {
  const [page, setPage] = useState<"flights" | "booking" | "complete">("flights");
  const [booking, setBooking] = useState<any>(null);

  return (
    <div className="booking-root">
      {page === "flights" && (
        <FlightSelectionStep
          onContinue={(itinerary: any) => {
            setBooking(itinerary);
            setPage("booking");
          }}
        />
      )}
      {page === "booking" && (
        <ReservationStep
          itinerary={booking}
          onBack={() => setPage("flights")}
          onComplete={(result: any) => {
            setBooking((current: any) => ({ ...current, ...result }));
            setPage("complete");
          }}
        />
      )}
      {page === "complete" && (
        <CompleteStep booking={booking} onBack={() => setPage("flights")} />
      )}
    </div>
  );
}
