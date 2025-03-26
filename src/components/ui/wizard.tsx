import React, { useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface WizardProps {
  steps: {
    title: string;
    description?: string;
    content: React.ReactNode;
  }[];
  onComplete?: (currentStepIndex: number) => void;
  completeButtonText?: string;
  nextButtonText?: string;
  previousButtonText?: string;
  className?: string;
}

export function Wizard({
  steps,
  onComplete,
  completeButtonText = "Complete",
  nextButtonText = "Next",
  previousButtonText = "Back",
  className,
}: WizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(currentStepIndex);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    index < currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : index === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {index < currentStepIndex ? "✓" : index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 font-medium",
                    index <= currentStepIndex
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 mx-2",
                    index < currentStepIndex ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">
            {steps[currentStepIndex].title}
          </h3>
          {steps[currentStepIndex].description && (
            <p className="text-sm text-muted-foreground mt-1">
              {steps[currentStepIndex].description}
            </p>
          )}
        </div>

        <div className="mb-6">{steps[currentStepIndex].content}</div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            {previousButtonText}
          </Button>

          {currentStepIndex === steps.length - 1 ? (
            <Button onClick={handleComplete}>{completeButtonText}</Button>
          ) : (
            <Button onClick={handleNext}>{nextButtonText}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
