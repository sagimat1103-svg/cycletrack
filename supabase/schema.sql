-- Run this in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query)

-- One row per user, holding their onboarding answers
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  age int,
  avg_period_length int not null default 5,
  avg_cycle_length int not null default 28,
  cramps int not null default 5,
  back_pain int not null default 5,
  headaches int not null default 5,
  tiredness int not null default 5,
  updated_at timestamptz not null default now()
);

-- One row per logged period day
create table if not exists public.period_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  mood int not null default 5,
  cramps int not null default 5,
  cravings int not null default 5,
  tiredness int not null default 5,
  heaviness text not null default 'Medium',
  color text not null default 'Bright red',
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

-- Enable row-level security so every user only ever sees their own rows
alter table public.profiles enable row level security;
alter table public.period_logs enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Period log policies
create policy "Users can view their own logs"
  on public.period_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own logs"
  on public.period_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own logs"
  on public.period_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own logs"
  on public.period_logs for delete
  using (auth.uid() = user_id);
