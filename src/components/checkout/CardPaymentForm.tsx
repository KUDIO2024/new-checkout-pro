import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { LoadingSpinner } from "../LoadingSpinner";
import type { CheckoutState } from "../../types/checkout";
import { updateOpportunity } from "../../services/api/opportunity";

interface CardPaymentFormProps {
  totalPrice: number;
  state: CheckoutState;
  onCustomerID: (customerId: number) => void;
  onPaymentStatus: (paymentStatus: number) => void;
}

export function CardPaymentForm({
  totalPrice,
  state,
  onCustomerID,
  onPaymentStatus,
}: CardPaymentFormProps) {
  const stripe = useStripe(); // Access the Stripe object.
  const elements = useElements(); // Access Stripe Elements.
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const domain = state.domain && state.domain?.name + state.domain?.extension;
  const emailPlan = state.emailPlan;
  const userDetails = state.userDetails;

  console.log(state);

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
      console.log({ error, paymentMethod });

      if (error) {
        throw error;
      }

      const paymentMethodId = paymentMethod.id;
      const paymentIntentResponse = await createPaymentIntent(
        paymentMethodId,
        totalPrice
      );
      console.log("payment status ", paymentIntentResponse);
      const { clientSecret, payment_succeed, newerror, transactionId } =
        await createPaymentIntent(paymentMethodId, totalPrice);
      console.log("payment status ", {
        clientSecret,
        payment_succeed,
        newerror,
        transactionId,
      });

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
          setError("Payment Failed");
          return;
        } else if (paymentIntent.status === "succeeded") {
          console.log(transactionId);
          onPaymentStatus(1);
          if (state.domain || state.emailPlan) {
            const registerDomainResponse = await registerDomain();
            if (registerDomainResponse.response.status) {
              onCustomerID(registerDomainResponse.customerId);
              setIsProcessing(false);

              const opportunityResponse = await updateOpportunity(
                state,
                transactionId
              );
              if (!opportunityResponse.success) {
                throw new Error("Failed to create opportunity in Flowlu");
              }
            } else {
              setError("Failed to register domain and email");
            }
          }
        }
      } else if (payment_succeed) {
        console.log(transactionId);
        onPaymentStatus(1);
        if (state.domain || state.emailPlan) {
          const registerDomainResponse = await registerDomain();
          if (registerDomainResponse.response.status) {
            onCustomerID(registerDomainResponse.customerId);
            setIsProcessing(false);

            const opportunityResponse = await updateOpportunity(
              state,
              transactionId
            );
            if (!opportunityResponse.success) {
              throw new Error("Failed to create opportunity in Flowlu");
            }
          } else {
            setError("Failed to register domain and email");
          }
        }
      } else if (newerror) {
        onPaymentStatus(2);
        setError(newerror);
      }
    } catch (err) {
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

      const { clientSecret, payment_succeed, transactionId, error } =
        await response.json();
      return { clientSecret, payment_succeed, transactionId, newerror: error };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return {
        clientSecret: null,
        payment_succeed: false,
        transactionId: "",
        newerror: error,
      };
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
