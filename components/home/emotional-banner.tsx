"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { bannerImage, founderImage } from "@/lib/mock-data";
import { RibbonIcon } from "@/components/icons/decorative";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function EmotionalBanner() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container-boutique">
        <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Founder card */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: easeOut }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="relative">
              <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-soft-lg">
                <Image
                  src={founderImage}
                  alt="Bruna, fundadora do Lúa & Lis, em seu ateliê"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Floating quote */}
              <div className="absolute -bottom-6 -right-2 sm:right-4 lg:-right-6 max-w-[260px] px-6 py-5 rounded-2xl bg-cream shadow-soft-lg border border-blush-100/60">
                <RibbonIcon className="h-5 w-5 text-champagne-500 mb-2" />
                <p className="font-serif italic text-ink-600 leading-snug">
                  &ldquo;Faço cada laço pensando em qual menininha vai usá-lo
                  pela primeira vez.&rdquo;
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-bordeaux-500">
                  Bruna · fundadora
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <span className="eyebrow">Nossa história</span>
            <h2 className="mt-6 font-serif text-display-lg text-ink-600 text-balance">
              Pequenos gestos.{" "}
              <span className="block font-script text-[clamp(2.5rem,5vw,4rem)] text-bordeaux-500 mt-2 leading-none">
                Memórias eternas.
              </span>
            </h2>

            <div className="mt-7 space-y-5 text-ink-500/85 leading-relaxed text-pretty max-w-lg">
              <p>
                O Lúa &amp; Lis nasceu numa madrugada de costura, quando a Bruna
                — recém-mãe — não encontrou um laço delicado o suficiente para
                a primeira foto da filha. Foi quando ela decidiu fazer ela
                mesma.
              </p>
              <p>
                Hoje, cada peça que sai do nosso ateliê leva esse mesmo cuidado:
                o de uma mãe pensando na filha de outra mãe. Por isso fazemos em
                pequenos lotes, com tecidos escolhidos a dedo e tempo —
                principalmente tempo.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              <Stat number="1.200+" label="Princesinhas atendidas" />
              <Stat number="100%" label="Feito à mão em SP" />
              <Stat number="4.9" label="Avaliação média" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wide banner image — para a princesa */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: easeOut }}
        className="relative mt-20 lg:mt-28 mx-auto max-w-[1600px] aspect-[21/9] lg:aspect-[21/8] overflow-hidden"
      >
        <Image
          src={bannerImage}
          alt="Mãe colocando o lacinho em sua filha — um momento de carinho"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-700/40 via-ink-700/15 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-boutique">
            <div className="max-w-md text-cream">
              <p className="font-script text-4xl lg:text-5xl leading-none">
                Pequenos gestos.
              </p>
              <p className="mt-2 font-serif text-2xl lg:text-3xl italic">
                Memórias eternas.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-2xl lg:text-3xl text-bordeaux-500">
        {number}
      </p>
      <p className="mt-1 text-xs text-ink-400 leading-snug">{label}</p>
    </div>
  );
}
