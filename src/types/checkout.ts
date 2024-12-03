export type PlanType = "monthly" | "yearly";
export type PaymentMethod = "card" | "invoice";
export type EmailPlan = "basic" | "standard" | "business" | null;

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
}

export interface DomainDetails {
  name: string;
  extension: string;
  available: boolean;
  price: number;
}

export interface CheckoutState {
  plan: PlanType;
  userDetails: UserDetails;
  domain: DomainDetails | null;
  emailPlan: EmailPlan;
  paymentMethod: PaymentMethod | null;
  currentStep: number;
  totalPrice: number;
  customerID: number;
  showDomainConfirmation: boolean;
  showDomainConfirmStep: boolean;
  flowluClientId: number;
}
