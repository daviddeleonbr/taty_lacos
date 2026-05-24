"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AGE_RANGES,
  COLOR_SWATCHES,
  MATERIAL_OPTIONS,
  OCCASION_OPTIONS,
  STYLE_REFERENCES,
} from "@/lib/encomenda-options";
import { cn } from "@/lib/utils";

type State = {
  name: string;
  email: string;
  phone: string;
  city: string;
  childName: string;
  ageRange: string;
  headSize: string;
  styleId: string;
  styleLabel: string;
  colors: string[];
  materials: string[];
  customization: string;
  occasion: string;
  desiredDate: string;
  internalNotes: string;
};

const INITIAL: State = {
  name: "",
  email: "",
  phone: "",
  city: "",
  childName: "",
  ageRange: "",
  headSize: "",
  styleId: "",
  styleLabel: "",
  colors: [],
  materials: [],
  customization: "",
  occasion: "",
  desiredDate: "",
  internalNotes: "",
};

export function AdminNovoForm() {
  const router = useRouter();
  const [state, setState] = React.useState<State>(INITIAL);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function toggle(key: "colors" | "materials", id: string) {
    setState((s) => ({
      ...s,
      [key]: s[key].includes(id) ? s[key].filter((v) => v !== id) : [...s[key], id],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          desiredDate: state.desiredDate || undefined,
          customer: {
            name: state.name,
            email: state.email,
            phone: state.phone,
            city: state.city || undefined,
          },
          child: {
            name: state.childName || undefined,
            ageRange: state.ageRange || undefined,
            headSize: state.headSize || undefined,
          },
          piece: {
            styleId: state.styleId || undefined,
            styleLabel: state.styleLabel || undefined,
            colors: state.colors,
            materials: state.materials,
            customization: state.customization || undefined,
            occasion: state.occasion || undefined,
          },
          internalNotes: state.internalNotes || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao criar pedido.");
      }
      const data = await res.json();
      router.push(`/admin/pedidos/${data.order.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      <Section title="Cliente" subtitle="Dados de contato para você falar com ela.">
        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            label="Nome"
            required
            value={state.name}
            onChange={(v) => setState((s) => ({ ...s, name: v }))}
          />
          <Input
            label="Email"
            type="email"
            required
            value={state.email}
            onChange={(v) => setState((s) => ({ ...s, email: v }))}
          />
          <Input
            label="WhatsApp"
            value={state.phone}
            onChange={(v) => setState((s) => ({ ...s, phone: v }))}
          />
          <Input
            label="Cidade"
            value={state.city}
            onChange={(v) => setState((s) => ({ ...s, city: v }))}
          />
        </div>
      </Section>

      <Section title="Sobre a pequena" subtitle="Opcional, mas ajuda a personalizar a comunicação.">
        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            label="Nome dela"
            value={state.childName}
            onChange={(v) => setState((s) => ({ ...s, childName: v }))}
          />
          <Input
            label="Tamanho da cabeça"
            value={state.headSize}
            onChange={(v) => setState((s) => ({ ...s, headSize: v }))}
            placeholder="Ex.: 38 cm"
          />
        </div>
        <div className="mt-5">
          <Label>Faixa etária</Label>
          <Pills
            options={AGE_RANGES}
            value={state.ageRange}
            onPick={(id) => setState((s) => ({ ...s, ageRange: s.ageRange === id ? "" : id }))}
          />
        </div>
      </Section>

      <Section title="A peça" subtitle="Estilo, paleta e materiais que estão sendo criados.">
        <div>
          <Label>Estilo</Label>
          <Pills
            options={STYLE_REFERENCES.map((s) => ({ id: s.id, label: s.label }))}
            value={state.styleId}
            onPick={(id) => {
              const ref = STYLE_REFERENCES.find((r) => r.id === id);
              setState((s) => ({
                ...s,
                styleId: s.styleId === id ? "" : id,
                styleLabel: s.styleId === id ? "" : ref?.label ?? "",
              }));
            }}
          />
        </div>
        <div className="mt-6">
          <Label>Cores</Label>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {COLOR_SWATCHES.map((c) => {
              const active = state.colors.includes(c.id);
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggle("colors", c.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full border text-xs transition-all duration-300",
                    active
                      ? "border-bordeaux-500 bg-cream shadow-soft"
                      : "border-blush-100 bg-cream hover:border-blush-300"
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-ink-50"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-6">
          <Label>Materiais</Label>
          <Pills
            options={MATERIAL_OPTIONS}
            multi
            values={state.materials}
            onPick={(id) => toggle("materials", id)}
          />
        </div>
        <div className="mt-6">
          <Label>Ocasião</Label>
          <Pills
            options={OCCASION_OPTIONS}
            value={state.occasion}
            onPick={(id) => setState((s) => ({ ...s, occasion: s.occasion === id ? "" : id }))}
          />
        </div>
        <div className="mt-6">
          <Label>Personalização</Label>
          <textarea
            rows={3}
            value={state.customization}
            onChange={(e) => setState((s) => ({ ...s, customization: e.target.value }))}
            placeholder="Ex.: bordado com o nome, fita extra, etc."
            className="mt-2 w-full px-4 py-3 rounded-2xl bg-cream border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15 resize-none"
          />
        </div>
      </Section>

      <Section title="Prazo e observações">
        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            label="Data desejada de uso"
            type="date"
            value={state.desiredDate}
            onChange={(v) => setState((s) => ({ ...s, desiredDate: v }))}
          />
        </div>
        <div className="mt-5">
          <Label>Notas internas (não aparecem para a cliente)</Label>
          <textarea
            rows={3}
            value={state.internalNotes}
            onChange={(e) => setState((s) => ({ ...s, internalNotes: e.target.value }))}
            placeholder="Anotações da Bruna sobre essa peça…"
            className="mt-2 w-full px-4 py-3 rounded-2xl bg-cream border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15 resize-none"
          />
        </div>
      </Section>

      {error && (
        <p className="text-sm text-bordeaux-500 bg-blush-100/60 border border-bordeaux-500/20 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/pedidos")}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Criando…
            </>
          ) : (
            "Criar pedido"
          )}
        </Button>
      </div>
    </form>
  );
}

/* helpers */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-cream border border-blush-100/60 p-6 lg:p-8 shadow-soft">
      <div className="mb-6">
        <h3 className="font-serif text-lg text-ink-600">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-xs text-ink-400 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] uppercase tracking-[0.18em] font-medium text-ink-400">
      {children}
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-bordeaux-500 ml-1">*</span>}
      </Label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 h-11 rounded-full bg-cream border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
      />
    </div>
  );
}

function Pills({
  options,
  value,
  values,
  multi,
  onPick,
}: {
  options: ReadonlyArray<{ id: string; label: string }>;
  value?: string;
  values?: string[];
  multi?: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2.5">
      {options.map((o) => {
        const active = multi
          ? values?.includes(o.id) ?? false
          : value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(o.id)}
            className={cn(
              "px-4 py-2 rounded-full border text-xs transition-all duration-300",
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
  );
}
