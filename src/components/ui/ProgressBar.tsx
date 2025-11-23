import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting Line background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        
        {/* Colored Line (Progress) */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-brand-600 -z-10 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center bg-gray-50 px-2">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300
                  ${isCompleted ? 'bg-brand-600 border-brand-600 text-white' : ''}
                  ${isCurrent ? 'bg-white border-brand-600 text-brand-600 scale-110 shadow-md ring-4 ring-brand-100' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : step.number}
              </div>
              <span 
                className={`
                  mt-2 text-xs md:text-sm font-semibold absolute -bottom-8 w-32 text-center transition-colors
                  ${isCurrent ? 'text-gray-900' : 'text-gray-500'}
                  ${currentStep > step.number ? 'text-brand-600' : ''}
                `}
              >
                <span className="hidden md:inline">{step.title}</span>
                <span className="md:hidden">{step.title.split(' ')[0]}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};