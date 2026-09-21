-- Enable pg_cron, pg_net, and Vault in the Supabase dashboard first.
-- Create Vault secrets named mealradar_origin (your HTTPS app origin) and
-- mealradar_cron_secret (the SAME secret as Vercel CRON_SECRET).
-- Do not put secrets in this source file.
select cron.schedule('mealradar-meal-alerts','* * * * *',$job$
 select net.http_post(
  url := (select decrypted_secret from vault.decrypted_secrets where name='mealradar_origin') || '/api/cron',
  headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='mealradar_cron_secret')),
  body := '{}'::jsonb,timeout_milliseconds := 55000
 );
$job$);
select cron.schedule('mealradar-source-checks','17 */6 * * *',$job$
 select net.http_post(
  url := (select decrypted_secret from vault.decrypted_secrets where name='mealradar_origin') || '/api/refresh',
  headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='mealradar_cron_secret')),
  body := '{}'::jsonb,timeout_milliseconds := 55000
 );
$job$);
select cron.schedule('mealradar-cleanup','41 3 * * *',$job$
 delete from public.rate_limits where window_start<now()-interval '2 days';
 delete from public.deliveries where created_at<now()-interval '30 days';
 update public.deals set status='archived' where expires_at<now();
$job$);
