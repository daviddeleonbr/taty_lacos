#!/usr/bin/env node
// Mostra o conteúdo cru salvo em public.site_content no Supabase.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  try {
    const txt = readFileSync(file, "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const [, key, raw] = m;
      if (process.env[key]) continue;
      process.env[key] = raw.replace(/^['"]|['"]$/g, "");
    }
  } catch {}
}
loadEnv(".env.local");
loadEnv(".env");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data, error } = await supabase
  .from("site_content")
  .select("id, updated_at, content")
  .eq("id", 1)
  .maybeSingle();

if (error) {
  console.error("Erro:", error.message);
  process.exit(1);
}

if (!data) {
  console.log("Tabela vazia — nada salvo ainda. A home está mostrando defaults.");
  process.exit(0);
}

console.log(`Última atualização: ${data.updated_at}\n`);
console.log("Hero image:", data.content?.hero?.image?.slice(0, 90));
console.log("Banner image:", data.content?.banner?.image?.slice(0, 90));
console.log("Founder image:", data.content?.founder?.image?.slice(0, 90));
console.log(`\nGalleryImages (${data.content?.galleryImages?.length ?? 0}):`);
for (const img of data.content?.galleryImages ?? []) {
  console.log("  ·", img.slice(0, 110));
}
console.log(`\nCategorias (${data.content?.categories?.length ?? 0}):`);
for (const c of data.content?.categories ?? []) {
  console.log("  ·", c.name, "→", c.image?.slice(0, 80));
}
console.log(`\nProdutos destaque (${data.content?.featuredProducts?.length ?? 0}):`);
for (const p of data.content?.featuredProducts ?? []) {
  console.log("  ·", p.name, "→", p.image?.slice(0, 80));
}
