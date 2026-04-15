import { useMemo, useState } from 'react';
import { getAllStaff, type Staff, type StaffRole } from '@/entities/staff';
import { useApi } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/Button';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { Spinner } from '@/shared/ui/Spinner';
import styles from './AdminStaffPage.module.scss';

type RoleFilter = 'all' | StaffRole;

const ROLE_FILTERS: ReadonlyArray<{ value: RoleFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'admin', label: 'Admins' },
  { value: 'worker', label: 'Workers' },
];

function getInitials(name: string | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const [first = '', second = ''] = parts;
  return (
    `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase() ||
    first[0]?.toUpperCase() ||
    '?'
  );
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function AdminStaffPage() {
  const [filter, setFilter] = useState<RoleFilter>('all');

  const {
    data: staff,
    error,
    isLoading,
    refetch,
  } = useApi<Staff[]>((signal) => getAllStaff(signal));

  const filtered = useMemo(() => {
    if (!staff) return [];
    if (filter === 'all') return staff;
    return staff.filter((member) => member.role === filter);
  }, [staff, filter]);

  const total = staff?.length ?? 0;

  return (
    <div className={styles.page}>
      <header className={styles.toolbar}>
        <div className={styles.toolbarFilters}>
          {ROLE_FILTERS.map((item) => {
            const count =
              item.value === 'all'
                ? total
                : (staff ?? []).filter((s) => s.role === item.value).length;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`${styles.chip} ${filter === item.value ? styles.chipActive : ''}`}
              >
                {item.label}
                <span className={styles.chipCount}>{count}</span>
              </button>
            );
          })}
        </div>
        <Button>Add staff member</Button>
      </header>

      <section className={styles.card}>
        {isLoading ? (
          <div className={styles.state}>
            <Spinner size="lg" label="Loading staff" />
          </div>
        ) : error ? (
          <div className={styles.state}>
            <ErrorMessage error={error} onRetry={refetch} />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3>{total === 0 ? 'No staff members yet' : 'No matching members'}</h3>
            <p>
              {total === 0
                ? 'Add your first staff member to start managing roles and access.'
                : 'Try a different filter to see more results.'}
            </p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className={styles.memberCell}>
                        <span className={styles.avatar}>{getInitials(member.name)}</span>
                        <span className={styles.memberName}>{member.name}</span>
                      </div>
                    </td>
                    <td className={styles.muted}>{member.email}</td>
                    <td>
                      {member.role ? (
                        <span
                          className={`${styles.roleBadge} ${
                            member.role === 'admin' ? styles.roleAdmin : styles.roleWorker
                          }`}
                        >
                          {member.role}
                        </span>
                      ) : (
                        <span className={styles.muted}>—</span>
                      )}
                    </td>
                    <td className={styles.muted}>{formatDate(member.createdAt)}</td>
                    <td className={styles.actionsCell}>
                      <button type="button" className={styles.rowAction} aria-label="Edit">
                        ⋯
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
