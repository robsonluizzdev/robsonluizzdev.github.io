-- ============================================================
-- SETUP DO SUPABASE — rode UMA VEZ no SQL Editor do Supabase
-- Corrige a coluna de projects e libera leitura pública +
-- escrita apenas para o admin autenticado (RLS).
-- ============================================================

-- 1) Corrigir nome da coluna em projects
--    (o Postgres transformou "demoUrl" em "demourl")
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'demourl'
  ) THEN
    ALTER TABLE projects RENAME COLUMN demourl TO demo_url;
  END IF;
END $$;

-- 2) Habilitar RLS + políticas para cada tabela
--    Leitura: pública (o site lê sem login)
--    Escrita: apenas usuários autenticados (o admin)

-- ABOUT
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_about" ON about;
DROP POLICY IF EXISTS "auth_write_about" ON about;
CREATE POLICY "public_read_about" ON about FOR SELECT USING (true);
CREATE POLICY "auth_write_about" ON about FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- TECHNOLOGIES
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_technologies" ON technologies;
DROP POLICY IF EXISTS "auth_write_technologies" ON technologies;
CREATE POLICY "public_read_technologies" ON technologies FOR SELECT USING (true);
CREATE POLICY "auth_write_technologies" ON technologies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EXPERIENCES
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_experiences" ON experiences;
DROP POLICY IF EXISTS "auth_write_experiences" ON experiences;
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "auth_write_experiences" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PROJECTS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_projects" ON projects;
DROP POLICY IF EXISTS "auth_write_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (true);
CREATE POLICY "auth_write_projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EDUCATION
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_education" ON education;
DROP POLICY IF EXISTS "auth_write_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT USING (true);
CREATE POLICY "auth_write_education" ON education FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- CONTACT
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_contact" ON contact;
DROP POLICY IF EXISTS "auth_write_contact" ON contact;
CREATE POLICY "public_read_contact" ON contact FOR SELECT USING (true);
CREATE POLICY "auth_write_contact" ON contact FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3) Storage do currículo: permitir leitura pública e escrita do admin
--    (o bucket "curriculo" precisa existir — crie em Storage > New bucket, marcado como Public)
DROP POLICY IF EXISTS "public_read_curriculo" ON storage.objects;
DROP POLICY IF EXISTS "auth_write_curriculo" ON storage.objects;
CREATE POLICY "public_read_curriculo" ON storage.objects
  FOR SELECT USING (bucket_id = 'curriculo');
CREATE POLICY "auth_write_curriculo" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'curriculo') WITH CHECK (bucket_id = 'curriculo');
