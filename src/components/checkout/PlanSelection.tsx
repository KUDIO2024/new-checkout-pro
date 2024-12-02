import { Server } from 'lucide-react';
import { Button } from '../Button';
import { PlanType } from '../../types/checkout';

interface PlanSelectionProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onNext: () => void;
}

export function PlanSelection({
  selectedPlan,
  onSelectPlan,
  onNext,
}: PlanSelectionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedPlan === 'monthly'
              ? 'border-[#003B44] bg-[#003B44]/10'
              : 'border-gray-200 hover:border-[#003B44]/50'
          }`}
          onClick={() => onSelectPlan('monthly')}
        >
          <Server className="w-8 h-8 mb-4 text-[#003B44]" />
          <h3 className="text-xl font-semibold mb-2">Monthly Plan</h3>
          <p className="text-gray-600 mb-4">
            Flexible monthly billing with no long-term commitment
          </p>
          <div className="space-y-2">
            <p className="text-2xl font-bold">£15/month</p>
            <p className="text-lg text-[#003B44]">Website Development: £450</p>
          </div>
        </div>
        <div
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedPlan === 'yearly'
              ? 'border-[#003B44] bg-[#003B44]/10'
              : 'border-gray-200 hover:border-[#003B44]/50'
          }`}
          onClick={() => onSelectPlan('yearly')}
        >
          <Server className="w-8 h-8 mb-4 text-[#003B44]" />
          <h3 className="text-xl font-semibold mb-2">Yearly Plan</h3>
          <p className="text-gray-600 mb-4">
            Save with annual billing
          </p>
          <div className="space-y-2">
            <p className="text-2xl font-bold">£150/year</p>
            <p className="text-lg text-[#003B44]">Website Development: £369</p>
            <p className="text-sm text-green-600">Save £30</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
}