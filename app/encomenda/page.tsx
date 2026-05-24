import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { EncomendaForm } from "@/components/encomenda/form";
import { DividerOrnament, RibbonIcon } from "@/components/icons/decorative";
import { listStyles } from "@/lib/encomenda-styles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Encomenda exclusiva",
  description:
    "Crie uma peça única para a sua filha. Escolha estilo, cores, materiais e acompanhe cada etapa da confecção.",
};

export default async function EncomendaPage() {
  const styles = await listStyles();
  return (
    <>
      <Header />
      <main className="grain pb-32">
        {/* Hero */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-100/50 blur-3xl pointer-events-none" />
          <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-champagne-100/40 blur-3xl pointer-events-none" />

          <div className="container-boutique relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-bordeaux-500 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.6} />
              Voltar para a loja
            </Link>

            <div className="mt-10 text-center max-w-2xl mx-auto">
              <span className="eyebrow">Encomenda exclusiva</span>
              <h1 className="mt-6 font-serif text-display-lg text-ink-600 text-balance">
                Vamos criar uma peça{" "}
                <span className="italic font-display text-bordeaux-500">só dela</span>
              </h1>
              <p className="mt-5 text-ink-500/85 leading-relaxed text-pretty">
                Em 6 passos simples você nos conta o que sonha — e a gente costura,
                literalmente. Cada peça é numerada e única.
              </p>
              <DividerOrnament className="mt-10" />
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="relative">
          <div className="container-boutique">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-[2rem] lg:rounded-[2.5rem] bg-cream-100 border border-blush-100/60 shadow-soft p-7 sm:p-10 lg:p-14">
                <EncomendaForm styles={styles} />
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-ink-400">
                <div className="flex items-center gap-2">
                  <RibbonIcon className="h-4 w-4 text-bordeaux-500" />
                  Peças numeradas e únicas
                </div>
                <span className="hidden sm:inline opacity-40">·</span>
                <span>Prazo médio 7–12 dias úteis</span>
                <span className="hidden sm:inline opacity-40">·</span>
                <span>Sem compromisso até a confirmação</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
