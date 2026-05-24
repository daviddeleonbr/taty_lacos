"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RibbonIcon, FlowerIcon } from "@/components/icons/decorative";

const benefits = [
  "Tecidos escolhidos por você",
  "Personalização com nome bordado",
  "Tamanho sob medida",
  "Acompanhamento com fotos do processo",
];

export function CustomOrdersCTA() {
  return (
    <section id="encomenda" className="relative py-24 lg:py-32">
      <div className="container-boutique">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] bg-blush-fade border border-blush-200/40 shadow-soft-lg"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-bordeaux-100/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-champagne-100/50 blur-3xl pointer-events-none" />

          {/* Floating ornaments */}
          <FlowerIcon className="absolute top-12 right-12 h-12 w-12 text-champagne-500/30 animate-float" />
          <RibbonIcon className="absolute bottom-16 left-12 h-14 w-14 text-bordeaux-500/15 animate-float" style={{ animationDelay: "1.5s" }} />

          <div className="relative grid lg:grid-cols-12 gap-10 px-8 py-16 sm:px-12 lg:px-20 lg:py-24">
            <div className="lg:col-span-7">
              <span className="eyebrow">Encomenda exclusiva</span>
              <h2 className="mt-6 font-serif text-display-lg text-ink-600 text-balance">
                Quer uma peça{" "}
                <span className="block font-script text-[clamp(2.75rem,5.5vw,4.5rem)] text-bordeaux-500 leading-none mt-2">
                  só dela?
                </span>
              </h2>
              <p className="mt-6 max-w-lg text-ink-500/85 leading-relaxed text-pretty">
                Criamos peças sob medida para o ensaio newborn, o mêsversário,
                o batizado — ou só porque você quer ver a sua filha
                deslumbrante num dia qualquer.
              </p>

              <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-lg">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-bordeaux-500 text-cream flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link href="/encomenda">
                  <Button size="lg" variant="primary" className="group w-full sm:w-auto">
                    Criar peça única para minha filha
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.6} />
                  </Button>
                </Link>
                <Link href="https://wa.me/5500000000000" target="_blank">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                    Falar com a confecção
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-xs text-ink-400 italic">
                Prazo médio de produção: 7 a 12 dias úteis · Vagas limitadas por mês
              </p>
            </div>

            {/* Right showcase */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 -m-6 rounded-full bg-cream/60 blur-2xl" />
                <div className="relative p-10 rounded-[2.5rem] bg-cream shadow-soft-xl border border-blush-100/60">
                  <p className="font-script text-2xl text-champagne-600 mb-2">
                    edição limitada
                  </p>
                  <p className="font-serif text-3xl text-ink-600 leading-tight">
                    nº 12 <span className="text-ink-400">de</span> 30
                  </p>
                  <p className="mt-4 text-sm text-ink-500/80 leading-relaxed max-w-[240px]">
                    Cada coleção sob encomenda é numerada e única — para que
                    sua filha tenha algo que nenhuma outra terá.
                  </p>

                  <div className="mt-8 pt-6 border-t border-blush-100/60 flex items-center gap-3">
                    <RibbonIcon className="h-6 w-6 text-bordeaux-500" />
                    <p className="text-xs uppercase tracking-[0.18em] text-bordeaux-500">
                      Assinado à mão
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
