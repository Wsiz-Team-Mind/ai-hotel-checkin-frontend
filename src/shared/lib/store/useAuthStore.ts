import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Staff } from '@/entities/staff';

interface AuthState {
  token: string | null;
  staff: Staff | null;
  setAuth: (payload: { token?: string | null; staff: Staff }) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      staff: null,
      setAuth: ({ token = null, staff }) => set({ token, staff }),
      clearAuth: () => set({ token: null, staff: null }),
      isAuthenticated: () => Boolean(get().staff),
    }),
    {
      name: 'hotel-admin-auth',
      partialize: (state) => ({ token: state.token, staff: state.staff }),
    },
  ),
);

export function getAuthToken(): string | null {
  return useAuthStore.getState().token;
}
