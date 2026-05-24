-- =================================================================
-- Garante que o bucket de Storage existe e está público.
-- Idempotente: pode rodar várias vezes sem efeito colateral.
--
-- O nome do bucket vem do app (env var SUPABASE_STORAGE_BUCKET).
-- Aqui usamos 'taty_lacos' como default. Se você usa outro nome,
-- substitua antes de aplicar — ou crie o bucket pelo dashboard.
-- =================================================================

do $$
declare
  bucket_name text := 'taty_lacos';
begin
  -- Cria o bucket se não existir
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    bucket_name,
    bucket_name,
    true,
    5242880, -- 5 MB
    array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml']
  )
  on conflict (id) do update
    set public = true,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;
end $$;

-- =================================================================
-- Policies de leitura pública no bucket
-- (já que public=true cobre o caso, mas deixamos explícito por
-- compatibilidade com alguns SDKs que checam policies de storage)
-- =================================================================

drop policy if exists "lacos_public_read" on storage.objects;
create policy "lacos_public_read" on storage.objects
  for select using (bucket_id = 'taty_lacos');
