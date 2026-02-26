# Supabase Launch Backend

This directory contains launch backend artifacts for Somaherence:

- SQL migration for profile, waitlist, reservation, and support tables.
- Edge functions for waitlist registration, reservation checkout, Stripe webhook handling, and support intake.

## Apply migration

```bash
supabase db push
```

## Deploy edge functions

```bash
supabase functions deploy waitlist-register
supabase functions deploy create-reservation-checkout
supabase functions deploy stripe-webhook
supabase functions deploy support-submit
```

## Set required secrets

Use values from [`supabase/functions/.env.example`](./functions/.env.example):

```bash
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set PUBLIC_SITE_URL=...
supabase secrets set STRIPE_SECRET_KEY=...
supabase secrets set STRIPE_WEBHOOK_SECRET=...
supabase secrets set MAILCHIMP_API_KEY=...
supabase secrets set MAILCHIMP_AUDIENCE_ID=...
supabase secrets set MAILCHIMP_SERVER_PREFIX=...
```
