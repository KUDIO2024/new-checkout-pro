interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div 
      className={`p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg ${className}`} 
      role="alert"
    >
      <div className="font-medium">Error</div>
      <div className="whitespace-pre-wrap">{message}</div>
    </div>
  );
}