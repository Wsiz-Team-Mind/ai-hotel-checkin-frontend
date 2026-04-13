import type { ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomePage } from '@/pages/HomePage';
import { AdminLayout } from '@/pages/AdminLayout';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminStaffPage } from '@/pages/AdminStaffPage';
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
        path: 'admin',
        element: <AdminLayout />,
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
