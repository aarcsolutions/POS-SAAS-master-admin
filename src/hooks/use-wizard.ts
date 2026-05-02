import { useState } from 'react';

interface WizardOptions<T> {
  initialSteps: number;
  initialData: T;
  onComplete: (data: T) => void;
}

/**
 * A generic hook to manage multi-step form state (Wizard).
 * Useful for Tenant Onboarding and other complex flows.
 */
export function useWizard<T>({ initialSteps, initialData, onComplete }: WizardOptions<T>) {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(initialSteps);
  const [formData, setFormData] = useState<T>(initialData);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateData = (newData: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    totalSteps,
    formData,
    nextStep,
    prevStep,
    updateData,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
}
