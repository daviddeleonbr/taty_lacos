"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ExternalLink,
  Heart,
  ImagePlus,
  Loader2,
  Package,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type Order,
  type OrderStage,
  type StageKey,
  type StageStatus,
  DEFAULT_STAGES,
  STAGE_ORDER,
  currentStageLabel,
  progressFromStages,
} from "@/lib/order-types";

const STAGE_ICONS: Record<StageKey, React.ElementType> = {
  received: Heart,
  production: Sparkles,
  shipped: Truck,
  delivered: Package,
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function OrderEditor({ initialOrder }: { initialOrder: Order }) {
  const router = useRouter();
  const [order, setOrder] = React.useState<Order>(initialOrder);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState(false);

  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/pedido/${order.id}`
      : `/pedido/${order.id}`;

  function updateStage(idx: number, patch: Partial<OrderStage>) {
    setOrder((o) => ({
      ...o,
      stages: o.stages.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    }));
  }

  function setStageStatus(idx: number, status: StageStatus) {
    setOrder((o) => {
      const next = o.stages.map((s, i) => {
        if (i === idx) {
          return {
            ...s,
            status,
            completedAt:
              status === "completed"
                ? s.completedAt ?? new Date().toISOString()
                : status === "current"
                ? s.completedAt
                : undefined,
          };
        }
        // When marking one as "current", ensure no other is "current"
        if (status === "current" && s.status === "current") {
          return { ...s, status: "pending" as StageStatus };
        }
        return s;
      });
      return { ...o, stages: next };
    });
  }

  function advanceToNext() {
    setOrder((o) => {
      const stages = [...o.stages];
      const currentIdx = stages.findIndex((s) => s.status === "current");

      if (currentIdx === -1) {
        // start the first pending
        const firstPending = stages.findIndex((s) => s.status === "pending");
        if (firstPending !== -1) stages[firstPending].status = "current";
        return { ...o, stages };
      }

      // mark current as completed
      stages[currentIdx] = {
        ...stages[currentIdx],
        status: "completed",
        completedAt: stages[currentIdx].completedAt ?? new Date().toISOString(),
      };
      // promote next to current
      if (currentIdx + 1 < stages.length) {
        stages[currentIdx + 1] = {
          ...stages[currentIdx + 1],
          status: "current",
        };
      }
      return { ...o, stages };
    });
  }

  function resetStages() {
    setOrder((o) => ({
      ...o,
      stages: DEFAULT_STAGES.map((s) => ({ ...s })),
    }));
  }

  async function handlePhotoUpload(idx: number, files: FileList | null) {
    if (!files || files.length === 0) return;
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    const dataUrls = await Promise.all(readers);
    setOrder((o) => ({
      ...o,
      stages: o.stages.map((s, i) =>
        i === idx ? { ...s, photos: [...(s.photos ?? []), ...dataUrls] } : s
      ),
    }));
  }

  function removePhoto(idx: number, photoIdx: number) {
    setOrder((o) => ({
      ...o,
      stages: o.stages.map((s, i) =>
        i === idx
          ? { ...s, photos: (s.photos ?? []).filter((_, p) => p !== photoIdx) }
          : s
      ),
    }));
  }

  async function save() {
    if (saveState === "saving") return;
    setError(null);
    setSaveState("saving");
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          stages: order.stages,
          internalNotes: order.internalNotes,
          trackingCode: order.trackingCode,
          totalPrice: order.totalPrice,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao salvar.");
      }
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2200);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setSaveState("error");
    }
  }

  async function deleteOrder() {
    const res = await fetch(`/api/orders/${order.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/pedidos");
    else setError("Não foi possível excluir o pedido.");
  }

  const progress = progressFromStages(order.stages);
  const ordered = [...order.stages].sort(
    (a, b) => STAGE_ORDER.indexOf(a.key) - STAGE_ORDER.indexOf(b.key)
  );

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="rounded-3xl bg-cream border border-blush-100/60 shadow-soft p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-600 font-medium">
              Pedido
            </p>
            <h1 className="mt-1 font-serif text-2xl lg:text-3xl text-bordeaux-500">
              {order.id}
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {order.customer.name} ·{" "}
              <a
                href={`mailto:${order.customer.email}`}
                className="text-ink-400 hover:text-bordeaux-500"
              >
                {order.customer.email}
              </a>
              {order.customer.phone && (
                <>
                  {" · "}
                  <a
                    href={`https://wa.me/${order.customer.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-400 hover:text-bordeaux-500"
                  >
                    {order.customer.phone}
                  </a>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/pedido/${order.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full text-xs text-bordeaux-500 border border-bordeaux-500/20 hover:bg-blush-50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver como cliente
            </Link>
            <Button
              variant="primary"
              size="md"
              onClick={save}
              disabled={saveState === "saving"}
            >
              {saveState === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
              {saveState === "saved" && <Check className="h-4 w-4" />}
              {saveState === "idle" || saveState === "error" ? (
                <Save className="h-4 w-4" />
              ) : null}
              {saveState === "saving"
                ? "Salvando…"
                : saveState === "saved"
                ? "Salvo!"
                : "Salvar alterações"}
            </Button>
          </div>
        </div>

        <div className="mt-7 grid sm:grid-cols-3 gap-4">
          <Stat label="Status" value={currentStageLabel(order.stages)} />
          <Stat label="Progresso" value={`${progress}%`} />
          <Stat
            label="Para uso em"
            value={order.desiredDate ? formatDate(order.desiredDate) : "—"}
          />
        </div>

        <div className="mt-6 h-1.5 rounded-full bg-blush-100/70 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-bordeaux-400 to-bordeaux-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-blush-100/60 flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={advanceToNext}>
            <Sparkles className="h-3.5 w-3.5" />
            Avançar para próxima etapa
          </Button>
          <Button variant="ghost" size="sm" onClick={resetStages}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar etapas
          </Button>
          <CopyLink url={trackingUrl} />
        </div>

        {error && (
          <p className="mt-4 text-sm text-bordeaux-500 bg-blush-100/60 border border-bordeaux-500/20 rounded-2xl px-4 py-3">
            {error}
          </p>
        )}
      </div>

      {/* Piece summary */}
      <div className="rounded-3xl bg-cream border border-blush-100/60 shadow-soft p-6 lg:p-8">
        <h2 className="font-serif text-lg text-ink-600 mb-5">A peça</h2>
        <div className="grid sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
          <Info label="Estilo" value={order.piece.styleLabel ?? "—"} />
          <Info
            label="Cores"
            value={order.piece.colors.join(", ") || "—"}
          />
          <Info
            label="Materiais"
            value={order.piece.materials.join(", ") || "—"}
          />
          <Info label="Ocasião" value={order.piece.occasion ?? "—"} />
          <Info
            label="Faixa etária"
            value={order.child.ageRange ?? "—"}
          />
          <Info
            label="Nome da filha"
            value={order.child.name ?? "—"}
          />
          {order.piece.customization && (
            <div className="sm:col-span-2">
              <Info label="Personalização" value={order.piece.customization} />
            </div>
          )}
        </div>
      </div>

      {/* Stage editor */}
      <div>
        <h2 className="font-serif text-lg text-ink-600 mb-5 px-1">
          Etapas da confecção
        </h2>
        <p className="text-xs text-ink-400 mb-6 px-1 max-w-2xl">
          Cada vez que você atualiza uma etapa e clica em <strong>Salvar</strong>,
          a cliente vê a mudança em tempo real na página de acompanhamento.
          As fotos sobem do seu dispositivo — ideal para registrar o processo.
        </p>

        <div className="space-y-4">
          {ordered.map((stage, idx) => (
            <StageRow
              key={stage.key}
              stage={stage}
              index={idx}
              onStatusChange={(status) => setStageStatus(idx, status)}
              onNoteChange={(note) => updateStage(idx, { note })}
              onTitleChange={(title) => updateStage(idx, { title })}
              onDescriptionChange={(description) =>
                updateStage(idx, { description })
              }
              onUpload={(files) => handlePhotoUpload(idx, files)}
              onRemovePhoto={(pi) => removePhoto(idx, pi)}
            />
          ))}
        </div>
      </div>

      {/* Internal */}
      <div className="rounded-3xl bg-cream border border-blush-100/60 shadow-soft p-6 lg:p-8">
        <h2 className="font-serif text-lg text-ink-600 mb-5">Notas internas</h2>
        <p className="text-xs text-ink-400 mb-3">
          Apenas você vê. Anote tudo que precisar lembrar sobre essa peça.
        </p>
        <textarea
          rows={4}
          value={order.internalNotes ?? ""}
          onChange={(e) =>
            setOrder((o) => ({ ...o, internalNotes: e.target.value }))
          }
          placeholder="Ex.: tecido especial reservado, prazo apertado, ligar antes de enviar…"
          className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15 resize-none"
        />

        <div className="mt-6 pt-6 border-t border-blush-100/60 grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Código de rastreio (correios)</Label>
            <input
              value={order.trackingCode ?? ""}
              onChange={(e) =>
                setOrder((o) => ({ ...o, trackingCode: e.target.value }))
              }
              placeholder="Ex.: BR123456789BR"
              className="mt-2 w-full px-4 h-11 rounded-full bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
            />
          </div>
          <div>
            <Label>Valor total (R$)</Label>
            <input
              type="number"
              step="0.01"
              value={order.totalPrice ?? ""}
              onChange={(e) =>
                setOrder((o) => ({
                  ...o,
                  totalPrice: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="Ex.: 89.00"
              className="mt-2 w-full px-4 h-11 rounded-full bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
            />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-3xl border border-bordeaux-500/15 p-6 lg:p-8">
        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-2 text-xs text-bordeaux-500/80 hover:text-bordeaux-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir este pedido
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-ink-600">
              Tem certeza? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowDelete(false)}>
                Cancelar
              </Button>
              <button
                onClick={deleteOrder}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-xs bg-bordeaux-500 text-cream hover:bg-bordeaux-600 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir definitivamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function StageRow({
  stage,
  index,
  onStatusChange,
  onNoteChange,
  onTitleChange,
  onDescriptionChange,
  onUpload,
  onRemovePhoto,
}: {
  stage: OrderStage;
  index: number;
  onStatusChange: (s: StageStatus) => void;
  onNoteChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onUpload: (files: FileList | null) => void;
  onRemovePhoto: (idx: number) => void;
}) {
  const Icon = STAGE_ICONS[stage.key];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "rounded-3xl border bg-cream p-6 lg:p-7 transition-all duration-300",
        stage.status === "current" && "border-bordeaux-500/40 shadow-soft",
        stage.status === "completed" && "border-blush-100/70",
        stage.status === "pending" && "border-blush-100/40"
      )}
    >
      <div className="flex items-start gap-5">
        <span
          className={cn(
            "h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center",
            stage.status === "completed" && "bg-bordeaux-500 text-cream",
            stage.status === "current" && "bg-cream text-bordeaux-500 ring-4 ring-bordeaux-500/15 border border-bordeaux-500/40",
            stage.status === "pending" && "bg-cream-100 text-ink-400 border border-blush-100"
          )}
        >
          {stage.status === "completed" ? (
            <Check className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <Icon className="h-4 w-4" strokeWidth={1.6} />
          )}
        </span>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400 mb-1">
                Etapa {index + 1}
              </p>
              <input
                value={stage.title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="font-serif text-lg text-ink-600 bg-transparent w-full focus:outline-none focus:bg-blush-50/40 rounded-md px-1 -mx-1 transition-colors"
              />
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1 rounded-full bg-cream-100 p-1">
              <StatusPill
                label="Aguardando"
                active={stage.status === "pending"}
                onClick={() => onStatusChange("pending")}
              />
              <StatusPill
                label="Em andamento"
                active={stage.status === "current"}
                onClick={() => onStatusChange("current")}
              />
              <StatusPill
                label="Concluída"
                active={stage.status === "completed"}
                onClick={() => onStatusChange("completed")}
              />
            </div>
          </div>

          <textarea
            value={stage.description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={2}
            placeholder="Descrição que a cliente vê nesta etapa…"
            className="w-full px-3 py-2 rounded-xl bg-cream-100 border border-transparent text-sm text-ink-500 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/30 focus:bg-cream resize-none transition-colors"
          />

          {/* Personal note */}
          <div>
            <Label>Mensagem em script (opcional)</Label>
            <input
              value={stage.note ?? ""}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder='Ex.: "Acabei de costurar o miolo. Ficou um amor."'
              className="mt-2 w-full px-4 h-11 rounded-full bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
            />
          </div>

          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Fotos do processo</Label>
              <span className="text-[10px] text-ink-400">
                {stage.photos?.length ?? 0} foto(s)
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {stage.photos?.map((src, pi) => (
                <div
                  key={pi}
                  className="relative group aspect-square rounded-xl overflow-hidden bg-blush-50 border border-blush-100/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Foto ${pi + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => onRemovePhoto(pi)}
                    aria-label="Remover foto"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-ink-700/80 text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border border-dashed border-blush-200 hover:border-bordeaux-500/50 hover:bg-blush-50/40 transition-colors flex flex-col items-center justify-center gap-1 text-ink-400 hover:text-bordeaux-500"
              >
                <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-[0.14em]">
                  Adicionar
                </span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => onUpload(e.target.files)}
            />

            <p className="mt-3 text-[10px] text-ink-400 leading-relaxed">
              Em modo demo as fotos são salvas inline no arquivo de pedidos.
              Para produção, conecte com Supabase Storage ou Cloudinary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[11px] transition-all duration-300 whitespace-nowrap",
        active
          ? "bg-bordeaux-500 text-cream shadow-soft"
          : "text-ink-500 hover:text-bordeaux-500"
      )}
    >
      {label}
    </button>
  );
}

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs text-ink-500 hover:text-bordeaux-500 hover:bg-blush-50 transition-colors"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-sage-600" />
      ) : (
        <ExternalLink className="h-3.5 w-3.5" />
      )}
      {copied ? "Link copiado" : "Copiar link da cliente"}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</p>
      <p className="mt-1 font-serif text-base text-ink-600">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</p>
      <p className="mt-1 text-sm text-ink-600">{value}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] uppercase tracking-[0.18em] font-medium text-ink-400">
      {children}
    </label>
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
