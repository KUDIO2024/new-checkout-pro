export function LoadingSpinner() {
  return (
    <div className="inline-flex items-center">
      <div className="w-4 h-4 border-2 border-t-transparent border-[#003B44] rounded-full animate-spin mr-2"></div>
      <span className="text-sm text-[#003B44]">Please wait...</span>
    </div>
  );
}