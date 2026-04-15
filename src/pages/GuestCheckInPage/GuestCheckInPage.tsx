import { useCallback, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getBooking } from '@/entities/booking';
import { startCheckIn, type DocumentsData, type PersonalData } from '@/entities/checkin';
import { DocumentsForm } from '@/features/checkin-documents';
import { PersonalDataForm } from '@/features/checkin-personal-data';
import { toApiError } from '@/shared/api';
import { useApi } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/Button';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { Spinner } from '@/shared/ui/Spinner';
import { Stepper, type StepperStep } from '@/shared/ui/Stepper';
import { BookingInfo } from '@/widgets/booking-info';
import styles from './GuestCheckInPage.module.scss';

type StepId = 'confirm' | 'personal' | 'documents' | 'review' | 'done';

const STEPS: ReadonlyArray<StepperStep> = [
  { id: 'confirm', label: '1. Booking' },
  { id: 'personal', label: '2. Personal' },
  { id: 'documents', label: '3. Documents' },
  { id: 'review', label: '4. Review' },
];

export function GuestCheckInPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const {
    data: booking,
    isLoading,
    error: bookingError,
    refetch,
  } = useApi(
    (signal) => getBooking(bookingId!, signal),
    { enabled: Boolean(bookingId), deps: [bookingId] },
  );

  const [step, setStep] = useState<StepId>('confirm');
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [documents, setDocuments] = useState<DocumentsData>({
    passportImage: null,
    selfieImage: null,
  });
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goTo = useCallback((next: StepId) => {
    setStep(next);
    setSubmitError(null);
  }, []);

  const handleStepClick = useCallback(
    (index: number) => {
      const target = STEPS[index];
      if (!target) return;
      goTo(target.id as StepId);
    },
    [goTo],
  );

  const handleSubmit = useCallback(async () => {
    if (!booking || !documents.passportImage || !documents.selfieImage) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await startCheckIn({
        bookingId: booking.id ?? bookingId!,
        passportImage: documents.passportImage,
        selfieImage: documents.selfieImage,
      });
      setStep('done');
    } catch (err) {
      setSubmitError(toApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [booking, bookingId, documents]);

  if (!bookingId) {
    return <Navigate to="/checkin" replace />;
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" label="Loading your booking" />
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className={styles.errorBlock}>
        <ErrorMessage
          error={bookingError ?? 'Booking not found'}
          onRetry={refetch}
          title="Could not load booking"
        />
        <Button variant="secondary" onClick={() => navigate('/checkin')}>
          Back to login
        </Button>
      </div>
    );
  }

  const activeIndex = step === 'done' ? STEPS.length : STEPS.findIndex((s) => s.id === step);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Check-in</h1>
        <p className={styles.subtitle}>Complete the steps below to finish your check-in.</p>
      </header>

      <Stepper steps={STEPS} activeIndex={activeIndex} onStepClick={handleStepClick} />

      <div className={styles.content}>
        {step === 'confirm' && (
          <>
            <BookingInfo booking={booking} />
            <div className={styles.actions}>
              <Button onClick={() => goTo('personal')}>Confirm and continue</Button>
            </div>
          </>
        )}

        {step === 'personal' && (
          <PersonalDataForm
            initialValue={personalData ?? undefined}
            onSubmit={(data) => {
              setPersonalData(data);
              goTo('documents');
            }}
            onBack={() => goTo('confirm')}
          />
        )}

        {step === 'documents' && (
          <DocumentsForm
            initialValue={documents}
            onSubmit={(data) => {
              setDocuments(data);
              goTo('review');
            }}
            onBack={() => goTo('personal')}
          />
        )}

        {step === 'review' && (
          <div className={styles.review}>
            <BookingInfo booking={booking} />
            {personalData ? (
              <section className={styles.summary}>
                <h2 className={styles.summaryTitle}>Personal data</h2>
                <p>
                  <strong>{personalData.name}</strong> {personalData.surname}
                </p>
              </section>
            ) : null}
            <section className={styles.summary}>
              <h2 className={styles.summaryTitle}>Documents</h2>
              <div className={styles.previews}>
                {documents.passportImage ? (
                  <img src={documents.passportImage} alt="Passport" className={styles.preview} />
                ) : null}
                {documents.selfieImage ? (
                  <img src={documents.selfieImage} alt="Selfie" className={styles.preview} />
                ) : null}
              </div>
            </section>

            {submitError ? (
              <ErrorMessage error={submitError} onRetry={handleSubmit} retryLabel="Retry" />
            ) : null}

            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => goTo('documents')} disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit check-in'}
              </Button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className={styles.done}>
            <h2>✓ Check-in submitted</h2>
            <p>Your information has been sent. Reception will confirm shortly.</p>
            <Button onClick={() => navigate('/')}>Back to home</Button>
          </div>
        )}
      </div>
    </div>
  );
}
