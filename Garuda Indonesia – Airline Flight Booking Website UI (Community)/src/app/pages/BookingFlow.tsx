"use client";

import { useState } from "react";
import "../reserve/booking.scoped.css";
import FlightSelectionPage from "../reserve/pages/FlightSelectionPage";
import BookingPage from "../reserve/pages/BookingPage";
import BookingCompletePage from "../reserve/pages/BookingCompletePage";

// 항공권 예약(부킹) 플로우 (booking 브랜치 통합) — 항공편 선택 → 예약 → 결제 → 완료.
// CSS는 .booking-root 로 스코프됨.
export function BookingFlow() {
  const [page, setPage] = useState<"flights" | "booking" | "complete">("flights");
  const [booking, setBooking] = useState<any>(null);

  return (
    <div className="booking-root">
      {page === "flights" && (
        <FlightSelectionPage
          onContinue={(itinerary: any) => {
            setBooking(itinerary);
            setPage("booking");
          }}
        />
      )}
      {page === "booking" && (
        <BookingPage
          itinerary={booking}
          onBack={() => setPage("flights")}
          onComplete={(result: any) => {
            setBooking((current: any) => ({ ...current, ...result }));
            setPage("complete");
          }}
        />
      )}
      {page === "complete" && (
        <BookingCompletePage booking={booking} onHome={() => setPage("flights")} />
      )}
    </div>
  );
}
