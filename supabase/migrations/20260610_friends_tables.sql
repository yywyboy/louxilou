-- 朋友表
create table if not exists friends (
  id text primary key,
  name text not null,
  avatar text not null,
  intro text default '',
  contact text default '',
  created_at timestamp with time zone default now()
);

-- 朋友图片表
create table if not exists friend_photos (
  id serial primary key,
  friend_id text not null references friends(id) on delete cascade,
  filename text not null,
  caption text default '',
  created_at timestamp with time zone default now()
);

-- 索引
create index if not exists idx_friend_photos_friend_id on friend_photos(friend_id);

-- RLS（允许匿名读取）
alter table friends enable row level security;
alter table friend_photos enable row level security;

create policy "Allow public read friends"
  on friends for select
  using (true);

create policy "Allow public read friend_photos"
  on friend_photos for select
  using (true);
