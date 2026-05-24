import "server-only";

import { STYLE_REFERENCES as DEFAULTS } from "./encomenda-options";
import type { EncomendaStyle } from "./encomenda-styles.types";
import { getSupabase } from "./supabase";

export type { EncomendaStyle };

const TABLE = "encomenda_styles";

const DEFAULT_STYLES: EncomendaStyle[] = DEFAULTS.map((s) => ({ ...s }));

type StyleRow = {
  id: string;
  label: string;
  description: string;
  image: string;
  sort_order: number;
  created_at: string;
};

function rowToStyle(row: StyleRow): EncomendaStyle {
  return {
    id: row.id,
    label: row.label,
    description: row.description ?? "",
    image: row.image,
  };
}

function slug(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

/**
 * Lista os modelos. Se a tabela estiver vazia (primeiro deploy),
 * faz seed com os defaults do código e retorna eles.
 *
 * Read-path resiliente: qualquer erro de configuração cai nos
 * defaults — o formulário de encomenda nunca quebra.
 */
export async function listStyles(): Promise<EncomendaStyle[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[listStyles] query:", error);
      return DEFAULT_STYLES;
    }

    if (!data || data.length === 0) {
      // Seed lazy: na primeira leitura, popula com os defaults
      try {
        await seedDefaults();
      } catch (err) {
        console.error("[listStyles] seed:", err);
      }
      return DEFAULT_STYLES;
    }

    return (data as StyleRow[]).map(rowToStyle);
  } catch (err) {
    console.error("[listStyles] config:", err);
    return DEFAULT_STYLES;
  }
}

async function seedDefaults() {
  const supabase = getSupabase();
  const rows = DEFAULT_STYLES.map((s, i) => ({
    id: s.id,
    label: s.label,
    description: s.description,
    image: s.image,
    sort_order: i,
  }));
  // upsert para ser idempotente
  await supabase.from(TABLE).upsert(rows);
}

export async function createStyle(
  input: Omit<EncomendaStyle, "id"> & { id?: string }
): Promise<EncomendaStyle> {
  const supabase = getSupabase();

  // Gera ID único
  const base = input.id?.trim() || slug(input.label || "modelo") || `modelo-${Date.now()}`;
  let id = base;
  let n = 2;
  // Tenta variações até achar livre
  // (Loop curto — IDs raramente colidem)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data: exists } = await supabase
      .from(TABLE)
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (!exists) break;
    id = `${base}-${n++}`;
  }

  // Próximo sort_order (max + 1)
  const { data: maxRow } = await supabase
    .from(TABLE)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = ((maxRow as { sort_order: number } | null)?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      id,
      label: input.label,
      description: input.description ?? "",
      image: input.image,
      sort_order: sortOrder,
    })
    .select("*")
    .single();
  if (error) throw new Error(`createStyle: ${error.message}`);
  return rowToStyle(data as StyleRow);
}

export async function updateStyle(
  id: string,
  patch: Partial<EncomendaStyle>
): Promise<EncomendaStyle | null> {
  const supabase = getSupabase();
  const update: Record<string, unknown> = {};
  if (patch.label !== undefined) update.label = patch.label;
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.image !== undefined) update.image = patch.image;

  if (Object.keys(update).length === 0) {
    const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
    return data ? rowToStyle(data as StyleRow) : null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`updateStyle: ${error.message}`);
  return data ? rowToStyle(data as StyleRow) : null;
}

export async function deleteStyle(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error, count } = await supabase
    .from(TABLE)
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error(`deleteStyle: ${error.message}`);
  return (count ?? 0) > 0;
}

/** Limpa a tabela e re-popula com os defaults do código. */
export async function resetStyles(): Promise<EncomendaStyle[]> {
  const supabase = getSupabase();
  // Apaga tudo
  const { error: delErr } = await supabase
    .from(TABLE)
    .delete()
    .gte("created_at", "1900-01-01"); // filtro "todos" exigido pelo Supabase
  if (delErr) throw new Error(`resetStyles delete: ${delErr.message}`);
  await seedDefaults();
  return DEFAULT_STYLES;
}
