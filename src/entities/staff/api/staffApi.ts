import { apiClient } from '@/shared/api';
import type {
  JwtStaffPayload,
  LoginStaffInput,
  RegisterStaffInput,
  Staff,
  StaffAuthRawResponse,
  StaffAuthResponse,
  StaffRole,
  UpdateStaffInput,
} from '../model/types';

function decodeJwtPayload(token: string): JwtStaffPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JwtStaffPayload;
  } catch {
    return null;
  }
}

function staffFromPayload(payload: JwtStaffPayload): Staff {
  const rawId = payload.sub;
  const id = typeof rawId === 'string' ? Number(rawId) : (rawId ?? 0);
  return {
    id,
    email: payload.email ?? '',
    name: payload.name ?? payload.email ?? 'Staff',
    role: payload.role as StaffRole | undefined,
  };
}

async function fetchStaffProfile(
  id: number,
  token: string,
  signal?: AbortSignal,
): Promise<Staff | null> {
  try {
    return await apiClient.get<Staff>(`/staff/${id}`, {
      signal,
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}

async function normalizeAuthResponse(
  raw: StaffAuthRawResponse,
  signal?: AbortSignal,
): Promise<StaffAuthResponse> {
  if (raw && typeof raw === 'object' && 'id' in raw && 'email' in raw) {
    return { staff: raw as Staff, token: null };
  }

  const wrapper = raw as {
    staff?: Staff;
    user?: Staff;
    access_token?: string;
    token?: string;
  };
  const token = wrapper.access_token ?? wrapper.token ?? null;
  const inlineStaff = wrapper.staff ?? wrapper.user;

  if (inlineStaff) {
    return { staff: inlineStaff, token };
  }

  if (!token) {
    throw new Error('Unexpected auth response shape: neither staff nor token present');
  }

  const payload = decodeJwtPayload(token);
  if (!payload?.sub) {
    throw new Error('Unexpected auth response shape: token payload is missing sub');
  }

  const fallbackStaff = staffFromPayload(payload);
  const fullStaff = await fetchStaffProfile(fallbackStaff.id, token, signal);
  return { staff: fullStaff ?? fallbackStaff, token };
}

export async function registerStaff(input: RegisterStaffInput, signal?: AbortSignal) {
  const raw = await apiClient.post<StaffAuthRawResponse>('/staff/register', input, {
    signal,
    auth: false,
  });
  return normalizeAuthResponse(raw, signal);
}

export function createStaff(input: RegisterStaffInput, signal?: AbortSignal) {
  return apiClient.post<Staff>('/staff/register', input, { signal });
}

export async function loginStaff(input: LoginStaffInput, signal?: AbortSignal) {
  const raw = await apiClient.post<StaffAuthRawResponse>('/staff/login', input, {
    signal,
    auth: false,
  });
  return normalizeAuthResponse(raw, signal);
}

export function getAllStaff(signal?: AbortSignal) {
  return apiClient.get<Staff[]>('/staff', { signal });
}

export function getStaffById(id: number, signal?: AbortSignal) {
  return apiClient.get<Staff>(`/staff/${id}`, { signal });
}

export function updateStaff(id: number, input: UpdateStaffInput, signal?: AbortSignal) {
  return apiClient.patch<Staff>(`/staff/${id}`, input, { signal });
}

export function deleteStaff(id: number, signal?: AbortSignal) {
  return apiClient.delete<void>(`/staff/${id}`, { signal });
}
