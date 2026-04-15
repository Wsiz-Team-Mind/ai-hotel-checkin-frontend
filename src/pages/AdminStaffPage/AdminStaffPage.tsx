import { useCallback, useMemo, useState, type FormEvent } from 'react';
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  updateStaff,
  type Staff,
  type StaffRole,
} from '@/entities/staff';
import { useApi } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/Button';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { Spinner } from '@/shared/ui/Spinner';
import styles from './AdminStaffPage.module.scss';

type RoleFilter = 'all' | StaffRole;

type ModalMode = { kind: 'closed' } | { kind: 'add' } | { kind: 'edit'; member: Staff } | { kind: 'delete'; member: Staff };

const ROLE_FILTERS: ReadonlyArray<{ value: RoleFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'admin', label: 'Admins' },
  { value: 'worker', label: 'Workers' },
];

const ROLES: ReadonlyArray<{ value: StaffRole; label: string }> = [
  { value: 'admin', label: 'Admin' },
  { value: 'worker', label: 'Worker' },
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
  const [modal, setModal] = useState<ModalMode>({ kind: 'closed' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

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

  const closeModal = useCallback(() => {
    setModal({ kind: 'closed' });
    setFormError('');
  }, []);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') as string).trim();
    const email = (fd.get('email') as string).trim();
    const password = (fd.get('password') as string);

    if (!name || !email || !password) {
      setFormError('All fields are required.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await createStaff({ name, email, password });
      closeModal();
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add staff member.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (modal.kind !== 'edit') return;

    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') as string).trim();
    const email = (fd.get('email') as string).trim();
    const role = (fd.get('role') as string) as StaffRole;

    if (!name || !email) {
      setFormError('Name and email are required.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await updateStaff(modal.member.id, { name, email, role });
      closeModal();
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update staff member.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (modal.kind !== 'delete') return;
    setSubmitting(true);
    setFormError('');
    try {
      await deleteStaff(modal.member.id);
      closeModal();
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete staff member.');
    } finally {
      setSubmitting(false);
    }
  }

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
        <Button onClick={() => setModal({ kind: 'add' })}>Add staff member</Button>
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
                      <button
                        type="button"
                        className={styles.rowAction}
                        aria-label="Edit"
                        onClick={() => setModal({ kind: 'edit', member })}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={`${styles.rowAction} ${styles.rowActionDanger}`}
                        aria-label="Delete"
                        onClick={() => setModal({ kind: 'delete', member })}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add staff modal */}
      <Modal open={modal.kind === 'add'} onClose={closeModal} title="Add staff member" footer={
        <>
          <Button variant="secondary" onClick={closeModal} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="add-staff-form" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add member'}
          </Button>
        </>
      }>
        <form id="add-staff-form" className={styles.form} onSubmit={handleAdd}>
          <Input name="name" label="Full name" placeholder="John Doe" required autoFocus />
          <Input name="email" label="Email" type="email" placeholder="john@hotel.com" required />
          <Input name="password" label="Password" type="password" placeholder="Min 6 characters" required minLength={6} />
          {formError ? <p className={styles.formError}>{formError}</p> : null}
        </form>
      </Modal>

      {/* Edit staff modal */}
      {modal.kind === 'edit' ? (
        <Modal open onClose={closeModal} title="Edit staff member" footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={submitting}>Cancel</Button>
            <Button type="submit" form="edit-staff-form" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }>
          <form id="edit-staff-form" className={styles.form} onSubmit={handleEdit}>
            <Input name="name" label="Full name" defaultValue={modal.member.name} required autoFocus />
            <Input name="email" label="Email" type="email" defaultValue={modal.member.email} required />
            <div className={styles.field}>
              <label htmlFor="edit-role" className={styles.fieldLabel}>Role</label>
              <select id="edit-role" name="role" className={styles.select} defaultValue={modal.member.role ?? 'worker'}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            {formError ? <p className={styles.formError}>{formError}</p> : null}
          </form>
        </Modal>
      ) : null}

      {/* Delete confirmation modal */}
      {modal.kind === 'delete' ? (
        <Modal open onClose={closeModal} title="Delete staff member" footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={submitting}>Cancel</Button>
            <Button onClick={handleDelete} disabled={submitting}>
              {submitting ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }>
          <p className={styles.confirmText}>
            Are you sure you want to delete <strong>{modal.member.name}</strong>? This action cannot be undone.
          </p>
          {formError ? <p className={styles.formError}>{formError}</p> : null}
        </Modal>
      ) : null}
    </div>
  );
}
