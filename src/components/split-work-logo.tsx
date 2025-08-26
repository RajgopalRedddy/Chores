import { Check } from "lucide-react";

export function SplitWorkLogo({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center size-10 bg-primary rounded-lg text-primary-foreground ${className}`}
    >
      <Check className="size-6" />
    </div>
  );
}
