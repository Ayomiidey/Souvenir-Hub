import { Loader2 } from "lucide-react";

export function Loader({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin text-primary ${className}`} />
    </div>
  );
}
