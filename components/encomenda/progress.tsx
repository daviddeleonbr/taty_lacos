"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Step = { key: string; label: string };

export function EncomendaProgress({
  steps,
  current,
  onJump,
}: {
  steps: Step[];
  current: number;
  onJump?: (index: number) => void;
}) {
  const pct = ((current) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 text-[11px] uppercase tracking-[0.18em] text-ink-400">
        <span>
          Etapa <span className="text-bordeaux-500 font-medium">{current + 1}</span>{" "}
          de {steps.length}
        </span>
        <span className="hidden sm:inline">{steps[current]?.label}</span>
      </div>

      <div className="relative h-1 w-full rounded-full bg-blush-100/70 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-bordeaux-400 to-bordeaux-500 rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="mt-5 hidden md:flex items-start justify-between gap-2">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onJump?.(i)}
              disabled={!onJump || i > current}
              className={cn(
                "flex flex-col items-center gap-2 flex-1 group transition-opacity",
                i > current && "opacity-40 cursor-not-allowed",
                onJump && i <= current && "cursor-pointer"
              )}
            >
              <span
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center border transition-all duration-500",
                  done && "bg-bordeaux-500 border-bordeaux-500 text-cream",
                  active && "bg-cream border-bordeaux-500 text-bordeaux-500 ring-4 ring-bordeaux-500/15",
                  !done && !active && "bg-cream border-blush-200 text-ink-400"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.12em] text-center leading-tight",
                  active ? "text-bordeaux-500 font-medium" : "text-ink-400"
                )}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
