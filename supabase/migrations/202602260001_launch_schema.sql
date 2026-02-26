create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  email text not null unique,
  country text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.waitlist_registrations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  interest text not null check (interest in ('home', 'studio', 'practitioner')),
  intent text not null check (intent in ('preorder_deposit', 'kickstarter_notify', 'partner_info')),
  marketing_consent boolean not null default false,
  auth_method text not null check (auth_method in ('google', 'apple', 'email_magic_link')),
  source_cta text not null check (source_cta in ('nav', 'hero', 'chapter_cta', 'campaign', 'final_cta')),
  utm_json jsonb not null default '{}'::jsonb,
  mailchimp_sync_status text not null default 'pending' check (mailchimp_sync_status in ('pending', 'synced', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.waitlist_registrations (id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  amount_usd int not null check (amount_usd = 100),
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  refund_status text not null default 'none' check (refund_status in ('none', 'requested', 'processed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_inquiries (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('sales', 'partnership', 'press', 'support')),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_waitlist_profile_id on public.waitlist_registrations (profile_id);
create index if not exists idx_waitlist_created_at on public.waitlist_registrations (created_at desc);
create index if not exists idx_reservations_registration_id on public.reservations (registration_id);
create index if not exists idx_support_created_at on public.support_inquiries (created_at desc);

create or replace function public.update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at
before update on public.reservations
for each row execute function public.update_timestamp();

alter table public.profiles enable row level security;
alter table public.waitlist_registrations enable row level security;
alter table public.reservations enable row level security;
alter table public.support_inquiries enable row level security;

drop policy if exists "service_role_full_access_profiles" on public.profiles;
create policy "service_role_full_access_profiles"
on public.profiles
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "service_role_full_access_waitlist" on public.waitlist_registrations;
create policy "service_role_full_access_waitlist"
on public.waitlist_registrations
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "service_role_full_access_reservations" on public.reservations;
create policy "service_role_full_access_reservations"
on public.reservations
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "service_role_full_access_support" on public.support_inquiries;
create policy "service_role_full_access_support"
on public.support_inquiries
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
