import { Check } from "lucide-react";
import { cn } from "../utils/cn";

interface StepsProps {
  steps: string[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center w-full mb-8 px-4">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center mb-4 md:mb-0">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                index < currentStep
                  ? "bg-[#003B44] border-[#003B44] text-white"
                  : index === currentStep
                  ? "border-[#003B44] text-[#003B44]"
                  : "border-gray-300 text-gray-300"
              )}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1",
                index <= currentStep ? "text-[#003B44]" : "text-gray-400"
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-8 md:w-12 mx-2",
                index < currentStep ? "bg-[#003B44]" : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
