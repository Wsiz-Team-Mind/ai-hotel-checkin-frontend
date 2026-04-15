import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStaff } from '@/entities/staff';
import { toApiError } from '@/shared/api';
import { useAuthStore } from '@/shared/lib/store';
import { Button } from '@/shared/ui/Button';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { Input } from '@/shared/ui/Input';
import { Spinner } from '@/shared/ui/Spinner';
import styles from './StaffRegisterForm.module.scss';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function StaffRegisterForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const validation = useMemo(() => {
    const errors: { name?: string; email?: string; password?: string; confirm?: string } = {};
    if (trimmedName.length < 2) errors.name = 'Name is required.';
    if (!EMAIL_RE.test(trimmedEmail)) errors.email = 'Enter a valid email.';
    if (password.length < MIN_PASSWORD_LENGTH)
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (confirm !== password) errors.confirm = 'Passwords do not match.';
    return errors;
  }, [trimmedName, trimmedEmail, password, confirm]);

  const isValid = Object.keys(validation).length === 0;
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const showError = (key: keyof typeof validation) =>
    touched[key] ? validation[key] : undefined;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await registerStaff({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });
      setAuth({ token: response.token, staff: response.staff });
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        error={showError('name')}
        disabled={isSubmitting}
        autoFocus
        autoComplete="name"
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        error={showError('email')}
        disabled={isSubmitting}
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={showError('password')}
        disabled={isSubmitting}
        autoComplete="new-password"
        hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        required
      />
      <Input
        label="Confirm password"
        type="password"
        value={confirm}
        onChange={(event) => setConfirm(event.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
        error={showError('confirm')}
        disabled={isSubmitting}
        autoComplete="new-password"
        required
      />

      {error ? (
        <ErrorMessage error={error} onRetry={() => setError(null)} retryLabel="Dismiss" />
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className={styles.submitting}>
            <Spinner size="sm" label="Creating account" />
            Creating...
          </span>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
}
