import { apiClient } from '@/shared/api';
import type { CheckInResult, StartCheckInInput } from '../model/types';

export function startCheckIn(input: StartCheckInInput, signal?: AbortSignal) {
  return apiClient.post<CheckInResult>('/checkin/start', input, { signal });
}
