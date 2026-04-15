import { useState, type FormEvent } from 'react';
import type { PersonalData } from '@/entities/checkin';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import styles from './PersonalDataForm.module.scss';

interface PersonalDataFormProps {
  initialValue?: PersonalData;
  onSubmit: (data: PersonalData) => void;
  onBack?: () => void;
  submitLabel?: string;
}

interface FieldErrors {
  name?: string;
  surname?: string;
}

export function PersonalDataForm({
  initialValue,
  onSubmit,
  onBack,
  submitLabel = 'Continue',
}: PersonalDataFormProps) {
  const [name, setName] = useState(initialValue?.name ?? '');
  const [surname, setSurname] = useState(initialValue?.surname ?? '');
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!surname.trim()) next.surname = 'Surname is required';
    return next;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({ name: name.trim(), surname: surname.trim() });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <Input
          label="First name"
          placeholder="John"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          autoComplete="given-name"
          required
        />
        <Input
          label="Surname"
          placeholder="Doe"
          value={surname}
          onChange={(event) => setSurname(event.target.value)}
          error={errors.surname}
          autoComplete="family-name"
          required
        />
      </div>

      <div className={styles.actions}>
        {onBack ? (
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
