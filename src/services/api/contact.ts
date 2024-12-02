import { FLOWLU_ENDPOINTS } from './constants';
import { makeRequest } from './request';
import type { FlowluResponse } from './types';
import type { UserDetails } from '../../types/checkout';

export async function createContact(userDetails: UserDetails): Promise<FlowluResponse> {
  return makeRequest(
    FLOWLU_ENDPOINTS.CONTACT,
    {
      type: 2, // Contact = 2
      first_name: userDetails.firstName,
      last_name: userDetails.lastName,
      email: userDetails.email,
      phone: userDetails.phone,
      active: 1,
      status_id: 1,
      is_primary: 1,
      country: userDetails.address.country,
      state: userDetails.address.region,
      city: userDetails.address.city,
      zip: userDetails.address.postalCode,
      address: `${userDetails.address.line1}${userDetails.address.line2 ? '\n' + userDetails.address.line2 : ''}`,
      source_id: 1, // Web form
      industry_id: 7, // Technology
    },
    true
  );
}