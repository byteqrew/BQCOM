-- ============================================================
-- BandhanUSA Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade unique not null,
  full_name     text not null,
  date_of_birth date not null,
  gender        text not null check (gender in ('Male', 'Female', 'Non-binary', 'Prefer not to say')),
  bio           text,
  photos        text[] default '{}',

  -- Location
  city          text not null,
  state         text not null,

  -- Identity
  religion      text not null,
  caste         text,
  subcaste      text,
  mother_tongue text not null,
  ethnicity     text,

  -- Immigration
  visa_status   text not null,
  willing_to_relocate boolean default true,

  -- Lifestyle
  diet          text not null,
  drinks        boolean,
  smokes        boolean,
  height_cm     int,

  -- Education & Career
  education     text,
  college       text,
  profession    text,
  employer      text,
  annual_income_usd int,

  -- Family
  family_type   text check (family_type in ('Nuclear', 'Joint')),
  family_values text check (family_values in ('Traditional', 'Moderate', 'Liberal')),
  siblings      int,
  family_status text check (family_status in ('Middle Class', 'Upper Middle Class', 'Affluent')),

  -- Horoscope (stored as JSON for flexibility)
  horoscope     jsonb default '{}',
  horoscope_match_required boolean default false,

  -- Preferences
  pref_age_min  int default 18,
  pref_age_max  int default 50,
  pref_religion text[],
  pref_caste    text[],
  pref_diet     text[],
  pref_visa_status text[],

  -- Meta
  is_verified   boolean default false,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- LIKES
-- ============================================================
create table public.likes (
  id              uuid default uuid_generate_v4() primary key,
  from_user_id    uuid references auth.users(id) on delete cascade not null,
  to_user_id      uuid references auth.users(id) on delete cascade not null,
  is_super_like   boolean default false,
  created_at      timestamptz default now(),
  unique (from_user_id, to_user_id)
);

-- ============================================================
-- MATCHES (created when both users like each other)
-- ============================================================
create table public.matches (
  id              uuid default uuid_generate_v4() primary key,
  user1_id        uuid references auth.users(id) on delete cascade not null,
  user2_id        uuid references auth.users(id) on delete cascade not null,
  matched_at      timestamptz default now(),
  last_message    text,
  last_message_at timestamptz,
  unique (user1_id, user2_id)
);

-- ============================================================
-- MESSAGES
-- ============================================================
create table public.messages (
  id          uuid default uuid_generate_v4() primary key,
  match_id    uuid references public.matches(id) on delete cascade not null,
  sender_id   uuid references auth.users(id) on delete cascade not null,
  text        text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- AUTO-MATCH TRIGGER
-- When a mutual like happens, create a match automatically
-- ============================================================
create or replace function public.create_match_on_mutual_like()
returns trigger as $$
begin
  if exists (
    select 1 from public.likes
    where from_user_id = NEW.to_user_id
      and to_user_id   = NEW.from_user_id
  ) then
    insert into public.matches (user1_id, user2_id)
    values (least(NEW.from_user_id, NEW.to_user_id), greatest(NEW.from_user_id, NEW.to_user_id))
    on conflict do nothing;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_mutual_like
after insert on public.likes
for each row execute function public.create_match_on_mutual_like();

-- ============================================================
-- AUTO-UPDATE updated_at on profiles
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.likes    enable row level security;
alter table public.matches  enable row level security;
alter table public.messages enable row level security;

-- Profiles: anyone can read active profiles; only owner can update theirs
create policy "Public profiles are viewable" on public.profiles
  for select using (is_active = true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- Likes: users can insert their own likes, read their own
create policy "Users can like others" on public.likes
  for insert with check (auth.uid() = from_user_id);

create policy "Users can read their likes" on public.likes
  for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);

-- Matches: visible to both matched users
create policy "Matches are visible to participants" on public.matches
  for select using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Messages: visible to match participants only
create policy "Messages visible to match participants" on public.messages
  for select using (
    exists (
      select 1 from public.matches m
      where m.id = match_id
        and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
    )
  );

create policy "Match participants can send messages" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.matches m
      where m.id = match_id
        and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
    )
  );

-- ============================================================
-- STORAGE BUCKET for profile photos
-- Run this separately in Supabase Storage settings or dashboard
-- ============================================================
-- Run these lines to create and secure the profile-photos bucket:
insert into storage.buckets (id, name, public) values ('profile-photos', 'profile-photos', true);

-- Allow authenticated users to upload their own photos
create policy "Users can upload their own photos" on storage.objects
  for insert with check (
    bucket_id = 'profile-photos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own photos
create policy "Users can delete their own photos" on storage.objects
  for delete using (
    bucket_id = 'profile-photos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to all profile photos
create policy "Profile photos are publicly readable" on storage.objects
  for select using (bucket_id = 'profile-photos');
