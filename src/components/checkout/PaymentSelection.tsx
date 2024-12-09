import { CreditCard, FileText } from "lucide-react";
import StripeWrapper from "./StripeWrapper";
import type { CheckoutState, PaymentMethod } from "../../types/checkout";

interface PaymentSelectionProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  totalPrice: number;
  state: CheckoutState;
  onCustomerID: (customerID: number) => void;
  onPaymentStatus: (paymentStatus: number) => void;
}

export function PaymentSelection({
  selectedMethod,
  onSelectMethod,
  totalPrice,
  state,
  onCustomerID,
  onPaymentStatus,
}: PaymentSelectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedMethod === "card"
              ? "border-[#003B44] bg-[#003B44]/10"
              : "border-gray-200 hover:border-[#003B44]/50"
          }`}
          onClick={() => onSelectMethod("card")}
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-[#003B44]" />
            <span className="font-medium">Pay by Card</span>
          </div>
          <p className="text-sm text-gray-600">
            Secure payment via credit/debit card
          </p>
        </div>

        <div
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedMethod === "invoice"
              ? "border-[#003B44] bg-[#003B44]/10"
              : "border-gray-200 hover:border-[#003B44]/50"
          }`}
          onClick={() => onSelectMethod("invoice")}
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#003B44]" />
            <span className="font-medium">Pay by Invoice</span>
          </div>
          <p className="text-sm text-gray-600">
            Receive an invoice for bank transfer
          </p>
        </div>
      </div>

      {selectedMethod === "card" && (
        <div className="mt-6 p-6 border border-gray-200 rounded-lg">
          <StripeWrapper
            totalPrice={totalPrice}
            state={state}
            onCustomerID={onCustomerID}
            onPaymentStatus={onPaymentStatus}
          />
        </div>
      )}

      {selectedMethod === "invoice" && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 mb-2">
            We will begin your project straight away after our first initial
            call. You will be sent an invoice which will have to be paid within
            14 days from today. Please note, your domain and email hosting will
            not be registered until invoice is settled.
          </p>
          <p className="text-sm text-blue-600">
            Please note: Late fees apply - see Terms and Conditions.
          </p>
        </div>
      )}
    </div>
  );
}
