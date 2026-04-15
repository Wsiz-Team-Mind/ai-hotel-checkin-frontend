import { Link } from 'react-router-dom';
import { useAuthStore } from '@/shared/lib/store';
import styles from './AdminDashboardPage.module.scss';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'brand' | 'success' | 'warning';
}

function StatCard({ label, value, hint, tone = 'default' }: StatCardProps) {
  return (
    <div className={`${styles.statCard} ${styles[`tone-${tone}`]}`}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      {hint ? <span className={styles.statHint}>{hint}</span> : null}
    </div>
  );
}

export function AdminDashboardPage() {
  const staff = useAuthStore((s) => s.staff);
  const firstName = staff?.name?.split(/\s+/)[0] ?? 'there';

  return (
    <div className={styles.page}>
      <header className={styles.greeting}>
        <h2 className={styles.greetingTitle}>Welcome back, {firstName}</h2>
        <p className={styles.greetingText}>
          Here&apos;s what&apos;s happening across your property today.
        </p>
      </header>

      <section className={styles.stats}>
        <StatCard label="Total staff" value={1} hint="You are the first" tone="brand" />
        <StatCard label="Active bookings" value="—" hint="Coming soon" />
        <StatCard label="Check-ins today" value={0} hint="Kiosk is idle" tone="success" />
        <StatCard label="Pending review" value={0} hint="All clear" tone="warning" />
      </section>

      <section className={styles.panels}>
        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2>Quick actions</h2>
            <p>Jump to the most common workflows.</p>
          </header>
          <div className={styles.actionGrid}>
            <Link to="/admin/staff" className={styles.actionCard}>
              <span className={styles.actionIcon}>＋</span>
              <div>
                <h3>Add staff member</h3>
                <p>Invite a worker or admin to the panel.</p>
              </div>
            </Link>
            <div className={`${styles.actionCard} ${styles.actionDisabled}`}>
              <span className={styles.actionIcon}>📅</span>
              <div>
                <h3>Create booking</h3>
                <p>Booking module — coming soon.</p>
              </div>
            </div>
            <div className={`${styles.actionCard} ${styles.actionDisabled}`}>
              <span className={styles.actionIcon}>🪪</span>
              <div>
                <h3>Review check-in</h3>
                <p>Kiosk queue — coming soon.</p>
              </div>
            </div>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.activity}`}>
          <header className={styles.panelHeader}>
            <h2>Recent activity</h2>
            <p>Events from staff, bookings and the kiosk will appear here.</p>
          </header>
          <div className={styles.activityEmpty}>
            <div className={styles.activityDot} />
            <p>No activity yet.</p>
            <span>Once guests start checking in, you&apos;ll see events in real time.</span>
          </div>
        </article>
      </section>
    </div>
  );
}
