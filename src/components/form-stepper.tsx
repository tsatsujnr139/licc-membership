import { cn } from "@/lib/utils";

interface FormStepperProps {
  steps: readonly { id: number; label: string }[];
  currentStep: number;
}

export const FormStepper = ({ steps, currentStep }: FormStepperProps) => (
  <div className="flex w-full items-start">
    {steps.map((step, index) => {
      const isActive = step.id === currentStep;
      const isComplete = step.id < currentStep;
      const isFirst = index === 0;
      const isLast = index === steps.length - 1;

      return (
        <div
          key={step.id}
          className="flex min-w-0 flex-1 flex-col items-center gap-2"
        >
          <div className="flex w-full items-center">
            <div
              aria-hidden
              className={cn(
                "h-px flex-1",
                isFirst ? "bg-transparent" : "bg-border"
              )}
            />
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                isActive && "border-primary bg-primary text-primary-foreground",
                isComplete && "border-primary bg-primary/10 text-primary",
                !isActive &&
                  !isComplete &&
                  "border-border bg-muted text-muted-foreground"
              )}
            >
              {step.id}
            </div>
            <div
              aria-hidden
              className={cn(
                "h-px flex-1",
                isLast ? "bg-transparent" : "bg-border"
              )}
            />
          </div>
          <span
            className={cn(
              "max-w-full px-1 text-center text-xs leading-tight",
              isActive ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {step.label}
          </span>
        </div>
      );
    })}
  </div>
);
