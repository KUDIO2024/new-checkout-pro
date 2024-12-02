import { UserDetails } from '../types/checkout';

const FLOWLU_API_KEY = 'RmFLYnowblNWNXp5eXh6UDBPNGF5ZXdVOW1UUjdlekxfMTExMjc5';
const FLOWLU_BASE_URL = 'https://kudio.flowlu.com/api/v1';

interface FlowluResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
  };
}

export async function createFlowluClient(userDetails: UserDetails): Promise<FlowluResponse> {
  try {
    // Create an account
    const accountResponse = await fetch(`${FLOWLU_BASE_URL}/crm/account/create?api_key=${FLOWLU_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        type_id: 1, // Client type
        industry_id: 7, // Technology industry
        country: userDetails.address.country,
        state: userDetails.address.region,
        city: userDetails.address.city,
        zip: userDetails.address.postalCode,
        address: `${userDetails.address.line1}${userDetails.address.line2 ? '\n' + userDetails.address.line2 : ''}`,
        phone: userDetails.phone,
        email: userDetails.email,
        status_id: 1, // Active status
      }),
    });

    const accountData = await accountResponse.json();

    if (!accountData.success) {
      throw new Error(`Failed to create account: ${JSON.stringify(accountData.errors || accountData)}`);
    }

    // Create a contact for the account
    const contactResponse = await fetch(`${FLOWLU_BASE_URL}/crm/contact/create?api_key=${FLOWLU_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_id: accountData.data.id,
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        email: userDetails.email,
        phone: userDetails.phone,
        is_primary: 1,
        status_id: 1, // Active status
      }),
    });

    const contactData = await contactResponse.json();

    if (!contactData.success) {
      throw new Error(`Failed to create contact: ${JSON.stringify(contactData.errors || contactData)}`);
    }

    return accountData;
  } catch (error) {
    console.error('Error creating Flowlu client:', error);
    throw error;
  }
}