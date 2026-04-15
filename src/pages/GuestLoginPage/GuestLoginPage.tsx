import { GuestLoginForm } from '@/features/guest-login';
import styles from './GuestLoginPage.module.scss';

export function GuestLoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Guest check-in</h1>
        <p className={styles.subtitle}>
          Enter your booking ID to start the check-in process.
        </p>
        <GuestLoginForm />
      </div>
    </div>
  );
}
