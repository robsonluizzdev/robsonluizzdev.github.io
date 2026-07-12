-- ============================================================
-- SETUP DE PROJETOS (imagem + HTML) — rode UMA VEZ no SQL Editor
-- Cria o bucket "projects", adiciona a coluna screenshot e
-- libera leitura pública + escrita do admin no Storage.
-- ============================================================

-- 1) Bucket público para imagens e HTMLs dos projetos
insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do update set public = true;

-- 2) Coluna para a URL da imagem (screenshot) do projeto
alter table projects add column if not exists screenshot text;

-- 3) Políticas de Storage para o bucket "projects"
drop policy if exists "public_read_projects_bucket" on storage.objects;
drop policy if exists "auth_write_projects_bucket" on storage.objects;
create policy "public_read_projects_bucket" on storage.objects
  for select using (bucket_id = 'projects');
create policy "auth_write_projects_bucket" on storage.objects
  for all to authenticated using (bucket_id = 'projects') with check (bucket_id = 'projects');
