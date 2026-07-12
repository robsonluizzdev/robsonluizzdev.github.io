export default function SixGramLogo({ className = "" }: { className?: string }) {
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
          <linearGradient id="sixgram-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#sixgram-grad)" />
        <path
          d="M23.5 9.5 8.6 15.2c-1 .38-1 1 .18 1.35l3.8 1.19 1.47 4.46c.18.5.4.7.83.7.34 0 .5-.16.68-.34l1.83-1.77 3.8 2.8c.7.39 1.2.19 1.38-.65l2.5-11.83c.24-1.04-.4-1.5-1.57-1.11Z"
          fill="white"
        />
      </svg>
      <span className="font-heading text-lg font-bold tracking-tight text-white">
        SixGram
      </span>
    </div>
  );
}
