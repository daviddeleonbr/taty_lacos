import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export function RibbonIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M32 30c-6-7-13-9-18-6-4 2-4 9 0 13 5 4 13 2 18-3" />
      <path d="M32 30c6-7 13-9 18-6 4 2 4 9 0 13-5 4-13 2-18-3" />
      <circle cx="32" cy="30" r="3" />
      <path d="M30 33c-3 8-5 18-5 22M34 33c3 8 5 18 5 22" />
    </svg>
  );
}

export function HeartLineIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 21s-7-4.5-9.5-9.5C.5 7.5 4 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 6.5 3.5 4.5 7.5C19 16.5 12 21 12 21z" />
    </svg>
  );
}

export function FlowerIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="16" cy="16" r="3" />
      <path d="M16 13c-2-4-6-4-7-1s2 6 7 4z" />
      <path d="M16 19c2 4 6 4 7 1s-2-6-7-4z" />
      <path d="M13 16c-4 2-4 6-1 7s6-2 4-7z" />
      <path d="M19 16c4-2 4-6 1-7s-6 2-4 7z" />
    </svg>
  );
}

export function SparkleIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
    </svg>
  );
}

export function DividerOrnament({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className ?? ""}`}>
      <span className="h-px w-12 bg-champagne-400/50" />
      <RibbonIcon className="h-5 w-5 text-champagne-500" />
      <span className="h-px w-12 bg-champagne-400/50" />
    </div>
  );
}
