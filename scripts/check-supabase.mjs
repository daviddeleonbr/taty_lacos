#!/usr/bin/env node
/**
 * Diagnóstico da conexão com Supabase.
 *
 * Uso:
 *   node scripts/check-supabase.mjs
 *
 * Lê .env / .env.local, testa:
 *   - conexão básica
 *   - existência das 3 tabelas
 *   - existência e acessibilidade do bucket de Storage
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Carrega .env / .env.local manualmente (sem precisar de dotenv)
function loadEnv(file) {
  try {
    const txt = readFileSync(file, "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const [, key, raw] = m;
      if (process.env[key]) continue;
      const val = raw.replace(/^['"]|['"]$/g, "");
      process.env[key] = val;
    }
  } catch {}
}
loadEnv(".env.local");
loadEnv(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "lacos";

const ok = (msg) => console.log(`  ✅ ${msg}`);
const bad = (msg) => console.log(`  ❌ ${msg}`);
const info = (msg) => console.log(`     ${msg}`);

console.log("\n🔍 Diagnóstico Supabase\n");

console.log("Env vars:");
url ? ok(`NEXT_PUBLIC_SUPABASE_URL: ${url}`) : bad("NEXT_PUBLIC_SUPABASE_URL ausente");
key ? ok(`SUPABASE_SERVICE_ROLE_KEY: ${key.slice(0, 12)}…${key.slice(-6)}`) : bad("SUPABASE_SERVICE_ROLE_KEY ausente");
ok(`SUPABASE_STORAGE_BUCKET: ${bucket}`);

if (!url || !key) {
  console.log("\nVariáveis faltando — abortando.\n");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("\nTabelas:");
const tables = ["orders", "site_content", "encomenda_styles"];
let tablesOk = true;
for (const t of tables) {
  const { error, count } = await supabase
    .from(t)
    .select("*", { count: "exact", head: true });
  if (error) {
    bad(`${t}: ${error.message}`);
    tablesOk = false;
  } else {
    ok(`${t} (${count ?? 0} row${count === 1 ? "" : "s"})`);
  }
}

console.log("\nStorage:");
const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
if (bucketErr) {
  bad(`não foi possível listar buckets: ${bucketErr.message}`);
} else {
  const found = buckets.find((b) => b.name === bucket);
  if (!found) {
    bad(`bucket "${bucket}" NÃO existe`);
    info(`buckets disponíveis: ${buckets.map((b) => b.name).join(", ") || "(nenhum)"}`);
    info(`crie em https://supabase.com/dashboard/project/_/storage/buckets`);
  } else {
    ok(`bucket "${bucket}" existe (public: ${found.public})`);
    if (!found.public) {
      bad(`  ⚠️  bucket NÃO é público — URLs não funcionarão em <img>`);
    }

    // Testa upload + leitura pública + delete de uma imagem 1x1 PNG transparente
    const testKey = `health/_check_${Date.now()}.png`;
    const onePx = Uint8Array.from(
      atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwAFBQIAX8jx0gAAAABJRU5ErkJggg=="),
      (c) => c.charCodeAt(0)
    );
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(testKey, new Blob([onePx], { type: "image/png" }));
    if (upErr) {
      bad(`upload de teste falhou: ${upErr.message}`);
    } else {
      ok("upload de teste OK");
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(testKey);
      const res = await fetch(pub.publicUrl);
      if (res.ok) {
        ok(`leitura pública OK (${pub.publicUrl})`);
      } else {
        bad(`leitura pública falhou: HTTP ${res.status} — bucket pode não estar público`);
      }
      await supabase.storage.from(bucket).remove([testKey]);
    }
  }
}

console.log("\nResumo:");
if (tablesOk && !bucketErr) {
  console.log("  Tudo conectado. O admin pode fazer upload e o site lê normalmente.\n");
  process.exit(0);
} else {
  console.log("  Há pendências acima. Veja as marcações ❌.\n");
  process.exit(1);
}
