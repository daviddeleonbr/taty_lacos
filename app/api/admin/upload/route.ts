import { NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB

const VALID_PREFIX_ROOTS = new Set([
  "site",
  "products",
  "categories",
  "gallery",
  "founder",
  "hero",
  "banner",
  "styles",
  "process",
  "misc",
]);

/** Sanitiza o prefixo: aceita "root" ou "root/sub-coisa", rejeita .. e barras estranhas. */
function sanitizePrefix(raw: string | null): string {
  if (!raw) return "misc";
  const clean = raw
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9_\-/]/g, "_");
  const root = clean.split("/")[0];
  if (!VALID_PREFIX_ROOTS.has(root)) return "misc";
  return clean;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const prefix = sanitizePrefix(formData.get("prefix") as string | null);

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Apenas imagens são aceitas." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `Imagem muito grande (limite ${MAX_BYTES / 1024 / 1024} MB).` },
        { status: 413 }
      );
    }

    const url = await uploadToStorage(prefix, file.name, file, file.type);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
