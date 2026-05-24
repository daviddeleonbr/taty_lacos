"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/mock-data";
import { RibbonIcon } from "@/components/icons/decorative";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-paper-texture pointer-events-none" />

      <div className="container-boutique relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow">Depoimentos</span>
          <h2 className="mt-6 font-serif text-display-lg text-ink-600 text-balance">
            O que as mães{" "}
            <span className="italic font-display text-bordeaux-500">
              estão dizendo
            </span>
          </h2>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: easeOut }}
              className="relative p-8 lg:p-10 rounded-3xl bg-cream-100 border border-blush-100/50 shadow-soft hover:shadow-soft-lg transition-shadow duration-500"
            >
              <RibbonIcon className="absolute top-6 right-6 h-5 w-5 text-champagne-400/60" />

              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-3.5 w-3.5 fill-champagne-500 text-champagne-500"
                  />
                ))}
              </div>

              <blockquote className="font-display text-lg lg:text-xl italic text-ink-600 leading-snug text-pretty">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-7 pt-6 border-t border-blush-100/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blush-200 to-nude-200 flex-shrink-0" />
                  <div>
                    <p className="font-serif text-sm text-ink-600">
                      {t.motherName}
                    </p>
                    <p className="text-xs text-ink-400">mãe da {t.daughterAge}</p>
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
