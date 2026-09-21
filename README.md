# MealRadar · Food-app

A responsive restaurant-deal finder built for breakfast, lunch, and dinner. React + TypeScript + Vite, Supabase Auth/Postgres, and Vercel Functions.

## Included

- Search, meal and restaurant filters, price sorting, saved offers, and source-linked deal details.
- Four initial brands: McDonald's, Chili's, Applebee's, and Panera Bread. Panera is clearly marked unverified; no invented discount is shown.
- Research-backed seed catalog with original checked dates, expiration dates, redemption restrictions, and price qualifiers.
- Account sign-in and per-user preference storage using Supabase row-level security.
- Web Push subscriptions, a service worker, configurable meal times, time zones, budget and brand filters, pause controls, and optional nearby filtering.
- Protected server scheduler with atomic daily claims, a seven-day repeat exclusion, and removal of expired push subscriptions.
- Official-source change detection. Changed content is flagged for review, never silently converted into a made-up deal.
- Nearby search through Google Places (optional key required). National offers do not imply that a nearby location participates.

## Current activation status

The app builds and its core automated tests pass. It runs without credentials using a clearly labeled research snapshot. Hosted account sync, scheduled push delivery, and nearby search require the service setup below. Do not describe these as active until configured and tested on a real device.

This is a web app/PWA, not a submitted App Store or Play Store app. There is no universal public API for every chain's personalized app offers. The source checker monitors the reviewed public pages; adding a new promotion requires reviewing its terms and publishing a structured deal. It does not sign into restaurant accounts or bypass site restrictions.

## Local development

Node 22 or newer:

```sh
npm ci
npm run dev
npm test
npm run build
```

If a restricted development container cannot enumerate network interfaces, use `npm run dev -- --host 127.0.0.1`.

Without environment variables the frontend still works. API routes run on Vercel or through `vercel dev` after linking the project. Vite alone does not execute the `/api` directory.

## Supabase

1. Create a Supabase project in your chosen organization.
2. Apply `supabase/schema.sql` in the new project's SQL editor. It is a one-time schema, not an idempotent migration for an existing production database.
3. Enable email/password authentication, set the Site URL to the deployed app's HTTPS origin, and add that origin to allowed redirects. Configure a production SMTP provider before public signup; the built-in mail service is limited.
4. Copy `.env.example` to `.env`, fill the project URL and keys, and seed the reviewed offers:

```sh
node --env-file=.env scripts/seed.mjs
```

5. Run Supabase Security Advisor. Verify that an unauthenticated user can read the public catalog but cannot read preferences, saved offers, push subscriptions, or delivery history. Verify that two signed-in users cannot access each other's rows.

`VITE_SUPABASE_PUBLISHABLE_KEY` is browser-safe. `SUPABASE_SERVICE_ROLE_KEY` must be kept only in server environments. Never commit `.env` files. The schema enables RLS on all tables and restricts catalog writes to the server role.

## Vercel

Import `nh5t74fvhy-cyber/Food-app`, use the Vite framework preset, and keep the root directory at repository root. Build command: `npm run build`; output: `dist`. `vercel.json` configures server functions and security headers.

Set these environment variables, then redeploy:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Public project URL used by browser |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public client key |
| `VITE_VAPID_PUBLIC_KEY` | Public Web Push key, same as server public key |
| `SUPABASE_URL` | Server project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only database credential |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | Web Push key pair |
| `VAPID_SUBJECT` | `mailto:` contact controlled by the app owner |
| `CRON_SECRET` | Random secret of at least 32 characters |
| `APP_ORIGIN` | Deployed HTTPS app origin |
| `GOOGLE_PLACES_API_KEY` | Optional server key for nearby restaurants |

Generate a VAPID pair locally with `npx web-push generate-vapid-keys`. Keep the private key secret. Browser-prefixed variables are compiled into the bundle; changes require a new build.

## Scheduled notifications

1. Enable `pg_cron`, `pg_net`, and Vault in Supabase.
2. Save the deployed origin as Vault secret `mealradar_origin` and the same `CRON_SECRET` as `mealradar_cron_secret`.
3. Apply `supabase/schedule.sql` once. It calls the protected Vercel endpoint every minute and checks sources every six hours. It does not depend on Vercel's once-daily Hobby cron allowance.
4. Confirm successful responses in `net._http_response` and the Vercel function logs. Remove duplicate scheduler jobs if setup was repeated.
5. Sign into the app, choose meal times, and explicitly enable notifications on the device. On iPhone/iPad, add the app to the Home Screen first.
6. Test one actual eligible offer around a selected meal time; verify a `sent` delivery and the device notification. Pause alerts and verify no more are sent. Do not test with other users' subscriptions.

The sender uses a five-minute due window, local time-zone rules, one daily reservation per meal/user, and no repeated offer for seven days. No eligible deal means no notification. Unknown prices are excluded from budgeted alerts. A failed or uncertain push attempt is not automatically retried, avoiding duplicate notifications. Delivery time is best effort and depends on the device. This synchronous scheduler is intended for an initial small deployment; use a durable queue with workers before a large public launch. Monitor duration and scanned-user counts to avoid exceeding the invocation budget.

Nearby notifications call Google Places and require a billing-enabled Google Cloud project. Set API restrictions and a usage budget before enabling. The app does not activate paid services itself. Location is used only after the user chooses it and retained with their alert preferences if they save them. No background location tracking is performed. Google results are not stored as a permanent restaurant database.

## Maintaining deals

Read `RESEARCH.md` for the initial sources. Seed dates remain the actual research dates; running the seed does not make old offers current.

```sh
npm run check:sources
```

Review the normalized page text, verify every matching offer's amount, qualifying purchase, eligibility, meal availability, and expiration. Update the structured catalog before approving a source baseline:

```sh
node --env-file=.env scripts/approve-source.mjs SOURCE_ID REVIEWED_SHA256
```

The script re-fetches the source and refuses a changed hash. Baseline approval does not publish or approve deal rows. Publish reviewed rows separately in Supabase. Automatic checks extend `checked_at` only when the approved page fingerprint is identical and the deal is already verified. A changed page downgrades its offers. A blocked/unavailable page does not advance freshness; stale deals are excluded from alerts after seven days. Unknown end dates are shown as unknown.

## Verification

`npm test` covers time zones and daylight saving time, due windows, expiration and freshness, budget/brand/location matching, duplicate candidate exclusion, source fingerprints, SSRF-resistant push endpoint validation, unauthenticated API access, and scheduler secrets. `npm run build` checks TypeScript and produces the production bundle. These tests do not substitute for hosted database RLS checks or a real-device push test.

## Privacy and operations

No ad tracking or analytics SDK is included. Server logs omit tokens, coordinates, subscription keys, and email addresses. Account data is isolated by ownership policies. Delivery history is retained for 30 days and rate limits for two days by the cleanup job. Signing out unregisters this device's push subscription. The project needs an owner-approved privacy notice and support contact before inviting the public. Restaurant names and promotional photography belong to their owners; this independent app does not imply affiliation.
