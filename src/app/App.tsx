import { useState } from "react";
import FlightSelectionPage from "./reserve/pages/FlightSelectionPage";
import BookingPage from "./reserve/pages/BookingPage";
import BookingCompletePage from "./reserve/pages/BookingCompletePage";

export default function App() {
  const [page, setPage] = useState("flights");
  const [booking, setBooking] = useState<any>(null);
  if (page === "booking") return <BookingPage itinerary={booking} onBack={() => setPage("flights")} onComplete={(result: any) => { setBooking((current: any) => ({ ...current, ...result })); setPage("complete"); }} />;
  if (page === "complete") return <BookingCompletePage booking={booking} onHome={() => setPage("flights")} />;
  return <FlightSelectionPage onContinue={(itinerary: any) => { setBooking(itinerary); setPage("booking"); }} />;
}
