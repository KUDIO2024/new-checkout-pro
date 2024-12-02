import { Mail } from 'lucide-react';
import { Button } from '../Button';
import type { EmailPlan } from '../../types/checkout';

interface EmailHostingProps {
  selectedPlan: EmailPlan;
  onSelectPlan: (plan: EmailPlan) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EmailHosting({
  selectedPlan,
  onSelectPlan,
  onNext,
  onBack,
}: EmailHostingProps) {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '19.20',
      features: [
        '1 Account',
        '2GB Storage',
        '25Mb Attachment',
      ],
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '43.20',
      features: [
        '10 Accounts',
        '2GB Storage',
        '25Mb Attachment',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: '69.99',
      features: [
        'Unlimited Accounts',
        '2GB Storage',
        '25Mb Attachment',
      ],
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Choose Email Hosting Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-[#003B44] bg-[#003B44]/10'
                : 'border-gray-200 hover:border-[#003B44]/50'
            }`}
            onClick={() => onSelectPlan(plan.id as EmailPlan)}
          >
            <Mail className="w-8 h-8 mb-4 text-[#003B44]" />
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold mb-4">£{plan.price}/year</p>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-gray-600">
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!selectedPlan}>
          Continue
        </Button>
      </div>
    </div>
  );
}