export interface StartCheckInInput {
  bookingId: string;
  passportImage: string;
  selfieImage: string;
}

export interface CheckInResult {
  id?: string;
  status?: string;
  startedAt?: string;
}

export interface PersonalData {
  name: string;
  surname: string;
}

export interface DocumentsData {
  passportImage: string | null;
  selfieImage: string | null;
}
