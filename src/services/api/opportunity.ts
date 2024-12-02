import { FLOWLU_CONFIG, FLOWLU_ENDPOINTS } from './constants';
import { makeRequest } from './request';
import { FlowluApiError } from './errors';
import { formatCurrency } from '../../utils/currency';
import type { FlowluResponse } from './types';
import type { UserDetails, PlanType } from '../../types/checkout';

function calculateTotals(plan: PlanType) {
  const hosting = plan === 'monthly' 
    ? { price: 15, period: 'per month' }
    : { price: 150, period: 'per year' };
  
  const development = plan === 'monthly' ? 450 : 369;
  const domain = 12;
  const emailHosting = 19.20; // Basic email hosting yearly

  return {
    hosting,
    development,
    domain,
    emailHosting,
    total: hosting.price + development + domain + emailHosting
  };
}

function generateOrderSummary(
  userDetails: UserDetails,
  plan: PlanType
): string {
  const { hosting, development, domain, emailHosting, total } = calculateTotals(plan);

  return `
NEW ORDER SUMMARY
================

Plan Details
-----------
Hosting Plan: ${plan === 'monthly' ? 'Monthly' : 'Yearly'}
Website Development: ${formatCurrency(development)}
Hosting: ${formatCurrency(hosting.price)} ${hosting.period}
Domain Registration (.co.uk): ${formatCurrency(domain)} per year
Email Hosting (Basic): ${formatCurrency(emailHosting)} per year

Total: ${formatCurrency(total)}${plan === 'monthly' ? ' + monthly hosting' : ' per year'}

Email Hosting Features
-------------------
• 1 Email Account
• 2GB Storage
• 25MB Attachment Limit
• Webmail Access
• IMAP/POP3 Support

Customer Details
--------------
Name: ${userDetails.firstName} ${userDetails.lastName}
Email: ${userDetails.email}
Phone: ${userDetails.phone}

Billing Address
--------------
${userDetails.address.line1}
${userDetails.address.line2 ? userDetails.address.line2 + '\n' : ''}${userDetails.address.city}
${userDetails.address.region}
${userDetails.address.postalCode}
${userDetails.address.country}
`.trim();
}

export async function createOpportunity(
  contactId: number,
  userDetails: UserDetails,
  plan: PlanType
): Promise<FlowluResponse> {
  try {
    const now = new Date().toISOString().split('T')[0];
    const { total } = calculateTotals(plan);
    const description = generateOrderSummary(userDetails, plan);

    const opportunityResponse = await makeRequest(
      FLOWLU_ENDPOINTS.OPPORTUNITY,
      {
        name: 'NEW ORDER',
        customer_id: contactId,
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
      throw new FlowluApiError('Failed to create opportunity');
    }

    return opportunityResponse;
  } catch (error) {
    console.error('Error creating opportunity:', error);
    throw error instanceof FlowluApiError ? error : new FlowluApiError('Failed to create opportunity');
  }
}