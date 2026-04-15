export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  status?: string;
}

export interface BookingLoginInput {
  bookingId: string;
}
