export default function LexAureaLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="9" fill="#111111" />
        <path
          d="M16 7v18M9 12l-3 6h6l-3-6Zm14 0-3 6h6l-3-6ZM6 18a3 3 0 0 0 6 0M20 18a3 3 0 0 0 6 0M9 12h14"
          stroke="#C8A96A"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="12.5" y="23" width="7" height="1.6" rx="0.8" fill="#C8A96A" />
      </svg>
      <span className="font-heading text-lg font-bold tracking-tight text-white">
        LEX <span className="text-[#C8A96A]">&amp;</span> AUREA
      </span>
    </div>
  );
}
