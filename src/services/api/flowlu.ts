import { createContact } from "./contact";
import { handleFlowluError } from "./errors";
import type { UserDetails } from "../../types/checkout";

export async function createFlowluClient(
  userDetails: UserDetails,
  onFlowluClientId: (flowluClientId: number) => void
): Promise<void> {
  try {
    // Create contact first
    const contactResponse = await createContact(userDetails);

    if (!contactResponse.success || !contactResponse.data?.id) {
      throw new Error("Failed to create contact in Flowlu");
    }

    const flowluClientId = contactResponse.data.id;
    onFlowluClientId(flowluClientId);
  } catch (error) {
    console.error("Error in createFlowluClient:", error);
    handleFlowluError(error);
  }
}
