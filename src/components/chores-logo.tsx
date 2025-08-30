export function ChoresLogo({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center size-10 bg-primary rounded-lg text-primary-foreground ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.5 5A2.5 2.5 0 1 0 7.5 5" />
        <path d="M7.5 5V12" />
        <path d="M5.5 12h4" />
        <path d="m5 18 1-5" />
        <path d="M19 12h-6.8" />
        <path d="m19 22-3-10" />
      </svg>
    </div>
  );
}
