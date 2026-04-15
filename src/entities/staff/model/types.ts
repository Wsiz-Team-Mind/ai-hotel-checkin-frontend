export type StaffRole = 'admin' | 'worker';

export interface Staff {
  id: number;
  email: string;
  name: string;
  role?: StaffRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterStaffInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginStaffInput {
  email: string;
  password: string;
}

export interface UpdateStaffInput {
  email?: string;
  password?: string;
  name?: string;
  role?: StaffRole;
}

export interface StaffAuthResponse {
  staff: Staff;
  token: string | null;
}

export type StaffAuthRawResponse =
  | Staff
  | { access_token: string; token?: string }
  | { token: string; access_token?: string }
  | { staff: Staff; access_token?: string; token?: string }
  | { user: Staff; access_token?: string; token?: string };

export interface JwtStaffPayload {
  sub?: number | string;
  email?: string;
  role?: StaffRole | string;
  name?: string;
  iat?: number;
  exp?: number;
}
