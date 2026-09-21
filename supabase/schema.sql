-- Run in a NEW Supabase project's SQL editor. No production data is overwritten.
begin;
create table public.deals (
 id text primary key, brand text not null, title text not null, description text not null,
 price numeric(8,2) check(price>=0), price_label text not null, meals text[] not null,
 category text not null, image text not null default '', color text not null,
 source_url text not null check(source_url like 'https://%'), checked_at timestamptz,
 expires_at timestamptz, status text not null check(status in ('verified','check','archived')),
 terms text not null, app_required boolean not null default false, featured boolean default false,
 check (meals <@ array['breakfast','lunch','dinner']::text[])
);
create table public.preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 settings jsonb not null check(jsonb_typeof(settings)='object' and octet_length(settings::text)<4096),
 updated_at timestamptz not null default now()
);
create table public.saved_deals (
 user_id uuid references auth.users(id) on delete cascade,
 deal_id text references public.deals(id) on delete cascade,
 primary key(user_id,deal_id)
);
create index saved_deals_deal_idx on public.saved_deals(deal_id);
create table public.push_subscriptions (
 endpoint text primary key check(length(endpoint)<=2048), user_id uuid not null references auth.users(id) on delete cascade,
 subscription jsonb not null, updated_at timestamptz not null default now()
);
create index push_subscriptions_user_idx on public.push_subscriptions(user_id);
create table public.deliveries (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 deal_id text not null references public.deals(id), meal text not null check(meal in ('breakfast','lunch','dinner')),
 local_day date not null, status text not null check(status in ('attempted','sent','failed')),
 created_at timestamptz not null default now(),sent_at timestamptz,
 unique(user_id,meal,local_day)
);
create index deliveries_recent_idx on public.deliveries(user_id,created_at desc);
create index deliveries_deal_idx on public.deliveries(deal_id);
create table public.source_checks (
 id text primary key,url text not null,approved_hash text,last_hash text,last_status text,
 last_checked_at timestamptz,approved_at timestamptz
);
create table public.rate_limits (
 user_id uuid references auth.users(id) on delete cascade,bucket text not null,
 window_start timestamptz not null,hits integer not null,primary key(user_id,bucket,window_start)
);
alter table public.deals enable row level security;
alter table public.preferences enable row level security;
alter table public.saved_deals enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.deliveries enable row level security;
alter table public.source_checks enable row level security;
alter table public.rate_limits enable row level security;
revoke all on public.deals,public.preferences,public.saved_deals,public.push_subscriptions,public.deliveries,public.source_checks,public.rate_limits from anon,authenticated;
grant select on public.deals to anon,authenticated;
grant select,insert,update,delete on public.preferences,public.saved_deals to authenticated;
grant select on public.deliveries to authenticated;
grant all on public.deals,public.preferences,public.saved_deals,public.push_subscriptions,public.deliveries,public.source_checks,public.rate_limits to service_role;
grant usage,select on sequence public.deliveries_id_seq to service_role;
create policy "Published deal catalog" on public.deals for select to anon,authenticated using (status in ('verified','check'));
create policy "Own preferences read" on public.preferences for select to authenticated using ((select auth.uid())=user_id);
create policy "Own preferences insert" on public.preferences for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Own preferences update" on public.preferences for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Own preferences delete" on public.preferences for delete to authenticated using ((select auth.uid())=user_id);
create policy "Own saved deals read" on public.saved_deals for select to authenticated using ((select auth.uid())=user_id);
create policy "Own saved deals insert" on public.saved_deals for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Own saved deals delete" on public.saved_deals for delete to authenticated using ((select auth.uid())=user_id);
create policy "Own delivery history" on public.deliveries for select to authenticated using ((select auth.uid())=user_id);
-- Service-only function; SECURITY INVOKER does not bypass RLS.
create function public.consume_rate_limit(p_user_id uuid,p_bucket text,p_limit integer)
returns boolean language plpgsql security invoker set search_path='' as $$
declare current_hits integer;
begin
 insert into public.rate_limits(user_id,bucket,window_start,hits)
 values(p_user_id,p_bucket,date_trunc('hour',now()),1)
 on conflict(user_id,bucket,window_start) do update set hits=public.rate_limits.hits+1
 returning hits into current_hits;
 return current_hits<=p_limit;
end; $$;
revoke all on function public.consume_rate_limit(uuid,text,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(uuid,text,integer) to service_role;
commit;
