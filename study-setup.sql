-- That One Drawer · The Study: shared data for the Spelling Helper and Spelling Fix-Up
-- Run once in Supabase (the Recipe Box project): SQL Editor → New query → paste all of this → Run.
-- Safe to run again; it won't duplicate anything.

-- 1) Who can use the Study, and as what.
create table if not exists public.study_members (
  email text primary key,
  role  text not null check (role in ('grownup', 'kid'))
);
insert into public.study_members (email, role) values
  ('dylan.l.cosmos@gmail.com', 'grownup'),
  ('dylan.l.cosmos+maverick@gmail.com', 'kid')
on conflict (email) do update set role = excluded.role;

-- The signed-in person's role ('grownup', 'kid', or null for anyone else).
create or replace function public.study_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.study_members where email = lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

-- 2) Small shared settings and lists: today's words, options, sounds, spelling history, recent words.
create table if not exists public.study_state (
  key        text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text default (auth.jwt() ->> 'email')
);

-- 3) Results: Look & Listen sessions, sight word checks, Spelling Fix-Ups.
create table if not exists public.study_log (
  key        text primary key,            -- e.g. 'check:<id>', 'fixup:<id>', 'look:<session>'
  kind       text not null,
  t          timestamptz not null default now(),
  data       jsonb not null,
  created_by text default (auth.jwt() ->> 'email')
);
create index if not exists study_log_t on public.study_log (t desc);

-- 4) Audio: his Look & Listen recordings ('clip', kept 7 days) and your recorded sounds/words ('voice').
create table if not exists public.study_audio (
  key        text primary key,
  kind       text not null check (kind in ('clip', 'voice')),
  session    bigint,
  data       text not null,               -- the recording (data URL)
  created_at timestamptz not null default now()
);
create index if not exists study_audio_kind on public.study_audio (kind, created_at);

-- 5) Access rules: only the Study's members can see or change anything.
alter table public.study_members enable row level security;
alter table public.study_state   enable row level security;
alter table public.study_log     enable row level security;
alter table public.study_audio   enable row level security;

drop policy if exists "see own membership" on public.study_members;
create policy "see own membership" on public.study_members for select
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "members read state" on public.study_state;
create policy "members read state" on public.study_state for select using (public.study_role() is not null);
drop policy if exists "members write state" on public.study_state;
create policy "members write state" on public.study_state for insert
  with check (public.study_role() = 'grownup' or (public.study_role() = 'kid' and key not in ('daily', 'settings', 'sounds')));
drop policy if exists "members update state" on public.study_state;
create policy "members update state" on public.study_state for update
  using (public.study_role() = 'grownup' or (public.study_role() = 'kid' and key not in ('daily', 'settings', 'sounds')))
  with check (public.study_role() = 'grownup' or (public.study_role() = 'kid' and key not in ('daily', 'settings', 'sounds')));

drop policy if exists "members read log" on public.study_log;
create policy "members read log" on public.study_log for select using (public.study_role() is not null);
drop policy if exists "members add log" on public.study_log;
create policy "members add log" on public.study_log for insert with check (public.study_role() is not null);
drop policy if exists "members update log" on public.study_log;
create policy "members update log" on public.study_log for update using (public.study_role() is not null) with check (public.study_role() is not null);
drop policy if exists "grownup deletes log" on public.study_log;
create policy "grownup deletes log" on public.study_log for delete using (public.study_role() = 'grownup');

drop policy if exists "members read audio" on public.study_audio;
create policy "members read audio" on public.study_audio for select using (public.study_role() is not null);
drop policy if exists "members add audio" on public.study_audio;
create policy "members add audio" on public.study_audio for insert
  with check (public.study_role() = 'grownup' or (public.study_role() = 'kid' and kind = 'clip'));
drop policy if exists "members update audio" on public.study_audio;
create policy "members update audio" on public.study_audio for update
  using (public.study_role() = 'grownup' or (public.study_role() = 'kid' and kind = 'clip'))
  with check (public.study_role() = 'grownup' or (public.study_role() = 'kid' and kind = 'clip'));
-- Grown-up can delete anything; either device can clear out recordings older than 7 days.
drop policy if exists "delete audio" on public.study_audio;
create policy "delete audio" on public.study_audio for delete
  using (public.study_role() = 'grownup' or (public.study_role() is not null and kind = 'clip' and created_at < now() - interval '7 days'));
