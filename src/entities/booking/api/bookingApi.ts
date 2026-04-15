import { apiClient } from '@/shared/api';
import type { Booking, BookingLoginInput } from '../model/types';

export function loginBooking(input: BookingLoginInput, signal?: AbortSignal) {
  return apiClient.post<Booking>('/booking/login', input, { signal });
}

export function getBooking(id: string, signal?: AbortSignal) {
  return apiClient.get<Booking>(`/booking/${encodeURIComponent(id)}`, { signal });
}
