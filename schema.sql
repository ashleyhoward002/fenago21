-- Create a table for public profiles using Supabase Auth
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for Games
create table games (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null,
  opponent text not null,
  minutes numeric default 0,
  points numeric default 0,
  fg_made numeric default 0,
  fg_attempted numeric default 0,
  three_made numeric default 0,
  three_attempted numeric default 0,
  ft_made numeric default 0,
  ft_attempted numeric default 0,
  rebounds_off numeric default 0,
  rebounds_def numeric default 0,
  assists numeric default 0,
  steals numeric default 0,
  blocks numeric default 0,
  turnovers numeric default 0,
  fouls numeric default 0
);

alter table games enable row level security;

create policy "Users can view own games." on games
  for select using (auth.uid() = user_id);

create policy "Users can insert own games." on games
  for insert with check (auth.uid() = user_id);

create policy "Users can update own games." on games
  for update using (auth.uid() = user_id);

create policy "Users can delete own games." on games
  for delete using (auth.uid() = user_id);

-- Enable pgvector (run this in dashboard SQL editor)
create extension if not exists vector;

-- Create a table for Documents (RAG)
create table documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text,
  metadata jsonb,
  embedding vector(768) -- Gemini Text Embedding 004 dimension
);

alter table documents enable row level security;

create policy "Users can query own documents." on documents
  for select using (auth.uid() = user_id);

create policy "Users can insert own documents." on documents
  for insert with check (auth.uid() = user_id);

-- Function for similarity search
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
