import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { LoadingSpinner } from "../LoadingSpinner";
import type { CheckoutState } from "../../types/checkout";

interface CardPaymentFormProps {
  totalPrice: number;
  state: CheckoutState;
  onCustomerID: (customerId: number) => void;
}

export function CardPaymentForm({
  totalPrice,
  state,
  onCustomerID,
}: CardPaymentFormProps) {
  const stripe = useStripe(); // Access the Stripe object.
  const elements = useElements(); // Access Stripe Elements.
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log(state);
  const domain = state.domain && state.domain?.name + state.domain?.extension;
  const emailPlan = state.emailPlan;
  const userDetails = state.userDetails;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Retrieve the card element.
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element is not found.");
      setIsProcessing(false);
      return;
    }

    try {
      // Create a payment method.
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: "Customer Name",
        },
      });

      if (error) {
        throw error;
      }

      const paymentMethodId = paymentMethod.id;
      console.log(paymentMethodId);
      const { clientSecret, payment_succeed, newerror } =
        await createPaymentIntent(paymentMethodId, totalPrice);
      console.log({ clientSecret, payment_succeed, newerror });

      if (clientSecret) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );
        if (error) {
          alert("Payment failed.");
          return;
        } else if (paymentIntent.status === "succeeded") {
          const registerDomainResponse = await registerDomain();
          console.log(registerDomainResponse);
          if (registerDomainResponse.response.status) {
            onCustomerID(registerDomainResponse.customerId);
            alert("Domain registered successfully");
          } else {
            alert("Failed to register domain");
          }
        }
      } else if (payment_succeed) {
        const registerDomainResponse = await registerDomain();
        console.log(registerDomainResponse);
        if (registerDomainResponse.response.status) {
          onCustomerID(registerDomainResponse.customerId);
          alert("Domain registered successfully");
        } else {
          alert("Failed to register domain");
        }
      } else if (newerror) {
        alert(newerror);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  async function createPaymentIntent(
    paymentMethodId: string,
    totalPrice: number
  ) {
    try {
      const response = await fetch(
        "https://new-checkout-backend.onrender.com/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentMethodId, totalPrice }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret, payment_succeed, error } = await response.json();
      return { clientSecret, payment_succeed, newerror: error };
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  }

  async function registerDomain() {
    const response = await fetch(
      `https://new-checkout-backend.onrender.com/register-domain`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain,
          emailPlan,
          userDetails,
        }),
      }
    );

    const result = await response.json();
    console.log(result);
    return result;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <div className="mb-4">
        <label>Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-[#003B44] text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Processing payment...</span>
          </div>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
}
