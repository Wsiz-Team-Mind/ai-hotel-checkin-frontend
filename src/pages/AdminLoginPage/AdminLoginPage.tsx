import { Link } from 'react-router-dom';
import { StaffLoginForm } from '@/features/staff-login';
import styles from './AdminLoginPage.module.scss';

export function AdminLoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img
          src="/uitm-logo.svg"
          alt="UITM Rzeszów"
          className={styles.logo}
        />

        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Use your staff credentials to access the admin panel.
        </p>

        <StaffLoginForm />

        <p className={styles.footer}>
          Don&apos;t have an account yet?{' '}
          <Link to="/admin/register" className={styles.link}>
            Create one
          </Link>
        </p>
      </div>

      <p className={styles.copyright}>
        © {new Date().getFullYear()} UITM Rzeszów · AI Hotel Check-in
      </p>
    </div>
  );
}
