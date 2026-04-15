import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { DocumentsData } from '@/entities/checkin';
import { Button } from '@/shared/ui/Button';
import styles from './DocumentsForm.module.scss';

interface DocumentsFormProps {
  initialValue?: DocumentsData;
  onSubmit: (data: Required<DocumentsData>) => void;
  onBack?: () => void;
  submitLabel?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function DocumentsForm({
  initialValue,
  onSubmit,
  onBack,
  submitLabel = 'Continue',
}: DocumentsFormProps) {
  const [passport, setPassport] = useState<string | null>(initialValue?.passportImage ?? null);
  const [selfie, setSelfie] = useState<string | null>(initialValue?.selfieImage ?? null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be under 5 MB.');
      event.target.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      event.target.value = '';
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setter(base64);
      setError(null);
    } catch {
      setError('Could not read the image. Please try another file.');
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!passport || !selfie) {
      setError('Please upload both your passport and a selfie.');
      return;
    }
    onSubmit({ passportImage: passport, selfieImage: selfie });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="passport-upload">
            Passport photo
          </label>
          <input
            id="passport-upload"
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={(event) => handleFile(event, setPassport)}
          />
          {passport ? (
            <img src={passport} alt="Passport preview" className={styles.preview} />
          ) : (
            <div className={styles.placeholder}>Upload a photo of your passport page</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="selfie-upload">
            Selfie
          </label>
          <input
            id="selfie-upload"
            type="file"
            accept="image/*"
            capture="user"
            className={styles.fileInput}
            onChange={(event) => handleFile(event, setSelfie)}
          />
          {selfie ? (
            <img src={selfie} alt="Selfie preview" className={styles.preview} />
          ) : (
            <div className={styles.placeholder}>Take a clear selfie so we can verify it's you</div>
          )}
        </div>
      </div>

      {error ? (
        <div className={styles.error} role="alert">
          {error}
        </div>
      ) : null}

      <div className={styles.actions}>
        {onBack ? (
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
        ) : null}
        <Button type="submit" disabled={!passport || !selfie}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
