"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function CustomerGallery({ images }: { images: string[] }) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-boutique">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow">#nossasprincesinhas</span>
          <h2 className="mt-6 font-serif text-display-lg text-ink-600 text-balance">
            A galeria das nossas{" "}
            <span className="italic font-display text-bordeaux-500">
              pequenas musas
            </span>
          </h2>
          <p className="mt-5 text-ink-500/80 leading-relaxed text-pretty">
            Marque <a href="#" className="text-bordeaux-500 hover:underline">@luaelis</a> nas
            fotos da sua filha e participe da nossa galeria.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
          {images.map((src, i) => (
            <motion.a
              key={src + i}
              href="#"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: easeOut }}
              className="relative group aspect-square rounded-2xl overflow-hidden shadow-soft"
            >
              <Image
                src={src}
                alt="Cliente usando peça Lúa & Lis"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-bordeaux-700/0 group-hover:bg-bordeaux-700/40 transition-colors duration-500 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-500" strokeWidth={1.5} />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-bordeaux-500 hover:text-bordeaux-600 transition-colors group"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
            <span>Ver mais no Instagram</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
