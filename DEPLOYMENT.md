# Radhe Boutique Deployment Guide

This project is split into two deployable apps:

- Frontend: Next.js app in `client` (deploy to Vercel)
- Backend: Express API in `server` (deploy to Render or Railway)

## 1) Prepare production secrets

Create production values for:

- `SUPABASE_URL` (Project URL from Supabase settings)
- `SUPABASE_SERVICE_ROLE_KEY` (Service role key from Supabase API settings)
- `AUTH_TOKEN_SECRET` (long random string)
- `CHECKOUT_TOKEN_SECRET` (long random string)
- `RAZORPAY_KEY_ID` (live key for production)
- `RAZORPAY_KEY_SECRET` (live secret for production)

Do not reuse local/test secrets in production.

## 2) Deploy backend (Render)

1. Push this repository to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Set:
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
4. Add environment variables:
- `NODE_ENV=production`
- `PORT=5001`
- `HOST=0.0.0.0`
- `SUPABASE_URL=<your supabase project url>`
- `SUPABASE_SERVICE_ROLE_KEY=<your supabase service role key>`
- `CORS_ORIGIN=<your frontend url>`
- `AUTH_TOKEN_SECRET=<random>`
- `CHECKOUT_TOKEN_SECRET=<random>`
- `RAZORPAY_KEY_ID=<live key id>`
- `RAZORPAY_KEY_SECRET=<live secret>`
- `ADMIN_NAME=<optional>`
- `ADMIN_EMAIL=<optional>`
- `ADMIN_PHONE=<optional>`
- `ADMIN_PASSWORD=<optional>`
5. Deploy and copy the API URL (example: `https://radhe-boutique-api.onrender.com`).

Health check after deploy:

- `https://<your-api-domain>/api/health`

## 3) Deploy frontend (Vercel)

1. In Vercel, import the same GitHub repository.
2. Set:
- Framework Preset: Next.js
- Root Directory: `client`
3. Add environment variable:
- `NEXT_PUBLIC_API_URL=https://<your-api-domain>/api`
4. Deploy and copy frontend URL (example: `https://radhe-boutique.vercel.app`).

## 4) Final CORS and Razorpay alignment

1. In backend service variables, set:
- `CORS_ORIGIN=https://<your-frontend-domain>`

If you have multiple frontend URLs (preview + production), comma-separate:

- `CORS_ORIGIN=https://<prod-domain>,https://<preview-domain>`

2. In Razorpay dashboard:
- Set allowed website/app origin to your frontend domain.
- Use **test keys** in test mode and **live keys** in production mode.

## 5) Smoke test checklist

- Open frontend home page and shop page.
- Add product to cart and proceed checkout.
- Create a test Razorpay payment.
- Confirm order is created.
- Confirm order appears in Supabase `orders` table.
- Confirm `/api/health` shows `database: connected`.

## 6) Optional hardening

- Add custom domains to Vercel and Render.
- Add uptime monitoring for `/api/health`.
- Rotate secrets every 90 days.
- Rotate Supabase service role key if exposed.
