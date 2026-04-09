-- Table membres
create table if not exists membres (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  age integer,
  depuis date,
  richesse numeric,
  created_at timestamptz default now()
);

-- Table flux_capital
create table if not exists flux_capital (
  id uuid primary key default gen_random_uuid(),
  membre_id uuid references membres(id) on delete cascade,
  moment text not null,
  capital_investit numeric not null,
  valeur_ptf numeric,
  profit numeric,
  roi numeric,
  twr numeric,
  created_at timestamptz default now()
);

-- Enable RLS (optionnel si on utilise service_role uniquement)
alter table membres enable row level security;
alter table flux_capital enable row level security;

-- Policies pour service_role (bypass RLS)
-- Le service_role bypasse automatiquement RLS, pas besoin de policies.
-- Si tu veux un accès lecture public :
create policy "lecture publique membres" on membres for select using (true);
create policy "lecture publique flux" on flux_capital for select using (true);
