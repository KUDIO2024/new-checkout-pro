import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { STRIPE_CONFIG } from "../../config/stripe";
import { CardPaymentForm } from "./CardPaymentForm";
import type { CheckoutState } from "../../types/checkout";

interface StripeWrapperProps {
  totalPrice: number;
  state: CheckoutState;
  onCustomerID: (customerID: number) => void;
  onPaymentStatus: (paymentStatus: boolean) => void;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  totalPrice,
  state,
  onCustomerID,
  onPaymentStatus,
}) => {
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    const loadStripeAsync = async () => {
      const stripe = await loadStripe(STRIPE_CONFIG.publishableKey);
      setStripePromise(stripe);
    };

    loadStripeAsync();
  }, []);

  if (!stripePromise) {
    return <div>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CardPaymentForm
        totalPrice={totalPrice}
        state={state}
        onCustomerID={onCustomerID}
        onPaymentStatus={onPaymentStatus}
      />
    </Elements>
  );
};

export default StripeWrapper;
