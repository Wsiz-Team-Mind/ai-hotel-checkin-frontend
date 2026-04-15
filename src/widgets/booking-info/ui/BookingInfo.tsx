import type { Booking } from '@/entities/booking';
import styles from './BookingInfo.module.scss';

interface BookingInfoProps {
  booking: Booking;
}

function formatDate(value: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BookingInfo({ booking }: BookingInfoProps) {
  const rows: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Guest', value: booking.guestName },
    { label: 'Email', value: booking.guestEmail },
    { label: 'Phone', value: booking.guestPhone },
    { label: 'Room', value: booking.roomNumber },
    { label: 'Check-in', value: formatDate(booking.checkInDate) },
    { label: 'Check-out', value: formatDate(booking.checkOutDate) },
  ];

  return (
    <section className={styles.card} aria-label="Booking details">
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Booking details</h2>
          <p className={styles.subtitle}>Please confirm the information is correct.</p>
        </div>
        {booking.status ? <span className={styles.status}>{booking.status}</span> : null}
      </header>
      <dl className={styles.list}>
        {rows.map((row) => (
          <div className={styles.row} key={row.label}>
            <dt className={styles.term}>{row.label}</dt>
            <dd className={styles.value}>{row.value || '—'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
