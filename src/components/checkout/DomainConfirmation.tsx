interface DomainConfirmationProps {
  onNext: () => void;
  onNo: () => void;
  onShowDomainConfirmStep: (showDomainConfirmStep: boolean) => void;
  onShowDomainConfirmation: (showDomainConfirmation: boolean) => void;
}

export default function DomainConfirmation({
  onNext,
  onNo,
  onShowDomainConfirmStep,
  onShowDomainConfirmation,
}: DomainConfirmationProps) {
  const onYes = () => {
    onNext();
    onShowDomainConfirmStep(true);
    onShowDomainConfirmation(false);
  };
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md text-center">
      <p className="text-lg font-semibold text-gray-800 mb-4">
        Would you like to buy a domain & business email along with your website?
      </p>
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          onClick={onYes}
        >
          Yes
        </button>
        <button
          className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100 transition"
          onClick={onNo}
        >
          No
        </button>
      </div>
    </div>
  );
}
