import { useState } from "react";
import { Steps } from "./components/Steps";
import { PlanSelection } from "./components/checkout/PlanSelection";
import { UserRegistration } from "./components/checkout/UserRegistration";
import { DomainRegistration } from "./components/checkout/DomainRegistration";
import { EmailHosting } from "./components/checkout/EmailHosting";
import { Confirmation } from "./components/checkout/Confirmation";
import DomainConfirmation from "./components/checkout/DomainConfirmation";
import type {
  CheckoutState,
  PlanType,
  UserDetails,
  DomainDetails,
  EmailPlan,
  PaymentMethod,
} from "./types/checkout";

const STEPS = ["Plan", "Account", "Domain", "Email", "Confirm"];
const confirmedSTEPS = ["Plan", "Account", "Confirm"];

function App() {
  const [state, setState] = useState<CheckoutState>({
    plan: "monthly",
    userDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
      },
    },
    domain: null,
    emailPlan: null,
    paymentMethod: null,
    currentStep: 0,
    totalPrice: 0,
    customerID: 0,
    showDomainConfirmation: false,
    showDomainConfirmStep: false,
    flowluClientId: 0,
  });

  const handleSelectPlan = (plan: PlanType) => {
    setState((prev) => ({ ...prev, plan }));
  };

  const handleUpdateUserDetails = (userDetails: UserDetails) => {
    setState((prev) => ({ ...prev, userDetails }));
  };

  const handleUpdateDomain = (domain: DomainDetails) => {
    setState((prev) => ({ ...prev, domain }));
  };

  const handleSelectEmailPlan = (emailPlan: EmailPlan) => {
    setState((prev) => ({ ...prev, emailPlan }));
  };

  const handleSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod }));
  };

  const handleNext = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const handleConfirm = () => {
    // Here you would typically integrate with a payment processor
    alert("Order confirmed! Thank you for your purchase.");
  };

  const handleTotalPrice = (totalPrice: number) => {
    setState((prev) => ({ ...prev, totalPrice }));
  };

  const handleCustomerID = (customerID: number) => {
    setState((prev) => ({ ...prev, customerID }));
  };

  const handleShowDomainConfirmation = (showDomainConfirmation: boolean) => {
    setState((prev) => ({ ...prev, showDomainConfirmation }));
  };

  const handleNo = () => {
    setState((prev) => ({
      ...prev,
      showDomainConfirmation: false,
      showDomainConfirmStep: false,
      currentStep: 4,
    }));
  };

  const handleShowDomainConfirmStep = (showDomainConfirmStep: boolean) => {
    setState((prev) => ({
      ...prev,
      showDomainConfirmStep: showDomainConfirmStep,
    }));
  };

  const handleBackFromComfirm = () => {
    if (state.showDomainConfirmStep) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    } else {
      setState((prev) => ({ ...prev, currentStep: 1 }));
    }
  };

  const handleFlowluClientId = (flowluClientId: number) => {
    setState((prev) => ({ ...prev, flowluClientId }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
      <div className="max-w-4xl mx-auto">
        {state.showDomainConfirmStep && (
          <Steps steps={STEPS} currentStep={state.currentStep} />
        )}

        {!state.showDomainConfirmStep && (
          <Steps steps={confirmedSTEPS} currentStep={state.currentStep} />
        )}

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          {state.currentStep === 0 && (
            <PlanSelection
              selectedPlan={state.plan}
              onSelectPlan={handleSelectPlan}
              onNext={handleNext}
            />
          )}

          {!state.showDomainConfirmation && state.currentStep === 1 && (
            <UserRegistration
              userDetails={state.userDetails}
              plan={state.plan}
              onUpdateDetails={handleUpdateUserDetails}
              onBack={handleBack}
              onShowDomainConfirmation={handleShowDomainConfirmation}
              onFlowluClientId={handleFlowluClientId}
            />
          )}

          {state.showDomainConfirmation && (
            <DomainConfirmation
              onNext={handleNext}
              onNo={handleNo}
              onShowDomainConfirmStep={handleShowDomainConfirmStep}
              onShowDomainConfirmation={handleShowDomainConfirmation}
            ></DomainConfirmation>
          )}

          {state.currentStep === 2 && (
            <DomainRegistration
              domain={state.domain}
              onUpdateDomain={handleUpdateDomain}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {state.currentStep === 3 && (
            <EmailHosting
              selectedPlan={state.emailPlan}
              onSelectPlan={handleSelectEmailPlan}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {state.currentStep === 4 && (
            <Confirmation
              state={state}
              onSelectPaymentMethod={handleSelectPaymentMethod}
              onTotalPrice={handleTotalPrice}
              onBack={handleBackFromComfirm}
              onConfirm={handleConfirm}
              onCustomerID={handleCustomerID}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
