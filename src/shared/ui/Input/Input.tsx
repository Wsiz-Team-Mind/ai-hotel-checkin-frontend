import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = '', ...props },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const describedById = error || hint ? `${inputId}-desc` : undefined;

  return (
    <div className={styles.field}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById}
        className={`${styles.input} ${error ? styles['input--error'] : ''} ${className}`}
        {...props}
      />
      {error ? (
        <span id={describedById} className={styles.error} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={describedById} className={styles.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
});
