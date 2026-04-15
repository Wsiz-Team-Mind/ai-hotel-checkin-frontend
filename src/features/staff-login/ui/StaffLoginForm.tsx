import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStaff } from '@/entities/staff';
import { toApiError } from '@/shared/api';
import { useAuthStore } from '@/shared/lib/store';
import { Button } from '@/shared/ui/Button';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { Input } from '@/shared/ui/Input';
import { Spinner } from '@/shared/ui/Spinner';
import styles from './StaffLoginForm.module.scss';

export function StaffLoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const emailTrimmed = email.trim();
  const isValid = emailTrimmed.length > 0 && password.length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await loginStaff({ email: emailTrimmed, password });
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
        label="Email"
        type="email"
        placeholder="admin@hotel.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isSubmitting}
        autoFocus
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isSubmitting}
        autoComplete="current-password"
        required
      />

      {error ? (
        <ErrorMessage error={error} onRetry={() => setError(null)} retryLabel="Dismiss" />
      ) : null}

      <Button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? (
          <span className={styles.submitting}>
            <Spinner size="sm" label="Signing in" />
            Signing in...
          </span>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
}
