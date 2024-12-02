import { useState } from 'react';
import type { CheckoutState, PlanType, UserDetails, DomainDetails } from '../types/checkout';

const initialState: CheckoutState = {
  plan: 'monthly',
  userDetails: {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
  },
  domain: null,
  currentStep: 0,
};

export function useCheckoutState() {
  const [state, setState] = useState<CheckoutState>(initialState);

  const handleSelectPlan = (plan: PlanType) => {
    setState((prev) => ({ ...prev, plan }));
  };

  const handleUpdateUserDetails = (userDetails: UserDetails) => {
    setState((prev) => ({ ...prev, userDetails }));
  };

  const handleUpdateDomain = (domain: DomainDetails) => {
    setState((prev) => ({ ...prev, domain }));
  };

  const handleNext = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  return {
    state,
    handleSelectPlan,
    handleUpdateUserDetails,
    handleUpdateDomain,
    handleNext,
    handleBack,
  };
}