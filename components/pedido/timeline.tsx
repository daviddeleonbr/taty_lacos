"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Heart, Package, Sparkles, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type OrderStage,
  type StageKey,
  STAGE_ORDER,
} from "@/lib/order-types";

const ICONS: Record<StageKey, React.ElementType> = {
  received: Heart,
  production: Sparkles,
  shipped: Truck,
  delivered: Package,
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Timeline({ stages }: { stages: OrderStage[] }) {
  // ensure canonical order even if storage is out of sequence
  const ordered = [...stages].sort(
    (a, b) => STAGE_ORDER.indexOf(a.key) - STAGE_ORDER.indexOf(b.key)
  );

  const completedCount = ordered.filter((s) => s.status === "completed").length;
  const hasCurrent = ordered.some((s) => s.status === "current");
  const fillIndex = completedCount + (hasCurrent ? 0.5 : 0);
  const fillPct = (fillIndex / ordered.length) * 100;

  return (
    <ol className="relative">
      {/* Vertical line track */}
      <span
        aria-hidden
        className="absolute left-[1.6875rem] top-2 bottom-2 w-px bg-blush-100"
      />
      {/* Filled progressive line */}
      <motion.span
        aria-hidden
        initial={{ height: 0 }}
        animate={{ height: `${fillPct}%` }}
        transition={{ duration: 1.2, ease: easeOut, delay: 0.2 }}
        className="absolute left-[1.6875rem] top-2 w-px bg-gradient-to-b from-bordeaux-400 to-bordeaux-500"
      />

      {ordered.map((stage, i) => (
        <StageItem key={stage.key} stage={stage} index={i} />
      ))}
    </ol>
  );
}

function StageItem({ stage, index }: { stage: OrderStage; index: number }) {
  const Icon = ICONS[stage.key];
  const isDone = stage.status === "completed";
  const isCurrent = stage.status === "current";

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.12, ease: easeOut }}
      className="relative pl-20 pb-12 last:pb-0"
    >
      {/* Node */}
      <span
        className={cn(
          "absolute left-0 top-0 h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500",
          isDone && "bg-bordeaux-500 text-cream shadow-soft",
          isCurrent && "bg-cream text-bordeaux-500 ring-4 ring-bordeaux-500/15 shadow-soft animate-soft-pulse",
          !isDone && !isCurrent && "bg-cream-100 text-ink-400 border border-blush-100"
        )}
      >
        {isDone ? (
          <Check className="h-5 w-5" strokeWidth={2.4} />
        ) : (
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        )}
      </span>

      <div
        className={cn(
          "rounded-3xl border p-6 lg:p-7 transition-all duration-500",
          isCurrent && "bg-blush-50/60 border-bordeaux-500/20 shadow-soft",
          isDone && "bg-cream-100 border-blush-100/70",
          !isDone && !isCurrent && "bg-cream-50 border-blush-100/40 opacity-70"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={cn(
                "text-[10px] uppercase tracking-[0.18em] font-medium",
                isDone && "text-sage-600",
                isCurrent && "text-bordeaux-500",
                !isDone && !isCurrent && "text-ink-400"
              )}
            >
              {isDone ? "Concluído" : isCurrent ? "Acontecendo agora" : "Aguardando"}
            </p>
            <h3 className="mt-1 font-serif text-xl text-ink-600">{stage.title}</h3>
          </div>
          {stage.completedAt && (
            <span className="text-xs text-ink-400 whitespace-nowrap">
              {formatDate(stage.completedAt)}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-ink-500/80 leading-relaxed">
          {stage.description}
        </p>

        {stage.note && (
          <p className="mt-4 font-script text-lg text-bordeaux-500 leading-snug">
            “{stage.note}”
          </p>
        )}

        {stage.photos && stage.photos.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {stage.photos.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden bg-blush-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Foto do progresso ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.li>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
