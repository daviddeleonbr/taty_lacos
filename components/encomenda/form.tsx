"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EncomendaProgress, type Step } from "./progress";
import { RibbonIcon } from "@/components/icons/decorative";
import { cn } from "@/lib/utils";
import {
  AGE_RANGES,
  COLOR_SWATCHES,
  MATERIAL_OPTIONS,
  OCCASION_OPTIONS,
  STYLE_REFERENCES,
} from "@/lib/encomenda-options";

const STEPS: Step[] = [
  { key: "style", label: "Estilo" },
  { key: "colors", label: "Cores e materiais" },
  { key: "details", label: "Detalhes" },
  { key: "child", label: "Sua filha" },
  { key: "deadline", label: "Prazo" },
  { key: "contact", label: "Contato" },
];

type FormState = {
  styleId?: string;
  styleLabel?: string;
  colors: string[];
  materials: string[];
  customization?: string;
  occasion?: string;
  childName?: string;
  ageRange?: string;
  headSize?: string;
  desiredDate?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    city?: string;
    state?: string;
  };
};

const INITIAL: FormState = {
  colors: [],
  materials: [],
  customer: { name: "", email: "", phone: "" },
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export function EncomendaForm() {
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = React.useState(false);
  const [createdOrderId, setCreatedOrderId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const isLast = step === STEPS.length - 1;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function toggleArray(key: "colors" | "materials", id: string) {
    setState((s) => {
      const has = s[key].includes(id);
      return { ...s, [key]: has ? s[key].filter((c) => c !== id) : [...s[key], id] };
    });
  }

  function canAdvance() {
    switch (STEPS[step].key) {
      case "style":
        return !!state.styleId;
      case "colors":
        return state.colors.length > 0 && state.materials.length > 0;
      case "details":
        return true;
      case "child":
        return !!state.ageRange;
      case "deadline":
        return true;
      case "contact":
        return (
          state.customer.name.trim().length > 1 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.customer.email)
        );
    }
    return false;
  }

  async function submit() {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          desiredDate: state.desiredDate,
          customer: state.customer,
          child: {
            name: state.childName,
            ageRange: state.ageRange,
            headSize: state.headSize,
          },
          piece: {
            styleId: state.styleId,
            styleLabel: state.styleLabel,
            colors: state.colors,
            materials: state.materials,
            customization: state.customization,
            occasion: state.occasion,
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao enviar encomenda.");
      }
      const data = await res.json();
      setCreatedOrderId(data.order.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (createdOrderId) {
    return <Confirmation orderId={createdOrderId} customerName={state.customer.name} />;
  }

  return (
    <div className="w-full">
      <EncomendaProgress
        steps={STEPS}
        current={step}
        onJump={(i) => setStep(i)}
      />

      <div className="mt-10 relative min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={STEPS[step].key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            {STEPS[step].key === "style" && (
              <StepStyle
                value={state.styleId}
                onPick={(id, label) => {
                  setState((s) => ({ ...s, styleId: id, styleLabel: label }));
                }}
              />
            )}

            {STEPS[step].key === "colors" && (
              <StepColors
                colors={state.colors}
                materials={state.materials}
                onToggleColor={(id) => toggleArray("colors", id)}
                onToggleMaterial={(id) => toggleArray("materials", id)}
              />
            )}

            {STEPS[step].key === "details" && (
              <StepDetails
                customization={state.customization}
                occasion={state.occasion}
                onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
              />
            )}

            {STEPS[step].key === "child" && (
              <StepChild
                childName={state.childName}
                ageRange={state.ageRange}
                headSize={state.headSize}
                onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
              />
            )}

            {STEPS[step].key === "deadline" && (
              <StepDeadline
                desiredDate={state.desiredDate}
                onChange={(d) => update("desiredDate", d)}
              />
            )}

            {STEPS[step].key === "contact" && (
              <StepContact
                customer={state.customer}
                onChange={(c) => update("customer", c)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-6 text-sm text-bordeaux-500 bg-blush-100/60 border border-bordeaux-500/20 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="mt-12 pt-8 border-t border-blush-100/60 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
          className="group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.6} />
          Voltar
        </Button>

        {!isLast ? (
          <Button
            variant="primary"
            size="lg"
            disabled={!canAdvance()}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="group"
          >
            Continuar
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.6} />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            disabled={!canAdvance() || submitting}
            onClick={submit}
            className="group"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                Enviar encomenda
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.6} />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Steps ----------------------------- */

function StepStyle({
  value,
  onPick,
}: {
  value?: string;
  onPick: (id: string, label: string) => void;
}) {
  return (
    <StepShell
      eyebrow="01 · estilo desejado"
      title="Qual peça você imagina para ela?"
      hint="Pode ser uma referência só para começarmos a conversa."
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STYLE_REFERENCES.map((r) => {
          const selected = value === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onPick(r.id, r.label)}
              className={cn(
                "group relative text-left rounded-3xl overflow-hidden border bg-cream-100 transition-all duration-500 ease-out-expo hover:-translate-y-0.5",
                selected
                  ? "border-bordeaux-500 shadow-soft-lg ring-2 ring-bordeaux-500/15"
                  : "border-blush-100 hover:border-blush-300 hover:shadow-soft"
              )}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={r.image}
                  alt={r.label}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                />
                {selected && (
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-bordeaux-500 text-cream flex items-center justify-center shadow-soft">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-serif text-base text-ink-600">{r.label}</p>
                <p className="mt-1 text-xs text-ink-400 leading-relaxed">
                  {r.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function StepColors({
  colors,
  materials,
  onToggleColor,
  onToggleMaterial,
}: {
  colors: string[];
  materials: string[];
  onToggleColor: (id: string) => void;
  onToggleMaterial: (id: string) => void;
}) {
  return (
    <StepShell
      eyebrow="02 · cores e materiais"
      title="Pinte a peça com a sua paleta"
      hint="Escolha quantas cores quiser — depois escolhemos juntos a combinação final."
    >
      <div className="space-y-10">
        <div>
          <Label>Cores favoritas</Label>
          <div className="mt-4 flex flex-wrap gap-3">
            {COLOR_SWATCHES.map((c) => {
              const active = colors.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => onToggleColor(c.id)}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all duration-300",
                    active
                      ? "border-bordeaux-500 bg-cream shadow-soft"
                      : "border-blush-100 bg-cream hover:border-blush-300"
                  )}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-ink-50 shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-sm text-ink-600">{c.label}</span>
                  {active && (
                    <Check className="h-3.5 w-3.5 text-bordeaux-500" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Materiais</Label>
          <div className="mt-4 flex flex-wrap gap-3">
            {MATERIAL_OPTIONS.map((m) => {
              const active = materials.includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => onToggleMaterial(m.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full border text-sm transition-all duration-300",
                    active
                      ? "border-bordeaux-500 bg-bordeaux-500 text-cream shadow-soft"
                      : "border-blush-100 bg-cream text-ink-600 hover:border-blush-300"
                  )}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function StepDetails({
  customization,
  occasion,
  onChange,
}: {
  customization?: string;
  occasion?: string;
  onChange: (patch: Partial<FormState>) => void;
}) {
  return (
    <StepShell
      eyebrow="03 · detalhes especiais"
      title="Tem algum toque único?"
      hint="Bordado de nome, fita de cetim, missangas — conte o que sonha para essa peça."
    >
      <div className="space-y-8">
        <div>
          <Label>Ocasião</Label>
          <div className="mt-4 flex flex-wrap gap-3">
            {OCCASION_OPTIONS.map((o) => {
              const active = occasion === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onChange({ occasion: active ? undefined : o.id })}
                  className={cn(
                    "px-5 py-2.5 rounded-full border text-sm transition-all duration-300",
                    active
                      ? "border-bordeaux-500 bg-bordeaux-500 text-cream shadow-soft"
                      : "border-blush-100 bg-cream text-ink-600 hover:border-blush-300"
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="customization">Personalização (opcional)</Label>
          <textarea
            id="customization"
            rows={4}
            value={customization ?? ""}
            onChange={(e) => onChange({ customization: e.target.value })}
            placeholder="Ex.: bordado com o nome Helena em rosa, fita extra de 30 cm…"
            className="mt-3 w-full px-5 py-4 rounded-2xl bg-cream border border-blush-100 text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15 resize-none"
          />
        </div>
      </div>
    </StepShell>
  );
}

function StepChild({
  childName,
  ageRange,
  headSize,
  onChange,
}: {
  childName?: string;
  ageRange?: string;
  headSize?: string;
  onChange: (patch: Partial<FormState>) => void;
}) {
  return (
    <StepShell
      eyebrow="04 · sobre ela"
      title="Conta um pouquinho da sua pequena"
      hint="Esses detalhes ajudam a peça a ficar perfeita no momento de uso."
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <Field
          label="Nome dela (opcional)"
          id="childName"
          value={childName ?? ""}
          onChange={(v) => onChange({ childName: v })}
          placeholder="Ex.: Helena"
        />

        <div>
          <Label htmlFor="headSize">Tamanho da cabeça (opcional)</Label>
          <input
            id="headSize"
            value={headSize ?? ""}
            onChange={(e) => onChange({ headSize: e.target.value })}
            placeholder='Ex.: 38 cm — medida da testa à nuca'
            className="mt-3 w-full px-5 h-12 rounded-full bg-cream border border-blush-100 text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
          />
          <p className="mt-2 text-xs text-ink-400 leading-relaxed">
            Não sabe? Usamos um padrão pela faixa etária — pode deixar em branco.
          </p>
        </div>

        <div className="sm:col-span-2">
          <Label>Faixa etária</Label>
          <div className="mt-4 flex flex-wrap gap-3">
            {AGE_RANGES.map((a) => {
              const active = ageRange === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onChange({ ageRange: a.id })}
                  className={cn(
                    "px-5 py-2.5 rounded-full border text-sm transition-all duration-300",
                    active
                      ? "border-bordeaux-500 bg-bordeaux-500 text-cream shadow-soft"
                      : "border-blush-100 bg-cream text-ink-600 hover:border-blush-300"
                  )}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function StepDeadline({
  desiredDate,
  onChange,
}: {
  desiredDate?: string;
  onChange: (d: string) => void;
}) {
  return (
    <StepShell
      eyebrow="05 · prazo desejado"
      title="Para quando ela vai usar?"
      hint="Nosso prazo médio é de 7 a 12 dias úteis. Quanto antes, mais tempo para um acabamento sem pressa."
    >
      <div className="max-w-sm">
        <Label htmlFor="desiredDate">Data de uso (opcional)</Label>
        <input
          id="desiredDate"
          type="date"
          value={desiredDate ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 w-full px-5 h-12 rounded-full bg-cream border border-blush-100 text-ink-600 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
        />
        <p className="mt-4 text-xs text-ink-400 leading-relaxed">
          Se a data estiver próxima, entramos em contato para confirmar a viabilidade.
        </p>
      </div>
    </StepShell>
  );
}

function StepContact({
  customer,
  onChange,
}: {
  customer: FormState["customer"];
  onChange: (c: FormState["customer"]) => void;
}) {
  return (
    <StepShell
      eyebrow="06 · contato"
      title="Para onde mandamos as novidades"
      hint="Em até 24h respondemos com o orçamento, prazo e link de acompanhamento."
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <Field
          label="Seu nome"
          id="name"
          value={customer.name}
          required
          onChange={(v) => onChange({ ...customer, name: v })}
        />
        <Field
          label="Email"
          id="email"
          type="email"
          required
          value={customer.email}
          onChange={(v) => onChange({ ...customer, email: v })}
        />
        <Field
          label="WhatsApp"
          id="phone"
          value={customer.phone}
          onChange={(v) => onChange({ ...customer, phone: v })}
          placeholder="(11) 99999-9999"
        />
        <Field
          label="Cidade"
          id="city"
          value={customer.city ?? ""}
          onChange={(v) => onChange({ ...customer, city: v })}
        />
      </div>
    </StepShell>
  );
}

/* ----------------------------- Helpers ----------------------------- */

function StepShell({
  eyebrow,
  title,
  hint,
  children,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl lg:text-4xl text-ink-600 leading-tight text-balance">
        {title}
      </h2>
      {hint && (
        <p className="mt-3 text-ink-500/80 leading-relaxed max-w-xl text-pretty">
          {hint}
        </p>
      )}
      <div className="mt-9">{children}</div>
    </div>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] uppercase tracking-[0.18em] font-medium text-ink-500"
    >
      {children}
    </label>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-bordeaux-500 ml-1">*</span>}
      </Label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full px-5 h-12 rounded-full bg-cream border border-blush-100 text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
      />
    </div>
  );
}

/* ----------------------------- Confirmation ----------------------------- */

function Confirmation({
  orderId,
  customerName,
}: {
  orderId: string;
  customerName: string;
}) {
  const trackingUrl =
    typeof window !== "undefined" ? `${window.location.origin}/pedido/${orderId}` : `/pedido/${orderId}`;
  const [copied, setCopied] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeOut }}
      className="text-center max-w-xl mx-auto py-10"
    >
      <div className="inline-flex h-20 w-20 rounded-full bg-blush-100 items-center justify-center mb-6">
        <RibbonIcon className="h-10 w-10 text-bordeaux-500 animate-soft-pulse" />
      </div>

      <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
        Encomenda recebida
      </p>
      <h2 className="mt-3 font-serif text-3xl lg:text-4xl text-ink-600 text-balance">
        Que alegria, {customerName.split(" ")[0]}!{" "}
        <span className="italic font-display text-bordeaux-500">Já começamos.</span>
      </h2>
      <p className="mt-5 text-ink-500/80 leading-relaxed text-pretty">
        Sua encomenda <strong className="text-bordeaux-500">{orderId}</strong>{" "}
        entrou no nosso ateliê. Em até 24h enviamos uma mensagem por email com o
        orçamento e o prazo confirmado. Você pode acompanhar cada etapa pelo
        link abaixo.
      </p>

      <div className="mt-10 inline-flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link href={`/pedido/${orderId}`}>
          <Button size="lg" variant="primary" className="w-full sm:w-auto">
            Acompanhar minha encomenda
          </Button>
        </Link>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(trackingUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          {copied ? <Check className="h-4 w-4 text-sage-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "Link copiado!" : "Copiar link"}
        </Button>
      </div>

      <p className="mt-8 font-script text-xl text-champagne-600">
        Obrigada por confiar em nós ♡
      </p>
    </motion.div>
  );
}
