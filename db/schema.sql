-- PostgreSQL schema for Global AI Assistance.
-- Run this only after creating a production PostgreSQL database.

create table if not exists private_submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('private_share','high_alert')),
  payload_ciphertext text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','reviewed','closed'))
);

create index if not exists private_submissions_kind_status_idx
  on private_submissions(kind, status);

create table if not exists daily_advice (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft','approved','published','rejected')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists emergency_services (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  service_type text not null,
  service_name text not null,
  phone text,
  website text,
  verified_at timestamptz,
  is_active boolean not null default true
);

create index if not exists emergency_services_country_idx
  on emergency_services(country_code, is_active);
