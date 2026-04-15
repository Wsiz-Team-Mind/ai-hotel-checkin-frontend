import styles from './Stepper.module.scss';

export interface StepperStep {
  id: string;
  label: string;
}

interface StepperProps {
  steps: ReadonlyArray<StepperStep>;
  activeIndex: number;
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, activeIndex, onStepClick }: StepperProps) {
  return (
    <ol className={styles.list} aria-label="Progress">
      {steps.map((step, index) => {
        const state =
          index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'pending';
        const clickable = Boolean(onStepClick) && index < activeIndex;

        return (
          <li
            key={step.id}
            className={`${styles.item} ${styles[`item--${state}`]}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <button
              type="button"
              className={styles.button}
              onClick={clickable ? () => onStepClick?.(index) : undefined}
              disabled={!clickable}
            >
              <span className={styles.bullet} aria-hidden="true">
                {state === 'done' ? '✓' : index + 1}
              </span>
              <span className={styles.label}>{step.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
