export default function LoadingSpinner({
    text = "Loading...",
    size = "md",
  }: {
    text?: string;
    size?: "sm" | "md" | "lg";
  }) {
    const sizeClasses =
      size === "sm"
        ? "w-6 h-6 border-2"
        : size === "lg"
        ? "w-16 h-16 border-4"
        : "w-10 h-10 border-4";
  
    return (
      // <div className="flex flex-col items-center justify-center space-y-2 py-6">
      //   <div
      //     className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeClasses}`}
      //   />
      //   {text && <p className="text-gray-600 text-sm">{text}</p>}
      // </div>

    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full spinner mb-6"></div>

    </div>
    );
  }