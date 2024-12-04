import { FLOWLU_CONFIG, FLOWLU_ENDPOINTS } from "./constants";
import { makeRequest } from "./request";
import { FlowluApiError } from "./errors";
import { formatCurrency } from "../../utils/currency";
import type { FlowluResponse } from "./types";
import type { CheckoutState } from "../../types/checkout";

function generateOrderSummary(
  state: CheckoutState,
  transactionId: string
): string {
  const development = state.plan === "monthly" ? 450 : 369;
  const hosting = {
    price: state.plan === "monthly" ? 15 : 150,
    period: state.plan === "monthly" ? "per month" : "per year",
  };
  const emailPlan = state.emailPlan ? state.emailPlan : "";
  let emailHosting = 0;
  switch (state.emailPlan) {
    case "basic":
      emailHosting = 19.2;
      break;
    case "standard":
      emailHosting = 43.2;
      break;
    case "business":
      emailHosting = 69.99;
      break;
    default:
      emailHosting = 0;
      break;
  }
  const mailAccounts = state.emailPlan
    ? state?.emailPlan === "basic"
      ? 1
      : state?.emailPlan === "standard"
      ? 10
      : "unlimited"
    : "";
  const domainName = state.domain
    ? state.domain.name + state.domain.extension
    : "";
  const domainPrice = state.domain ? (state.domain.price * 3.36).toFixed(2) : 0;
  const paymentMethod =
    state?.paymentMethod === "card"
      ? `Paid by card - Transaction ID: ${transactionId}`
      : "Invoice Payment";

  return `
NEW ORDER SUMMARY
================

Plan Details
-----------
Hosting Plan: ${state.plan === "monthly" ? "Monthly" : "Yearly"}
Website Development: ${formatCurrency(development)}
Hosting: ${formatCurrency(hosting.price)} ${hosting.period}
Domain Registration (${domainName}): ${formatCurrency(domainPrice)} per year
Email Hosting (${emailPlan}): ${formatCurrency(emailHosting)} per year

Total: ${formatCurrency(state.totalPrice)}${
    state.plan === "monthly" ? " per month" : " per year"
  }

${
  state.emailPlan &&
  `Email Hosting Features
-------------------
• ${mailAccounts} Email Account(s)
• 2GB Storage
• 25MB Attachment Limit
• Webmail Access
• IMAP/POP3 Support`
}

Customer Details
--------------
Name: ${state.userDetails.firstName} ${state.userDetails.lastName}
Email: ${state.userDetails.email}
Phone: ${state.userDetails.phone}

Billing Address
--------------
${state.userDetails.address.line1}
${
  state.userDetails.address.line2 ? state.userDetails.address.line2 + "\n" : ""
}${state.userDetails.address.city}
${state.userDetails.address.region}
${state.userDetails.address.postalCode}
${state.userDetails.address.country}

Payment Method
--------------
${paymentMethod}
`.trim();
}

export async function createOpportunity(
  state: CheckoutState
): Promise<FlowluResponse> {
  try {
    const now = new Date().toISOString().split("T")[0];
    const total = state.totalPrice;
    const description = generateOrderSummary(state);

    const opportunityResponse = await makeRequest(
      FLOWLU_ENDPOINTS.OPPORTUNITY,
      {
        name: "NEW ORDER",
        customer_id: state.flowluClientId,
        assignee_id: FLOWLU_CONFIG.ASSIGNEE_ID,
        start_date: now,
        created_date: now,
        pipeline_id: FLOWLU_CONFIG.PIPELINE_ID,
        pipeline_stage_id: FLOWLU_CONFIG.PIPELINE_STAGE_ID,
        amount: total,
        currency_id: FLOWLU_CONFIG.CURRENCY_ID,
        probability: 100,
        description,
      },
      true
    );

    if (!opportunityResponse.success || !opportunityResponse.data?.id) {
      throw new FlowluApiError("Failed to create opportunity");
    }

    return opportunityResponse;
  } catch (error) {
    console.error("Error creating opportunity:", error);
    throw error instanceof FlowluApiError
      ? error
      : new FlowluApiError("Failed to create opportunity");
  }
}

export async function updateOpportunity(
  state: CheckoutState,
  transactionId: string
): Promise<FlowluResponse> {
  try {
    const total = state.totalPrice;
    const description = generateOrderSummary(state, transactionId);

    const opportunityResponse = await makeRequest(
      FLOWLU_ENDPOINTS.OPPORTUNITY_UPDATE + `/${state.opportunityId}`,
      {
        budget: total,
        description,
      },
      true
    );

    if (!opportunityResponse.success || !opportunityResponse.data?.id) {
      throw new FlowluApiError("Failed to create opportunity");
    }

    return opportunityResponse;
  } catch (error) {
    console.error("Error creating opportunity:", error);
    throw error instanceof FlowluApiError
      ? error
      : new FlowluApiError("Failed to create opportunity");
  }
}
