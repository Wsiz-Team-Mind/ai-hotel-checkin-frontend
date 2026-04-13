import { apiClient } from '@/shared/api';
import { useApi } from '@/shared/lib/hooks';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { Spinner } from '@/shared/ui/Spinner';
import styles from './AdminDashboardPage.module.scss';

interface DashboardStats {
  totalStaff: number;
  activeGuests: number;
  checkInsToday: number;
}

export function AdminDashboardPage() {
  const {
    data: stats,
    error,
    isLoading,
    refetch,
  } = useApi<DashboardStats>((signal) =>
    apiClient.get<DashboardStats>('/api/admin/dashboard/stats', { signal }),
  );

  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>
      <p className={styles.subtitle}>System overview and management</p>

      {isLoading ? (
        <div className={styles.loadingState}>
          <Spinner size="lg" label="Loading dashboard stats" />
        </div>
      ) : error ? (
        <ErrorMessage error={error} onRetry={refetch} />
      ) : (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats?.totalStaff ?? 0}</span>
            <span className={styles.statLabel}>Total Staff</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats?.activeGuests ?? 0}</span>
            <span className={styles.statLabel}>Active Guests</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats?.checkInsToday ?? 0}</span>
            <span className={styles.statLabel}>Check-ins Today</span>
          </div>
        </div>
      )}
    </div>
  );
}
