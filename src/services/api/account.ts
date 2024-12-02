import { FLOWLU_CONFIG } from './config';
import { makeFlowluRequest } from './request';
import type { FlowluResponse, FlowluAccountResponse } from './types';
import type { UserDetails } from '../../types/checkout';

export async function createAccount(
  userDetails: UserDetails
): Promise<FlowluResponse<FlowluAccountResponse>> {
  return makeFlowluRequest<FlowluAccountResponse>(FLOWLU_CONFIG.ENDPOINTS.ACCOUNT, {
    type: 1, // Organization = 1
    name: `${userDetails.firstName} ${userDetails.lastName}`,
    first_name: userDetails.firstName,
    last_name: userDetails.lastName,
    phone: userDetails.phone,
    email: userDetails.email,
    billing_country: userDetails.address.country,
    billing_state: userDetails.address.region,
    billing_city: userDetails.address.city,
    billing_zip: userDetails.address.postalCode,
    billing_address_line_1: userDetails.address.line1,
    billing_address_line_2: userDetails.address.line2 || '',
    active: 1,
    status_id: 1,
  });
}