// ============================================================================
// STEPPER - Multi-step wizard component
// ============================================================================

import * as React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface StepperStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  allowClickableSteps?: boolean;
  className?: string;
}

interface StepperContentProps {
  children: React.ReactNode;
  stepIndex: number;
  currentStep: number;
}

interface StepperActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  completeLabel?: string;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepChange,
  orientation = 'horizontal',
  allowClickableSteps = false,
  className,
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal';

  const handleStepClick = (index: number) => {
    if (allowClickableSteps && index <= currentStep) {
      onStepChange?.(index);
    }
  };

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-start' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = allowClickableSteps && index <= currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex',
                isHorizontal ? 'flex-col items-center' : 'flex-row items-start gap-4',
                isClickable && 'cursor-pointer'
              )}
              onClick={() => handleStepClick(index)}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary bg-background text-primary',
                  !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step content */}
              <div
                className={cn(
                  isHorizontal ? 'mt-2 text-center' : '',
                  'min-w-0'
                )}
              >
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCurrent && 'text-primary',
                    !isCurrent && !isCompleted && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                  {step.optional && (
                    <span className="ml-1 text-xs text-muted-foreground">(Opcional)</span>
                  )}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1',
                  isHorizontal
                    ? 'mx-4 mt-5 h-0.5 min-w-8'
                    : 'ml-5 my-2 w-0.5 min-h-8',
                  index < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function StepperContent({ children, stepIndex, currentStep }: StepperContentProps) {
  if (stepIndex !== currentStep) return null;
  return <div className="mt-6">{children}</div>;
}

export function StepperActions({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onComplete,
  isNextDisabled = false,
  isPreviousDisabled = false,
  nextLabel = 'Siguiente',
  previousLabel = 'Anterior',
  completeLabel = 'Completar',
  className,
}: StepperActionsProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className={cn('flex justify-between mt-6', className)}>
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isPreviousDisabled}
      >
        {previousLabel}
      </Button>

      {isLastStep ? (
        <Button onClick={onComplete} disabled={isNextDisabled}>
          {completeLabel}
        </Button>
      ) : (
        <Button onClick={onNext} disabled={isNextDisabled}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}
