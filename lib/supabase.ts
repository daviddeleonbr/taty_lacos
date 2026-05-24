import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase server-only com service_role.
 *
 * Esta chave bypassa RLS — NUNCA expor para o cliente. Por isso o
 * arquivo está marcado com `import "server-only"`.
 *
 * Env vars (em .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 *   SUPABASE_STORAGE_BUCKET=lacos
 */

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local."
    );
  }

  cached = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}

export function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET ?? "lacos";
}

/**
 * Faz upload de um arquivo para o Storage e retorna a URL pública.
 */
export async function uploadToStorage(
  pathPrefix: string,
  fileName: string,
  file: Blob,
  contentType: string
): Promise<string> {
  const supabase = getSupabase();
  const bucket = getStorageBucket();

  // Garante caminho único para evitar colisão entre uploads concorrentes
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${pathPrefix}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(key, file, {
    contentType,
    upsert: false,
  });
  if (error) {
    throw new Error(`Upload falhou: ${error.message}`);
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(key);
  return publicUrl.publicUrl;
}
