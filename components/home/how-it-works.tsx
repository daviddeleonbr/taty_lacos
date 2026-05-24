"use client";

import { motion } from "framer-motion";
import { Heart, Scissors, Camera, Gift } from "lucide-react";
import { DividerOrnament } from "@/components/icons/decorative";

const steps = [
  {
    number: "01",
    icon: Heart,
    title: "Você escolhe ou personaliza",
    description:
      "Navegue pelas coleções prontas ou crie uma peça única, do tecido ao acabamento.",
  },
  {
    number: "02",
    icon: Scissors,
    title: "Confeccionamos à mão",
    description:
      "Cada laço é feito sob medida em nosso ateliê, com tempo e dedicação que só o artesanal tem.",
  },
  {
    number: "03",
    icon: Camera,
    title: "Acompanhe cada etapa",
    description:
      "Receba fotos do processo em tempo real — da escolha do tecido à embalagem final.",
  },
  {
    number: "04",
    icon: Gift,
    title: "Embalagem que emociona",
    description:
      "Sua peça chega em uma caixa pensada para ser parte do momento. Pronta para fotografar.",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export function HowItWorks() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-boutique">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="eyebrow">Como funciona</span>
          <h2 className="mt-6 font-serif text-display-lg text-ink-600 text-balance">
            Da escolha ao colo da sua filha,{" "}
            <span className="italic text-bordeaux-500 font-display">com carinho</span>
          </h2>
          <p className="mt-5 text-ink-500/80 leading-relaxed text-pretty">
            Aqui você não recebe apenas um laço. Recebe a experiência de ter
            uma peça pensada exclusivamente para o momento da sua filha.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: easeOut }}
              className="group relative p-7 lg:p-8 rounded-3xl bg-cream-100 border border-blush-100/40 hover:border-bordeaux-500/20 transition-all duration-500 hover:shadow-soft-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-7">
                <span className="font-script text-3xl text-champagne-500">
                  {step.number}
                </span>
                <span className="h-12 w-12 rounded-full bg-blush-100/60 flex items-center justify-center group-hover:bg-blush-200 transition-colors duration-500">
                  <step.icon className="h-5 w-5 text-bordeaux-500" strokeWidth={1.5} />
                </span>
              </div>
              <h3 className="font-serif text-lg text-ink-600 mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-ink-500/75 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <DividerOrnament className="mt-20" />
      </div>
    </section>
  );
}
