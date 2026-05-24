"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ExternalLink,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "./image-picker";
import { cn, formatPrice } from "@/lib/utils";
import {
  type SiteContent,
  DEFAULT_FOUNDER_QUOTE,
  DEFAULT_BANNER_CAPTION,
} from "@/lib/site-content.types";
import type { Category, Product } from "@/lib/mock-data";

type SaveState = "idle" | "saving" | "saved" | "error";

export function ContentEditor({
  initialContent,
  defaults,
}: {
  initialContent: SiteContent;
  defaults: SiteContent;
}) {
  const router = useRouter();
  const [content, setContent] = React.useState<SiteContent>(initialContent);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [error, setError] = React.useState<string | null>(null);

  // Detect any change vs initial to gate save
  const dirty = React.useMemo(
    () => JSON.stringify(content) !== JSON.stringify(initialContent),
    [content, initialContent]
  );

  async function save() {
    if (saveState === "saving") return;
    setError(null);
    setSaveState("saving");
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(content),
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

  return (
    <div className="space-y-8">
      {/* Sticky save bar — top-16 no mobile para deixar espaço pro header do admin */}
      <div className="sticky top-16 lg:top-0 -mx-4 sm:-mx-6 lg:-mx-12 px-4 sm:px-6 lg:px-12 py-3 sm:py-4 bg-cream-100/95 backdrop-blur-md border-b border-blush-100/60 z-20 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-serif text-base sm:text-lg text-ink-600 truncate">
            Conteúdo do site
          </p>
          <p className="text-[11px] sm:text-xs text-ink-400 mt-0.5 truncate">
            {dirty
              ? "Alterações pendentes"
              : "Tudo publicado e em dia"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-bordeaux-500 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver site
          </a>
          <Button
            variant="primary"
            size="md"
            onClick={save}
            disabled={!dirty || saveState === "saving"}
          >
            {saveState === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
            {saveState === "saved" && <Check className="h-4 w-4" />}
            {(saveState === "idle" || saveState === "error") && (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {saveState === "saving"
                ? "Salvando…"
                : saveState === "saved"
                ? "Publicado!"
                : "Salvar e publicar"}
            </span>
            <span className="sm:hidden">
              {saveState === "saving"
                ? "Salvando…"
                : saveState === "saved"
                ? "Publicado!"
                : "Salvar"}
            </span>
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-bordeaux-500 bg-blush-100/60 border border-bordeaux-500/20 rounded-2xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Hero */}
      <Section
        title="Imagem principal (hero)"
        subtitle="A primeira foto que a cliente vê. Vertical, luz natural, criança usando o laço."
      >
        <ImagePicker
          value={content.hero.image}
          defaultValue={defaults.hero.image}
          onChange={(image) =>
            setContent((c) => ({ ...c, hero: { ...c.hero, image } }))
          }
          label="Foto da hero"
          aspect="aspect-[5/6] max-w-md"
          uploadPrefix="hero"
        />
      </Section>

      {/* Banner */}
      <Section
        title="Banner emocional"
        subtitle="Imagem widescreen que aparece após a história. Idealmente mãe e filha."
      >
        <div className="space-y-5">
          <ImagePicker
            value={content.banner.image}
            defaultValue={defaults.banner.image}
            onChange={(image) =>
              setContent((c) => ({ ...c, banner: { ...c.banner, image } }))
            }
            label="Foto do banner"
            aspect="aspect-[21/9]"
            uploadPrefix="banner"
          />
          <TextField
            label="Legenda em script"
            value={content.banner.caption ?? ""}
            placeholder={DEFAULT_BANNER_CAPTION}
            onChange={(v) =>
              setContent((c) => ({ ...c, banner: { ...c.banner, caption: v } }))
            }
          />
        </div>
      </Section>

      {/* Founder */}
      <Section
        title="Fundadora"
        subtitle="Foto e citação que aparecem ao lado da história do ateliê."
      >
        <div className="grid lg:grid-cols-2 gap-6">
          <ImagePicker
            value={content.founder.image}
            defaultValue={defaults.founder.image}
            onChange={(image) =>
              setContent((c) => ({ ...c, founder: { ...c.founder, image } }))
            }
            label="Foto da fundadora"
            aspect="aspect-[4/5]"
            uploadPrefix="founder"
          />
          <div>
            <TextArea
              label="Citação"
              rows={5}
              value={content.founder.quote}
              placeholder={DEFAULT_FOUNDER_QUOTE}
              onChange={(v) =>
                setContent((c) => ({ ...c, founder: { ...c.founder, quote: v } }))
              }
            />
          </div>
        </div>
      </Section>

      {/* Featured products */}
      <Section
        title="Produtos em destaque"
        subtitle="Os 6 cards que aparecem na home. Edite o nome, preço, badge e foto."
      >
        <ProductsEditor
          products={content.featuredProducts}
          onChange={(featuredProducts) =>
            setContent((c) => ({ ...c, featuredProducts }))
          }
        />
      </Section>

      {/* Categories */}
      <Section
        title="Categorias / Coleções"
        subtitle="Os cards verticais que segmentam o catálogo por faixa etária e ocasião."
      >
        <CategoriesEditor
          categories={content.categories}
          onChange={(categories) => setContent((c) => ({ ...c, categories }))}
        />
      </Section>

      {/* Gallery */}
      <Section
        title="Galeria de clientes #nossasprincesinhas"
        subtitle="O mosaico que mostra fotos reais. Adicione quantas quiser — a home renderiza em grid."
      >
        <GalleryEditor
          images={content.galleryImages}
          onChange={(galleryImages) =>
            setContent((c) => ({ ...c, galleryImages }))
          }
        />
      </Section>
    </div>
  );
}

/* ----------------------------- Sub-editors ----------------------------- */

function ProductsEditor({
  products,
  onChange,
}: {
  products: Product[];
  onChange: (next: Product[]) => void;
}) {
  function update(i: number, patch: Partial<Product>) {
    onChange(products.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function remove(i: number) {
    onChange(products.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([
      ...products,
      {
        id: `p${Date.now()}`,
        slug: `novo-produto-${products.length + 1}`,
        name: "Novo produto",
        price: 49.9,
        availability: "ready",
        collection: "Nova coleção",
        color: "—",
        image: "",
        badge: "Pronta Entrega",
      },
    ]);
  }

  return (
    <div className="space-y-5">
      {products.length === 0 && (
        <p className="text-sm text-ink-400 italic">Nenhum produto cadastrado.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="rounded-3xl border border-blush-100/60 bg-cream-50 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
                Produto {i + 1}
              </span>
              <button
                onClick={() => remove(i)}
                className="text-ink-400 hover:text-bordeaux-500 transition-colors"
                aria-label="Remover produto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <ImagePicker
              value={p.image}
              onChange={(image) => update(i, { image })}
              label="Foto"
              aspect="aspect-[4/5]"
              uploadPrefix="products"
            />

            <TextField
              label="Nome"
              value={p.name}
              onChange={(v) => update(i, { name: v })}
            />

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Coleção"
                value={p.collection}
                onChange={(v) => update(i, { collection: v })}
              />
              <TextField
                label="Cor"
                value={p.color}
                onChange={(v) => update(i, { color: v })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Preço (R$)"
                value={p.price}
                onChange={(v) => update(i, { price: v })}
              />
              <NumberField
                label="Preço antigo (opcional)"
                value={p.oldPrice}
                onChange={(v) =>
                  update(i, { oldPrice: v && v > 0 ? v : undefined })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Disponibilidade"
                value={p.availability}
                onChange={(v) =>
                  update(i, { availability: v as Product["availability"] })
                }
                options={[
                  { value: "ready", label: "Pronta entrega" },
                  { value: "made-to-order", label: "Sob encomenda" },
                ]}
              />
              <TextField
                label="Badge exibido"
                value={p.badge ?? ""}
                onChange={(v) => update(i, { badge: v })}
                placeholder="Ex.: Pronta Entrega"
              />
            </div>

            <p className="text-[10px] text-ink-400">
              Preview: {formatPrice(p.price)}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="w-full h-14 rounded-3xl border border-dashed border-blush-200 hover:border-bordeaux-500/40 hover:bg-blush-50/40 transition-colors text-sm text-ink-500 hover:text-bordeaux-500 flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar produto
      </button>
    </div>
  );
}

function CategoriesEditor({
  categories,
  onChange,
}: {
  categories: Category[];
  onChange: (next: Category[]) => void;
}) {
  function update(i: number, patch: Partial<Category>) {
    onChange(categories.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }
  function remove(i: number) {
    onChange(categories.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= categories.length) return;
    const next = [...categories];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add() {
    onChange([
      ...categories,
      {
        id: `c${Date.now()}`,
        name: "Nova coleção",
        description: "Descrição curta da coleção",
        image: "",
        href: "/colecao/nova",
      },
    ]);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        {categories.map((c, i) => (
          <div
            key={c.id}
            className="rounded-3xl border border-blush-100/60 bg-cream-50 p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  Categoria {i + 1}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-ink-400 hover:text-bordeaux-500 transition-colors disabled:opacity-30 p-1"
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === categories.length - 1}
                  className="text-ink-400 hover:text-bordeaux-500 transition-colors disabled:opacity-30 p-1"
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  onClick={() => remove(i)}
                  className="text-ink-400 hover:text-bordeaux-500 transition-colors p-1"
                  aria-label="Remover categoria"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ImagePicker
              value={c.image}
              onChange={(image) => update(i, { image })}
              label="Foto"
              aspect="aspect-[3/4]"
              uploadPrefix="categories"
            />

            <TextField
              label="Nome"
              value={c.name}
              onChange={(v) => update(i, { name: v })}
            />
            <TextArea
              label="Descrição"
              rows={2}
              value={c.description}
              onChange={(v) => update(i, { description: v })}
            />
            <TextField
              label="Link (slug)"
              value={c.href}
              onChange={(v) => update(i, { href: v })}
              placeholder="/colecao/recem-nascidas"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="w-full h-14 rounded-3xl border border-dashed border-blush-200 hover:border-bordeaux-500/40 hover:bg-blush-50/40 transition-colors text-sm text-ink-500 hover:text-bordeaux-500 flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar categoria
      </button>
    </div>
  );
}

function GalleryEditor({
  images,
  onChange,
}: {
  images: string[];
  onChange: (next: string[]) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    try {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadFile(f, "gallery"))
      );
      onChange([...images, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
    }
  }

  function addUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      setError("URL inválida.");
      return;
    }
    setError(null);
    onChange([...images, trimmed]);
    setUrlDraft("");
  }

  function remove(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div
            key={src.slice(0, 60) + i}
            className="relative group aspect-square rounded-2xl overflow-hidden bg-blush-50 border border-blush-100/60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink-700/0 group-hover:bg-ink-700/30 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="h-6 w-6 rounded-full bg-cream text-ink-600 text-[10px] disabled:opacity-30 hover:bg-bordeaux-500 hover:text-cream transition-colors"
                  aria-label="Mover para esquerda"
                >
                  ←
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  className="h-6 w-6 rounded-full bg-cream text-ink-600 text-[10px] disabled:opacity-30 hover:bg-bordeaux-500 hover:text-cream transition-colors"
                  aria-label="Mover para direita"
                >
                  →
                </button>
              </div>
              <button
                onClick={() => remove(i)}
                className="h-7 w-7 rounded-full bg-bordeaux-500 text-cream flex items-center justify-center hover:bg-bordeaux-600 transition-colors"
                aria-label="Remover foto"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="aspect-square rounded-2xl border border-dashed border-blush-200 hover:border-bordeaux-500/40 hover:bg-blush-50/40 transition-colors text-ink-400 hover:text-bordeaux-500 flex flex-col items-center justify-center gap-1"
        >
          <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.14em]">
            Adicionar
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="rounded-2xl border border-blush-100/60 bg-cream p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400 mb-2">
          Adicionar por URL
        </p>
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
            placeholder="https://..."
            className="flex-1 h-10 px-4 rounded-full bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
          />
          <button
            onClick={addUrl}
            disabled={!urlDraft.trim()}
            className="px-4 h-10 rounded-full bg-bordeaux-500 text-cream text-xs hover:bg-bordeaux-600 transition-colors disabled:opacity-40"
          >
            Adicionar
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-bordeaux-500">{error}</p>}
      </div>
    </div>
  );
}

/* ----------------------------- Form helpers ----------------------------- */

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
    <section className="rounded-3xl bg-cream border border-blush-100/60 shadow-soft p-6 lg:p-8">
      <header className="mb-6 max-w-2xl">
        <h2 className="font-serif text-xl text-ink-600">{title}</h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-ink-500/80 leading-relaxed">
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

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

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (v?: number) => void;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.18em] font-medium text-ink-400">
        {label}
      </label>
      <input
        type="number"
        step="0.01"
        min="0"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="mt-2 w-full px-4 h-11 rounded-full bg-cream-100 border border-blush-100 text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.18em] font-medium text-ink-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 h-11 rounded-full bg-cream-100 border border-blush-100 text-sm text-ink-600 focus:outline-none focus:border-bordeaux-500/50 focus:ring-2 focus:ring-bordeaux-500/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
