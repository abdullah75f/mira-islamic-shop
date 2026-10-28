# Mira Islamic Shop

Next.js shop for **Mira Islamic Gifts** — public browse/cart + admin stock management.

**Stack:** Vercel (host) · Neon (products DB) · Vercel Blob (product photos)

## Local setup

1. Copy env and fill values:

   ```bash
   cp .env.example .env.local
   ```

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Admin

- URL: `/admin/login`
- Email / password from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`
