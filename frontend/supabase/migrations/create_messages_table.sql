create table public.messages (
    id uuid default gen_random_uuid() primary key,
    content text not null,
    role text not null check (role in ('user', 'assistant', 'system')),
    client_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb
);

-- Enable RLS
alter table public.messages enable row level security;

-- Create policy to allow all operations (adjust according to your security needs)
create policy "Allow all operations for authenticated users"
on public.messages
for all
to authenticated
using (true)
with check (true);