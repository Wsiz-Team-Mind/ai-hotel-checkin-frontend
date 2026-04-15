import { Link } from 'react-router-dom';
import { StaffRegisterForm } from '@/features/staff-register';
import styles from './AdminRegisterPage.module.scss';

export function AdminRegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img
          src="/uitm-logo.svg"
          alt="UITM Rzeszów"
          className={styles.logo}
        />

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>
          Register a new staff member to access the admin panel.
        </p>

        <StaffRegisterForm />

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/admin/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>

      <p className={styles.copyright}>
        © {new Date().getFullYear()} UITM Rzeszów · AI Hotel Check-in
      </p>
    </div>
  );
}
