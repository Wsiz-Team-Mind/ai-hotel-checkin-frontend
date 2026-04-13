import { Button } from '@/shared/ui/Button';
import styles from './AdminStaffPage.module.scss';

export function AdminStaffPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Staff</h1>
        <Button>Add Staff Member</Button>
      </div>
      <p className={styles.subtitle}>Manage hotel staff members</p>

      <div className={styles.emptyState}>
        <p>No staff members yet</p>
        <span>Add your first staff member to get started</span>
      </div>
    </div>
  );
}
