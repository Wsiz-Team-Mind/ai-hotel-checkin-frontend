import type { ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { RequireAuth } from './RequireAuth';
import { HomePage } from '@/pages/HomePage';
import { AdminLayout } from '@/pages/AdminLayout';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminRegisterPage } from '@/pages/AdminRegisterPage';
import { AdminStaffPage } from '@/pages/AdminStaffPage';
import { GuestLoginPage } from '@/pages/GuestLoginPage';
import { GuestCheckInPage } from '@/pages/GuestCheckInPage';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

function withBoundary(node: ReactNode) {
  return <ErrorBoundary>{node}</ErrorBoundary>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: withBoundary(<HomePage />),
      },
      {
        path: 'checkin',
        element: withBoundary(<GuestLoginPage />),
      },
      {
        path: 'checkin/:bookingId',
        element: withBoundary(<GuestCheckInPage />),
      },
      {
        path: 'admin/login',
        element: withBoundary(<AdminLoginPage />),
      },
      {
        path: 'admin/register',
        element: withBoundary(<AdminRegisterPage />),
      },
      {
        path: 'admin',
        element: (
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: withBoundary(<AdminDashboardPage />),
          },
          {
            path: 'staff',
            element: withBoundary(<AdminStaffPage />),
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
