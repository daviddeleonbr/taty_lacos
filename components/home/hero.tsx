"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparkleIcon, RibbonIcon } from "@/components/icons/decorative";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero({ heroImage }: { heroImage: string }) {
  return (
    <section className="relative overflow-hidden pt-8 lg:pt-12">
      <div className="container-boutique">
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Text block */}
          <div className="lg:col-span-6 relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full bg-blush-100/60 border border-blush-200/40 backdrop-blur-sm"
            >
              <SparkleIcon className="h-3 w-3 text-champagne-500" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-bordeaux-500 font-medium">
                Edição Primavera · peças limitadas
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
              className="font-serif text-display-xl text-ink-600 text-balance"
            >
              Lacinhos que{" "}
              <span className="font-display italic text-bordeaux-500">
                guardam memórias
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOut, delay: 0.25 }}
              className="mt-6 max-w-lg lg:max-w-md mx-auto lg:mx-0 text-base lg:text-lg text-ink-500/80 leading-relaxed text-pretty"
            >
              Cada peça é confeccionada à mão, em pequenos lotes, especialmente
              para a princesa da sua vida. Da primeira foto ao ensaio de
              aniversário — um detalhe que eterniza.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOut, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link href="/encomenda">
                <Button size="lg" variant="primary" className="group w-full sm:w-auto">
                  Encomendar peça exclusiva
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.6} />
                </Button>
              </Link>
              <Link href="#colecao">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Ver coleção pronta
                </Button>
              </Link>
            </motion.div>

            {/* Trust micro-row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-xs text-ink-400"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                Feito à mão em SP
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                Pix com 5% off
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                Envio para todo Brasil
              </div>
            </motion.div>
          </div>

          {/* Image block */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: easeOut, delay: 0.2 }}
              className="relative aspect-[4/5] lg:aspect-[5/6] rounded-[2.5rem] overflow-hidden shadow-soft-xl"
            >
              <Image
                src={heroImage}
                alt="Pequena princesa usando um lacinho artesanal Lúa & Lis"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bordeaux-700/10 via-transparent to-blush-100/20" />

              {/* Floating script caption */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.9, ease: easeOut }}
                className="absolute bottom-7 left-7 right-7 lg:left-10 lg:right-auto lg:max-w-[200px] px-5 py-4 rounded-2xl bg-cream/90 backdrop-blur-md shadow-soft"
              >
                <p className="font-script text-2xl text-bordeaux-500 leading-tight">
                  para a princesa da sua vida
                </p>
              </motion.div>
            </motion.div>

            {/* Floating ribbon decoration */}
            <motion.div
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="hidden lg:flex absolute -top-6 -left-6 h-20 w-20 rounded-full bg-blush-100 items-center justify-center shadow-soft animate-float"
            >
              <RibbonIcon className="h-9 w-9 text-bordeaux-500" />
            </motion.div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.9, ease: easeOut }}
              className="hidden lg:block absolute -bottom-6 -right-4 px-5 py-4 rounded-2xl bg-cream shadow-soft-lg border border-blush-100/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-cream bg-blush-200"
                      style={{ background: `linear-gradient(135deg, hsl(${340 + i * 12} 50% 80%), hsl(${20 + i * 10} 40% 78%))` }}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-serif text-sm text-ink-600 leading-tight">
                    +1.200 princesinhas
                  </p>
                  <p className="text-[11px] text-ink-400">já receberam seu laço</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="hidden lg:flex flex-col items-center justify-center gap-2 mt-16 text-ink-400"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">descer</span>
          <ChevronDown className="h-4 w-4 animate-soft-pulse" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Subtle decorative blob */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blush-100/40 blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-champagne-100/30 blur-3xl pointer-events-none" />
    </section>
  );
}
