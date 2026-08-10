import BookingConfirmation from "../BookingConfirmation";
export default function BookingCompletePage({
  booking,
  onHome
}) {
  return <BookingConfirmation booking={booking} onBack={onHome} />;
}
