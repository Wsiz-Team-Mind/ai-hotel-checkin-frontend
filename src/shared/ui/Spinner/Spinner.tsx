import type { HTMLAttributes } from 'react';
import styles from './Spinner.module.scss';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: string;
  fullscreen?: boolean;
}

export function Spinner({
  size = 'md',
  label = 'Loading',
  fullscreen = false,
  className = '',
  ...props
}: SpinnerProps) {
  const containerClass = [
    styles.container,
    fullscreen ? styles['container--fullscreen'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass} role="status" aria-live="polite" {...props}>
      <span
        className={`${styles.spinner} ${styles[`spinner--${size}`]}`}
        aria-hidden="true"
      />
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
