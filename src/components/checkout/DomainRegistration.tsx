import { Search } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";
import { DomainDetails } from "../../types/checkout";
import { FormEvent, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";

interface DomainRegistrationProps {
  domain: DomainDetails | null;
  onUpdateDomain: (domain: DomainDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

interface SearchResultProps {
  checking_error: string | null;
  domain_name: string | null;
  is_available: boolean | null;
  register_price: number | null;
  renew_price: number | null;
  status: boolean | null;
}

interface SearchResultsProps {
  data: SearchResultProps[];
}

export function DomainRegistration({
  domain,
  onUpdateDomain,
  onNext,
  onBack,
}: DomainRegistrationProps) {
  const [searchTerm, setSearchTerm] = useState(domain?.name || "");
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultsProps | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
      setError("Please enter a domain name");
      return;
    }

    setIsLoading(true);

    const results = await fetch(
      `http://localhost:8000/domain-availability?domain=${searchTerm}`
    );
    const data = await results.json();
    console.log("Response data:", data);
    setIsLoading(false);
    if (data.error) {
      setError(data.error);
      return;
    }

    if (!data.data || data.data.length === 0) {
      setError("No domains available or invalid domain name.");
      return;
    }

    setSearchResults(data);
    setError("");
  };

  const handleSelectDomain = (result: SearchResultProps) => {
    const dotIndex = result.domain_name?.indexOf(".") ?? -1;
    const ext = dotIndex !== -1 ? result.domain_name?.substring(dotIndex) : "";

    onUpdateDomain({
      name: searchTerm,
      extension: ext ?? "",
      available: result.is_available ?? false,
      price: result.register_price ?? 0,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        Choose Your Domain
      </h2>
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="relative">
          <Input
            label="Search for a domain"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            error={error}
            placeholder="Enter your desired domain name"
          />
          {isLoading && <LoadingSpinner />}
          <Button
            type="submit"
            className="absolute right-2 top-[30px] px-4 py-2"
            style={{ height: "30px", display: "flex" }}
            disabled={isLoading}
          >
            <Search className="w-4 h-4 mr-2" />
            <p style={{ marginTop: "-5px" }}>Search</p>
          </Button>
        </div>

        {searchResults && searchResults?.data.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Domains</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults?.data.map((result) => (
                <div
                  key={result.domain_name}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    domain?.extension ===
                    result.domain_name?.substring(
                      result.domain_name.indexOf(".")
                    )
                      ? "border-[#003B44] bg-[#003B44]/10"
                      : result.is_available
                      ? "border-gray-200 hover:border-[#003B44]/50"
                      : "border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => handleSelectDomain(result)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {searchTerm}
                      {result.domain_name?.substring(
                        result.domain_name.indexOf(".")
                      )}
                    </span>
                    {result.is_available && (
                      <span className="text-sm font-medium">
                        £
                        {result.register_price &&
                          (result.register_price * 3.36).toFixed(2)}
                        /year
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      result.is_available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.is_available ? "Available" : "Not available"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={onNext} disabled={!domain?.available}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
