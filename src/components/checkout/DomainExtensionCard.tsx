import { cn } from '../../utils/cn';
import type { DomainExtension } from '../../types/checkout';

interface DomainExtensionCardProps {
  extension: DomainExtension;
  selected: boolean;
  available: boolean;
  price: string;
  onClick: () => void;
}

export function DomainExtensionCard({
  extension,
  selected,
  available,
  price,
  onClick,
}: DomainExtensionCardProps) {
  return (
    <div
      onClick={available ? onClick : undefined}
      className={cn(
        'p-4 rounded-lg border-2 transition-all',
        available ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
        selected
          ? 'border-[#003B44] bg-[#003B44]/10'
          : 'border-gray-200 hover:border-[#003B44]/50'
      )}
    >
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">{extension}</span>
        <span className="text-sm font-medium">{price}</span>
      </div>
      <p className={cn(
        'text-sm mt-1',
        available ? 'text-green-600' : 'text-red-600'
      )}>
        {available ? 'Available' : 'Not available'}
      </p>
    </div>
  );
}