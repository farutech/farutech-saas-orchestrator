import { clsx } from 'clsx';
import React, { useState } from 'react';

export interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  allowClickAhead?: boolean;
  errorSteps?: number[];
  className?: string;
}

type StepStatus = 'pending' | 'active' | 'completed' | 'error';

const statusStyles: Record<StepStatus, { circle: string; label: string; line: string }> = {
  pending: {
    circle:
      'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400',
    label: 'text-gray-500 dark:text-gray-400',
    line: 'bg-gray-300 dark:bg-gray-600',
  },
  active: {
    circle:
      'bg-primary-600 dark:bg-primary-500 border-2 border-primary-600 dark:border-primary-500 text-white',
    label: 'text-primary-600 dark:text-primary-400 font-semibold',
    line: 'bg-gray-300 dark:bg-gray-600',
  },
  completed: {
    circle:
      'bg-primary-600 dark:bg-primary-500 border-2 border-primary-600 dark:border-primary-500 text-white',
    label: 'text-gray-700 dark:text-gray-300',
    line: 'bg-primary-600 dark:bg-primary-500',
  },
  error: {
    circle:
      'bg-red-100 dark:bg-red-900/30 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400',
    label: 'text-red-600 dark:text-red-400',
    line: 'bg-gray-300 dark:bg-gray-600',
  },
};

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  allowClickAhead = false,
  errorSteps = [],
  className,
}) => {
  const isVertical = orientation === 'vertical';

  const getStepStatus = (index: number): StepStatus => {
    if (errorSteps.includes(index)) return 'error';
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const canClickStep = (index: number) => {
    if (!onStepClick) return false;
    if (index === currentStep) return false;
    if (allowClickAhead) return true;
    return index < currentStep;
  };

  return (
    <nav aria-label="Progress" className={className}>
      <ol className={clsx('flex', isVertical ? 'flex-col gap-4' : 'flex-row items-center')}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const styles = statusStyles[status];
          const clickable = canClickStep(index);
          const isLast = index === steps.length - 1;

          return (
            <li
              key={index}
              className={clsx(
                'relative',
                isVertical ? 'flex flex-col pb-4' : 'flex flex-1 items-center'
              )}
            >
              {isVertical ? (
                <>
                  <button
                    type="button"
                    className={clsx(
                      'flex items-center gap-3 group',
                      clickable && 'cursor-pointer hover:opacity-80',
                      !clickable && 'cursor-default'
                    )}
                    onClick={() => clickable && onStepClick?.(index)}
                    disabled={!clickable}
                  >
                    <div
                      className={clsx(
                        'flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all duration-200',
                        styles.circle,
                        clickable && 'group-hover:scale-110'
                      )}
                    >
                      {status === 'completed' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : step.icon ? (
                        <div className="w-5 h-5">{step.icon}</div>
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span
                        className={clsx(
                          'text-sm font-medium transition-colors break-words',
                          styles.label
                        )}
                      >
                        {step.label}
                        {step.optional && (
                          <span className="ml-1 text-xs text-gray-400">(Opcional)</span>
                        )}
                      </span>
                      {step.description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                          {step.description}
                        </span>
                      )}
                    </div>
                  </button>
                  {!isLast && (
                    <div
                      className={clsx(
                        'absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 transition-colors duration-200',
                        statusStyles[getStepStatus(index)].line
                      )}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                    <button
                      type="button"
                      className={clsx(
                        'flex flex-col items-center gap-2 group',
                        clickable && 'cursor-pointer hover:opacity-80',
                        !clickable && 'cursor-default'
                      )}
                      onClick={() => clickable && onStepClick?.(index)}
                      disabled={!clickable}
                    >
                      <div
                        className={clsx(
                          'flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all duration-200',
                          styles.circle,
                          clickable && 'group-hover:scale-110'
                        )}
                      >
                        {status === 'completed' ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : step.icon ? (
                          <div className="w-5 h-5">{step.icon}</div>
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex flex-col text-center max-w-[120px]">
                        <span
                          className={clsx(
                            'text-sm font-medium transition-colors break-words',
                            styles.label
                          )}
                        >
                          {step.label}
                          {step.optional && (
                            <span className="ml-1 text-xs text-gray-400 block">(Opcional)</span>
                          )}
                        </span>
                        {step.description && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                            {step.description}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                  {!isLast && (
                    <div
                      className={clsx(
                        'flex-1 h-0.5 mx-4 transition-colors duration-200',
                        statusStyles[getStepStatus(index)].line
                      )}
                    />
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Stepper.displayName = 'Stepper';

export function useStepper(totalSteps: number, initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goTo = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const reset = () => {
    setCurrentStep(0);
  };

  return {
    currentStep,
    next,
    prev,
    goTo,
    reset,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100,
  };
}
