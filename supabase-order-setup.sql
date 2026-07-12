-- ============================================================
-- ORDENAÇÃO — rode UMA VEZ no SQL Editor do Supabase
-- Adiciona a coluna sort_order (para você organizar a ordem no admin)
-- e preenche com a ordem atual de inserção.
-- ============================================================

alter table technologies add column if not exists sort_order int;
alter table experiences  add column if not exists sort_order int;
alter table projects     add column if not exists sort_order int;
alter table education     add column if not exists sort_order int;

-- Backfill: numera pela ordem de criação (quem não tiver ordem ainda)
with r as (select id, row_number() over (order by created_at) rn from technologies)
update technologies t set sort_order = r.rn from r where r.id = t.id and t.sort_order is null;

with r as (select id, row_number() over (order by created_at) rn from experiences)
update experiences e set sort_order = r.rn from r where r.id = e.id and e.sort_order is null;

with r as (select id, row_number() over (order by created_at) rn from projects)
update projects p set sort_order = r.rn from r where r.id = p.id and p.sort_order is null;

with r as (select id, row_number() over (order by created_at) rn from education)
update education ed set sort_order = r.rn from r where r.id = ed.id and ed.sort_order is null;
