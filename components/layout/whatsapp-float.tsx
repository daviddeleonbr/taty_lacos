"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/5500000000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 220, damping: 18 }}
      className="fixed bottom-6 right-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-bordeaux-500/30 animate-soft-pulse" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-bordeaux-500 text-cream shadow-soft-lg group-hover:bg-bordeaux-600 transition-colors duration-300">
        <MessageCircle className="h-6 w-6" strokeWidth={1.6} />
      </span>
      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 rounded-full bg-cream text-ink-600 text-xs whitespace-nowrap shadow-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Fale com o ateliê
      </span>
    </motion.a>
  );
}
