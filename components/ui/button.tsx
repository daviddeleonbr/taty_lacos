import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-bordeaux-500 text-cream hover:bg-bordeaux-600 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5",
        secondary:
          "bg-cream text-bordeaux-600 border border-bordeaux-500/20 hover:border-bordeaux-500/50 hover:bg-blush-50",
        ghost:
          "text-ink-600 hover:text-bordeaux-500 hover:bg-blush-50/60",
        outline:
          "border border-ink-600/30 text-ink-600 hover:border-ink-600 hover:bg-ink-50",
        gold:
          "bg-champagne-500 text-cream hover:bg-champagne-600 shadow-glow hover:shadow-soft-lg",
        link: "text-bordeaux-500 underline-offset-4 hover:underline px-0 py-0",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-full",
        md: "h-11 px-6 text-sm rounded-full",
        lg: "h-12 px-8 text-base rounded-full",
        xl: "h-14 px-10 text-base rounded-full tracking-wide",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
