"use client";

import * as React from "react";
import { ImagePlus, Link2, Loader2, RotateCcw, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "upload" | "url";

export function ImagePicker({
  value,
  onChange,
  aspect = "aspect-[4/5]",
  label,
  hint,
  defaultValue,
  className,
  uploadPrefix = "site",
}: {
  value: string;
  onChange: (next: string) => void;
  aspect?: string;
  label?: string;
  hint?: string;
  /** Se passado, exibe um botão para restaurar a imagem padrão. */
  defaultValue?: string;
  className?: string;
  /** Pasta no Storage onde a foto vai ser salva (ex.: hero, products, gallery). */
  uploadPrefix?: string;
}) {
  const [tab, setTab] = React.useState<Tab>("upload");
  const [urlDraft, setUrlDraft] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Arquivo precisa ser uma imagem.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande (limite 5 MB).");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(file, uploadPrefix);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  function applyUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      setError("URL inválida.");
      return;
    }
    setError(null);
    onChange(trimmed);
    setUrlDraft("");
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center justify-between gap-3">
          <label className="text-[10px] uppercase tracking-[0.18em] font-medium text-ink-400">
            {label}
          </label>
          {defaultValue && value !== defaultValue && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              className="inline-flex items-center gap-1 text-[10px] text-ink-400 hover:text-bordeaux-500 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Restaurar padrão
            </button>
          )}
        </div>
      )}

      {/* Preview */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-blush-50 border border-blush-100/60",
          aspect
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Pré-visualização"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-400">
            <ImagePlus className="h-8 w-8" strokeWidth={1.4} />
          </div>
        )}

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-ink-700/70 text-cream backdrop-blur-sm flex items-center justify-center hover:bg-ink-700/90 transition-colors"
            aria-label="Remover imagem"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-full bg-cream-100 p-1 w-fit">
        <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
          <Upload className="h-3 w-3" />
          Enviar arquivo
        </TabButton>
        <TabButton active={tab === "url"} onClick={() => setTab("url")}>
          <Link2 className="h-3 w-3" />
          Colar URL
        </TabButton>
      </div>

      {tab === "upload" ? (
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full h-11 rounded-full border border-dashed border-blush-200 hover:border-bordeaux-500/40 hover:bg-blush-50/40 transition-colors text-sm text-ink-500 hover:text-bordeaux-500 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Lendo arquivo…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" strokeWidth={1.6} />
                Escolher arquivo do dispositivo
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyUrl())}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 h-11 px-4 rounded-full bg-cream border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
          />
          <button
            type="button"
            onClick={applyUrl}
            disabled={!urlDraft.trim()}
            className="px-5 h-11 rounded-full bg-bordeaux-500 text-cream text-xs hover:bg-bordeaux-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Usar
          </button>
        </div>
      )}

      {hint && <p className="text-[10px] text-ink-400 leading-relaxed">{hint}</p>}
      {error && (
        <p className="text-xs text-bordeaux-500 bg-blush-100/60 border border-bordeaux-500/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-all duration-300",
        active
          ? "bg-bordeaux-500 text-cream shadow-soft"
          : "text-ink-500 hover:text-bordeaux-500"
      )}
    >
      {children}
    </button>
  );
}

async function uploadFile(file: File, prefix: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("prefix", prefix);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Upload falhou.");
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}
