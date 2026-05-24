"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/mock-data";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Categories() {
  return (
    <section id="datas" className="relative py-24 lg:py-32 bg-cream-100">
      <div className="container-boutique">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow">Coleções</span>
          <h2 className="mt-6 font-serif text-display-lg text-ink-600 text-balance">
            Para cada{" "}
            <span className="italic font-display text-bordeaux-500">
              momento dela
            </span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: easeOut }}
            >
              <Link href={category.href} className="group block">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-700/65 via-ink-700/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl leading-tight">
                          {category.name}
                        </h3>
                        <p className="mt-1.5 text-xs text-cream/80 leading-snug max-w-[200px]">
                          {category.description}
                        </p>
                      </div>
                      <span className="h-9 w-9 rounded-full bg-cream/15 backdrop-blur-sm flex-shrink-0 flex items-center justify-center group-hover:bg-cream group-hover:text-bordeaux-500 transition-all duration-500">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
