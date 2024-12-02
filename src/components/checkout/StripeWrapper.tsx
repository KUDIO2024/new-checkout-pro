import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { STRIPE_CONFIG } from "../../config/stripe";
import { CardPaymentForm } from "./CardPaymentForm";
import type { CheckoutState } from "../../types/checkout";

const stripePromise = await loadStripe(STRIPE_CONFIG.publishableKey);

interface StripeWrapperProps {
  totalPrice: number;
  state: CheckoutState;
  onCustomerID: (customerID: number) => void;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  totalPrice,
  state,
  onCustomerID,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <CardPaymentForm
        totalPrice={totalPrice}
        state={state}
        onCustomerID={onCustomerID}
      />
    </Elements>
  );
};

export default StripeWrapper;
