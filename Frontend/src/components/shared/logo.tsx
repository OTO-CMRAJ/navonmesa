import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold font-headline", className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
      >
        <path
          d="M50 95C48.6667 85.6667 52.6 72.6 62 65L74.5 57.5C81.1667 53.3333 83.3 45.6 79.5 38.5C75.7 31.4 66.5 29.5 59.5 33.5L50 39L40.5 33.5C33.5 29.5 24.3 31.4 20.5 38.5C16.7 45.6 18.8333 53.3333 25.5 57.5L38 65C47.4 72.6 51.3333 85.6667 50 95Z"
          fill="url(#paint0_linear_logo)"
        />
        <path
          d="M50 99L45 91H55L50 99Z"
          fill="url(#paint1_linear_logo)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_logo"
            x1="50"
            y1="32"
            x2="50"
            y2="95"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#41F0E0" />
            <stop offset="0.5" stopColor="#A050D0" />
            <stop offset="1" stopColor="#FF8050" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_logo"
            x1="50"
            y1="91"
            x2="50"
            y2="99"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
      </svg>
      <span>Navonmeṣa</span>
    </Link>
  );
}
