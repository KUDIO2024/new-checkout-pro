import { Check } from "lucide-react";
import { Button } from "../Button";
import { PaymentSelection } from "./PaymentSelection";
import type { CheckoutState, PaymentMethod } from "../../types/checkout";
import { useEffect } from "react";

interface ConfirmationProps {
  state: CheckoutState;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onTotalPrice: (totalPrice: number) => void;
  onBack: () => void;
  onConfirm: () => void;
  onCustomerID: (customerID: number) => void;
}

export function Confirmation({
  state,
  onSelectPaymentMethod,
  onBack,
  onConfirm,
  onTotalPrice,
  onCustomerID,
}: ConfirmationProps) {
  const getHostingPrice = () =>
    state.plan === "monthly" ? "£15/month" : "£150/year";
  const getWebDevPrice = () => (state.plan === "monthly" ? "£450" : "£369");
  const getEmailPrice = () => {
    switch (state.emailPlan) {
      case "basic":
        return "£19.20/year";
      case "standard":
        return "£43.20/year";
      case "business":
        return "£69.99/year";
      default:
        return "£0";
    }
  };

  const getEmailPlanName = () => {
    switch (state.emailPlan) {
      case "basic":
        return "Basic";
      case "standard":
        return "Standard";
      case "business":
        return "Business";
      default:
        return "None";
    }
  };

  const hostingPrice = parseFloat(
    getHostingPrice().match(/\d+(\.\d+)?/)?.[0] || "0"
  );
  const webDevPrice = parseFloat(
    getWebDevPrice().match(/\d+(\.\d+)?/)?.[0] || "0"
  );
  const emailPrice = parseFloat(
    getEmailPrice().match(/\d+(\.\d+)?/)?.[0] || "0"
  );
  const domainPrice = (state.domain?.price && state.domain?.price * 3.36) || 0;
  const totalPrice: number = parseFloat(
    (hostingPrice + webDevPrice + emailPrice + domainPrice).toFixed(2)
  );

  const username =
    state.userDetails.firstName +
    state.userDetails.lastName +
    Math.floor(1000 + Math.random() * 9000).toString();
  useEffect(() => {
    if (onTotalPrice) {
      onTotalPrice(totalPrice);
    }
  }, [totalPrice]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Review Your Order</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Hosting Plan ({state.plan})</span>
            <span className="font-medium">{getHostingPrice()}</span>
          </div>
          <div className="flex justify-between">
            <span>Website Development</span>
            <span className="font-medium">{getWebDevPrice()}</span>
          </div>
          {state.domain && (
            <div className="flex justify-between">
              <span>
                Domain Registration ({state.domain?.name}
                {state.domain?.extension})
              </span>
              <span className="font-medium">£{domainPrice}/year</span>
            </div>
          )}
          {state.emailPlan && (
            <div className="flex justify-between">
              <span>Email Hosting ({getEmailPlanName()})</span>
              <span className="font-medium">{getEmailPrice()}</span>
            </div>
          )}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>£{totalPrice}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Setup fees include one-time website development and yearly domain
              costs
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Account Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">
              {state.userDetails.firstName} {state.userDetails.lastName}
            </p>
            <p className="font-medium">
              Customer ID: {state.customerID !== 0 && state.customerID}
            </p>
            <p className="font-medium">
              Username: {state.customerID !== 0 && username}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{state.userDetails.email}</p>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{state.userDetails.phone}</p>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">{state.userDetails.address.line1}</p>
            {state.userDetails.address.line2 && (
              <p className="font-medium">{state.userDetails.address.line2}</p>
            )}
            <p className="font-medium">
              {state.userDetails.address.city},{" "}
              {state.userDetails.address.region}{" "}
              {state.userDetails.address.postalCode}
            </p>
            <p className="font-medium">{state.userDetails.address.country}</p>
          </div>
          <div></div>
        </div>

        <div className="mt-4"></div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <PaymentSelection
          selectedMethod={state.paymentMethod}
          onSelectMethod={onSelectPaymentMethod}
          totalPrice={totalPrice}
          state={state}
          onCustomerID={onCustomerID}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onConfirm} disabled={!state.paymentMethod}>
          Confirm Order
        </Button>
      </div>
    </div>
  );
}
