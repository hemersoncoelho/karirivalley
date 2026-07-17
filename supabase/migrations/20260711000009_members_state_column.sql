-- Kariri Valley — 0009: coluna de UF no membro (Etapa 2 do onboarding)
alter table public.members
  add column if not exists state text check (char_length(state) <= 2);
