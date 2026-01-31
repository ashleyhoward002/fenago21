-- Create drills table
create table drills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text check (category in ('Shooting', 'Defense', 'Conditioning', 'Playmaking')),
  difficulty text check (difficulty in ('Rookie', 'Pro', 'All-Star')),
  description text,
  video_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table drills enable row level security;

-- Policies
create policy "Drills are viewable by everyone" on drills
  for select using (true);

create policy "Users can insert their own drills" on drills
  for insert with check (auth.uid() = auth.uid()); -- Simplified for now, typically admin only or user specific if we add user_id

-- Seed some data
insert into drills (name, category, difficulty, description) values
('Mikan Drill', 'Shooting', 'Rookie', 'Basic layup drill under the basket.'),
('Zig Zag Slide', 'Defense', 'Pro', 'Defensive sliding drill for lateral movement.'),
('3-Man Weave', 'Playmaking', 'All-Star', 'Full court passing drill.');
