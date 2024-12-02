import { createContact } from './contact';
import { createOpportunity } from './opportunity';
import { handleFlowluError } from './errors';
import type { UserDetails, PlanType } from '../../types/checkout';

export async function createFlowluClient(userDetails: UserDetails, plan: PlanType): Promise<void> {
  try {
    // Create contact first
    const contactResponse = await createContact(userDetails);
    
    if (!contactResponse.success || !contactResponse.data?.id) {
      throw new Error('Failed to create contact in Flowlu');
    }

    // Create opportunity with products
    const opportunityResponse = await createOpportunity(
      contactResponse.data.id,
      userDetails,
      plan
    );

    if (!opportunityResponse.success) {
      throw new Error('Failed to create opportunity in Flowlu');
    }
  } catch (error) {
    console.error('Error in createFlowluClient:', error);
    handleFlowluError(error);
  }
}