-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc', now())
);

-- 2. Onboarding Trigger: Insert into profiles on new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Tasks Table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  completed boolean not null default false,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- 4. Row Level Security (RLS)
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- RLS Policies for tasks
-- Allow users to manage only their own tasks
create policy "Allow user access to own tasks" on public.tasks
  for all
  using (user_id = auth.uid());

-- Optionally, restrict insert to only allow user_id = auth.uid()
create policy "Allow user insert own tasks" on public.tasks
  for insert
  with check (user_id = auth.uid());
