"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "@/components/icons/decorative";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="relative py-20 lg:py-28">
      <div className="container-boutique">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-100/60 border border-champagne-400/30 mb-6">
            <SparkleIcon className="h-3 w-3 text-champagne-600" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
              Carta da fundadora
            </span>
          </div>

          <h2 className="font-serif text-display-md text-ink-600 text-balance">
            Receba{" "}
            <span className="italic font-display text-bordeaux-500">10% off</span>{" "}
            na sua primeira encomenda
          </h2>
          <p className="mt-4 text-ink-500/80 leading-relaxed max-w-md mx-auto">
            E uma cartinha mensal contando bastidores, lançamentos antes de
            todo mundo e inspirações para vestir sua pequena.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mt-9 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu melhor email"
                className="flex-1 h-12 px-5 rounded-full bg-cream border border-blush-200/60 text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15 transition-all duration-300"
              />
              <Button type="submit" size="lg" variant="primary">
                Quero meu desconto
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 inline-block px-8 py-5 rounded-2xl bg-cream-100 border border-blush-200/60 shadow-soft"
            >
              <p className="font-script text-2xl text-bordeaux-500">
                Que bom te ter por aqui ♡
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Confira seu email — o cupom está te esperando.
              </p>
            </motion.div>
          )}

          <p className="mt-5 text-xs text-ink-400">
            Cupom válido por 48h · Sem spam, prometemos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
