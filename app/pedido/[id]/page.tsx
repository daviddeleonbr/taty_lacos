import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { Timeline } from "@/components/pedido/timeline";
import { DividerOrnament, RibbonIcon } from "@/components/icons/decorative";
import { getOrder } from "@/lib/orders";
import { currentStageLabel, progressFromStages } from "@/lib/order-types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Acompanhar pedido ${params.id}`,
    robots: { index: false, follow: false },
  };
}

export default async function PedidoPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  const progress = progressFromStages(order.stages);
  const currentLabel = currentStageLabel(order.stages);
  const firstName = order.customer.name.split(" ")[0] ?? "amor";

  return (
    <>
      <Header />
      <main className="grain pb-32">
        {/* Hero */}
        <section className="relative overflow-hidden pt-12 pb-10 lg:pt-16 lg:pb-12">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-100/50 blur-3xl pointer-events-none" />

          <div className="container-boutique relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-bordeaux-500 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.6} />
              Voltar para a loja
            </Link>

            <div className="mt-8 max-w-3xl">
              <span className="eyebrow">Sua encomenda</span>
              <h1 className="mt-5 font-serif text-display-lg text-ink-600 text-balance">
                Olá, {firstName}{" "}
                <span className="font-script text-bordeaux-500">✨</span>
              </h1>
              <p className="mt-4 text-ink-500/80 leading-relaxed text-pretty max-w-xl">
                Sua peça está sendo confeccionada com todo carinho. Você pode
                acompanhar cada etapa por aqui — e também recebe avisos no
                email.
              </p>
            </div>
          </div>
        </section>

        {/* Summary card */}
        <section className="relative">
          <div className="container-boutique">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-[2rem] bg-cream-100 border border-blush-100/60 shadow-soft p-7 sm:p-9 lg:p-10">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400">
                      Número do pedido
                    </p>
                    <p className="mt-1 font-serif text-2xl text-bordeaux-500">
                      {order.id}
                    </p>
                    <p className="mt-3 text-xs text-ink-400">
                      Criado em {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400">
                      Status atual
                    </p>
                    <p className="mt-1 font-serif text-xl text-ink-600">
                      {currentLabel}
                    </p>
                    {order.desiredDate && (
                      <p className="mt-3 text-xs text-ink-400">
                        Para uso em {formatDate(order.desiredDate)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-7">
                  <div className="flex items-center justify-between text-xs text-ink-400 mb-2">
                    <span>Progresso da confecção</span>
                    <span className="font-medium text-bordeaux-500">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-blush-100/70 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-bordeaux-400 to-bordeaux-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Piece details */}
                <div className="mt-8 pt-7 border-t border-blush-100/70 grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <Info label="Estilo" value={order.piece.styleLabel ?? "—"} />
                  <Info
                    label="Cores"
                    value={
                      order.piece.colors.length
                        ? order.piece.colors.join(", ")
                        : "—"
                    }
                  />
                  <Info
                    label="Materiais"
                    value={
                      order.piece.materials.length
                        ? order.piece.materials.join(", ")
                        : "—"
                    }
                  />
                  <Info label="Ocasião" value={order.piece.occasion ?? "—"} />
                  {order.piece.customization && (
                    <div className="sm:col-span-2">
                      <Info
                        label="Personalização"
                        value={order.piece.customization}
                      />
                    </div>
                  )}
                </div>
              </div>

              <DividerOrnament className="my-14" />

              {/* Timeline */}
              <h2 className="font-serif text-2xl text-ink-600 mb-8 flex items-center gap-3">
                <RibbonIcon className="h-5 w-5 text-bordeaux-500" />
                Acompanhe cada etapa
              </h2>
              <Timeline stages={order.stages} />

              {/* Contact CTA */}
              <div className="mt-14 rounded-3xl bg-blush-50/60 border border-blush-100/70 p-7 lg:p-9 text-center">
                <p className="font-serif text-lg text-ink-600">
                  Tem alguma dúvida sobre sua encomenda?
                </p>
                <p className="mt-2 text-sm text-ink-500/80">
                  Fala com a gente direto pelo WhatsApp — respondemos em até 1
                  hora em horário comercial.
                </p>
                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 h-12 rounded-full bg-bordeaux-500 text-cream text-sm hover:bg-bordeaux-600 transition-colors shadow-soft"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.6} />
                  Conversar agora
                </a>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</p>
      <p className="mt-1 text-ink-600">{value}</p>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
