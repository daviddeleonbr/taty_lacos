import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] backdrop-blur-sm",
  {
    variants: {
      tone: {
        ready: "bg-sage-100/80 text-sage-600",
        order: "bg-blush-100/90 text-bordeaux-500",
        gold: "bg-champagne-100/90 text-champagne-600",
        scarcity: "bg-bordeaux-500/90 text-cream",
        neutral: "bg-cream/90 text-ink-500 border border-ink-50",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
