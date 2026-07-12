export default function FinTrackLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fintrack-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#fintrack-grad)" />
        <path
          d="M9 21.5v-5.2M16 21.5V9.5M23 21.5v-8.6"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-heading text-lg font-bold tracking-tight text-white">
        FinTrack
      </span>
    </div>
  );
}
