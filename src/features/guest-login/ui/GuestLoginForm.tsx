import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginBooking } from '@/entities/booking';
import { toApiError } from '@/shared/api';
import { Button } from '@/shared/ui/Button';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { Input } from '@/shared/ui/Input';
import { Spinner } from '@/shared/ui/Spinner';
import styles from './GuestLoginForm.module.scss';

export function GuestLoginForm() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const trimmed = bookingId.trim();
  const isValid = trimmed.length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await loginBooking({ bookingId: trimmed });
      navigate(`/checkin/${encodeURIComponent(trimmed)}`);
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Booking ID"
        placeholder="e.g. BK-123456"
        value={bookingId}
        onChange={(event) => setBookingId(event.target.value)}
        disabled={isSubmitting}
        autoFocus
        autoComplete="off"
        required
        hint="You can find the booking ID in your confirmation email."
      />

      {error ? <ErrorMessage error={error} onRetry={() => setError(null)} retryLabel="Dismiss" /> : null}

      <Button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? (
          <span className={styles.submitting}>
            <Spinner size="sm" label="Checking booking" />
            Checking...
          </span>
        ) : (
          'Continue'
        )}
      </Button>
    </form>
  );
}
