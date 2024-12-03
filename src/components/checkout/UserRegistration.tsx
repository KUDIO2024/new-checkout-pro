import { FormEvent, useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { LoadingSpinner } from "../LoadingSpinner";
import { ErrorMessage } from "../ErrorMessage";
import { createFlowluClient } from "../../services/api/flowlu";
import type { UserDetails, PlanType } from "../../types/checkout";

interface UserRegistrationProps {
  userDetails: UserDetails;
  plan: PlanType;
  onUpdateDetails: (details: UserDetails) => void;
  onBack: () => void;
  onShowDomainConfirmation: (showDomainConfirmation: boolean) => void;
}

export function UserRegistration({
  userDetails,
  plan,
  onUpdateDetails,
  onBack,
  onShowDomainConfirmation,
}: UserRegistrationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!userDetails.firstName) newErrors.firstName = "First name is required";
    if (!userDetails.lastName) newErrors.lastName = "Last name is required";
    if (!userDetails.email) newErrors.email = "Email is required";
    if (!userDetails.phone) newErrors.phone = "Phone is required";
    if (!userDetails.address.line1)
      newErrors["address.line1"] = "Address is required";
    if (!userDetails.address.city)
      newErrors["address.city"] = "City is required";
    if (!userDetails.address.region)
      newErrors["address.region"] = "State/Region is required";
    if (!userDetails.address.postalCode)
      newErrors["address.postalCode"] = "Postal code is required";
    if (!userDetails.address.country)
      newErrors["address.country"] = "Country is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await createFlowluClient(userDetails, plan);
      onShowDomainConfirmation(true);
    } catch (error) {
      console.error("Error creating client:", error);
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = (
    field: keyof UserDetails["address"],
    value: string
  ) => {
    onUpdateDetails({
      ...userDetails,
      address: {
        ...userDetails.address,
        [field]: value,
      },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Your Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && <ErrorMessage message={errors.submit} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={userDetails.firstName}
            onChange={(e) =>
              onUpdateDetails({ ...userDetails, firstName: e.target.value })
            }
            error={errors.firstName}
            disabled={isLoading}
            required
          />
          <Input
            label="Last Name"
            value={userDetails.lastName}
            onChange={(e) =>
              onUpdateDetails({ ...userDetails, lastName: e.target.value })
            }
            error={errors.lastName}
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={userDetails.email}
            onChange={(e) =>
              onUpdateDetails({ ...userDetails, email: e.target.value })
            }
            error={errors.email}
            disabled={isLoading}
            required
          />
          <Input
            label="Phone"
            type="tel"
            value={userDetails.phone}
            onChange={(e) =>
              onUpdateDetails({ ...userDetails, phone: e.target.value })
            }
            error={errors.phone}
            disabled={isLoading}
            required
          />
        </div>

        <Input
          label="Address Line 1"
          value={userDetails.address.line1}
          onChange={(e) => updateAddress("line1", e.target.value)}
          error={errors["address.line1"]}
          disabled={isLoading}
          required
        />
        <Input
          label="Address Line 2 (Optional)"
          value={userDetails.address.line2}
          onChange={(e) => updateAddress("line2", e.target.value)}
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            value={userDetails.address.city}
            onChange={(e) => updateAddress("city", e.target.value)}
            error={errors["address.city"]}
            disabled={isLoading}
            required
          />
          <Input
            label="State/Region"
            value={userDetails.address.region}
            onChange={(e) => updateAddress("region", e.target.value)}
            error={errors["address.region"]}
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Postal Code"
            value={userDetails.address.postalCode}
            onChange={(e) => updateAddress("postalCode", e.target.value)}
            error={errors["address.postalCode"]}
            disabled={isLoading}
            required
          />
          <Input
            label="Country"
            value={userDetails.address.country}
            onChange={(e) => updateAddress("country", e.target.value)}
            error={errors["address.country"]}
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
          <div className="flex items-center gap-4">
            {isLoading && <LoadingSpinner />}
            <Button type="submit" disabled={isLoading}>
              Continue
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
