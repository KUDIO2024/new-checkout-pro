import { createContact } from "./contact";
import { handleFlowluError } from "./errors";
import type { UserDetails, CheckoutState } from "../../types/checkout";
import { createOpportunity } from "./opportunity";

export async function createFlowluClient(
  state: CheckoutState,
  userDetails: UserDetails,
  onFlowluClientId: (flowluClientId: number) => void,
  onOpportunityId: (opportunityId: number) => void
): Promise<void> {
  try {
    // Create contact first
    const contactResponse = await createContact(userDetails);

    if (!contactResponse.success || !contactResponse.data?.id) {
      throw new Error("Failed to create contact in Flowlu");
    }

    const flowluClientId = contactResponse.data.id;
    onFlowluClientId(flowluClientId);

    const opportunityResponse = await createOpportunity(state);
    if (opportunityResponse.success) {
      const opportunityId = opportunityResponse.data.id
        ? opportunityResponse.data.id
        : 0;
      onOpportunityId(opportunityId);
    }
  } catch (error) {
    console.error("Error in createFlowluClient:", error);
    handleFlowluError(error);
  }
}
