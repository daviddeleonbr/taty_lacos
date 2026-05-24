"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "./image-picker";
import { cn } from "@/lib/utils";
import type { EncomendaStyle } from "@/lib/encomenda-styles.types";

const EMPTY_DRAFT: Omit<EncomendaStyle, "id"> = {
  label: "",
  description: "",
  image: "",
};

export function StylesEditor({
  initialStyles,
}: {
  initialStyles: EncomendaStyle[];
}) {
  const router = useRouter();
  const [styles, setStyles] = React.useState<EncomendaStyle[]>(initialStyles);
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState(EMPTY_DRAFT);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function refresh() {
    const res = await fetch("/api/encomenda-styles");
    if (res.ok) {
      const data = await res.json();
      setStyles(data.styles);
    }
    router.refresh();
  }

  async function createStyle() {
    if (!draft.label.trim() || !draft.image) {
      setError("Nome e imagem são obrigatórios.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/encomenda-styles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao criar.");
      }
      await refresh();
      setDraft(EMPTY_DRAFT);
      setAdding(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(style: EncomendaStyle) {
    if (!style.label.trim() || !style.image) {
      setError("Nome e imagem são obrigatórios.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/encomenda-styles/${style.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          label: style.label,
          description: style.description,
          image: style.image,
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar.");
      await refresh();
      setEditingId(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setBusy(false);
    }
  }

  async function removeStyle(id: string) {
    if (!confirm("Remover este modelo? Esta ação não pode ser desfeita.")) return;
    setBusy(true);
    try {
      await fetch(`/api/encomenda-styles/${id}`, { method: "DELETE" });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function resetAll() {
    if (
      !confirm(
        "Restaurar a lista padrão? Todos os modelos personalizados serão perdidos."
      )
    )
      return;
    setBusy(true);
    try {
      await fetch("/api/encomenda-styles", { method: "DELETE" });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  function updateLocal(id: string, patch: Partial<EncomendaStyle>) {
    setStyles((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {styles.length} modelo{styles.length !== 1 ? "s" : ""} disponíveis no formulário
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={resetAll}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs text-ink-400 hover:text-bordeaux-500 hover:bg-blush-50 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar padrão
          </button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setAdding(true);
              setDraft(EMPTY_DRAFT);
              setError(null);
            }}
            disabled={adding}
          >
            <Plus className="h-4 w-4" />
            Adicionar modelo
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-bordeaux-500 bg-blush-100/60 border border-bordeaux-500/20 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Add new card */}
      {adding && (
        <div className="rounded-3xl border-2 border-bordeaux-500/30 bg-blush-50/60 p-6 lg:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-bordeaux-500 font-medium">
              Novo modelo
            </p>
            <button
              onClick={() => {
                setAdding(false);
                setError(null);
              }}
              className="text-ink-400 hover:text-bordeaux-500"
              aria-label="Cancelar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ImagePicker
            value={draft.image}
            onChange={(image) => setDraft((d) => ({ ...d, image }))}
            label="Foto do modelo"
            aspect="aspect-[4/5] max-w-xs"
            uploadPrefix="styles"
          />

          <TextField
            label="Nome do modelo"
            value={draft.label}
            onChange={(v) => setDraft((d) => ({ ...d, label: v }))}
            placeholder='Ex.: "Laço duplo veludo"'
          />

          <TextArea
            label="Descrição (aparece para a cliente)"
            value={draft.description}
            rows={3}
            onChange={(v) => setDraft((d) => ({ ...d, description: v }))}
            placeholder="Ex.: Quatro alças sobrepostas em veludo, com miolo de cetim."
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAdding(false);
                setError(null);
              }}
              disabled={busy}
            >
              Cancelar
            </Button>
            <Button variant="primary" size="md" onClick={createStyle} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Criar modelo
            </Button>
          </div>
        </div>
      )}

      {/* Existing cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {styles.map((style) => {
          const isEditing = editingId === style.id;
          return (
            <article
              key={style.id}
              className={cn(
                "rounded-3xl border bg-cream p-5 space-y-4 transition-all duration-300",
                isEditing
                  ? "border-bordeaux-500/40 shadow-soft-lg"
                  : "border-blush-100/60"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  ID · <code className="text-ink-500">{style.id}</code>
                </p>
                <div className="flex items-center gap-1">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(style.id);
                          setError(null);
                        }}
                        className="p-1.5 rounded-full text-ink-400 hover:text-bordeaux-500 hover:bg-blush-50 transition-colors"
                        aria-label="Editar modelo"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeStyle(style.id)}
                        disabled={busy}
                        className="p-1.5 rounded-full text-ink-400 hover:text-bordeaux-500 hover:bg-blush-50 transition-colors"
                        aria-label="Remover modelo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-full text-ink-400 hover:text-bordeaux-500 hover:bg-blush-50 transition-colors"
                      aria-label="Fechar edição"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <>
                  <ImagePicker
                    value={style.image}
                    onChange={(image) => updateLocal(style.id, { image })}
                    label="Foto"
                    aspect="aspect-[4/5]"
                    uploadPrefix="styles"
                  />
                  <TextField
                    label="Nome"
                    value={style.label}
                    onChange={(label) => updateLocal(style.id, { label })}
                  />
                  <TextArea
                    label="Descrição"
                    rows={3}
                    value={style.description}
                    onChange={(description) =>
                      updateLocal(style.id, { description })
                    }
                  />
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => saveEdit(style)}
                    disabled={busy}
                    className="w-full"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Salvar alterações
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-blush-50 border border-blush-100/60">
                    {style.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={style.image}
                        alt={style.label}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-ink-400 text-xs">
                        Sem foto
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-serif text-lg text-ink-600">{style.label}</p>
                    <p className="mt-1 text-xs text-ink-500 leading-relaxed line-clamp-3">
                      {style.description}
                    </p>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>

      {styles.length === 0 && !adding && (
        <div className="rounded-3xl border border-dashed border-blush-200 p-14 text-center">
          <p className="font-serif text-xl text-ink-600">
            Nenhum modelo cadastrado
          </p>
          <p className="mt-3 text-sm text-ink-500/80 max-w-sm mx-auto">
            Adicione modelos para que a cliente veja referências ao iniciar a
            encomenda no formulário.
          </p>
        </div>
      )}
    </div>
  );
}

/* helpers */

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.18em] font-medium text-ink-400">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 h-11 rounded-full bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  rows = 3,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.18em] font-medium text-ink-400">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-2xl bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15 resize-none"
      />
    </div>
  );
}
