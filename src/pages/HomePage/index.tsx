import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/lib/store';

export function HomePage() {
  const staff = useAuthStore((s) => s.staff);
  return <Navigate to={staff ? '/admin' : '/admin/login'} replace />;
}
