# Pura Vida Minds 🎨

[![Smoke Test](https://github.com/jcampos187/puravidaminds/actions/workflows/smoke-test.yml/badge.svg)](https://github.com/jcampos187/puravidaminds/actions/workflows/smoke-test.yml)

A bilingual (EN/ES) web platform showcasing Costa Rican artisans and their handmade crafts. Built with Next.js, Clerk auth, Drizzle ORM, Neon Postgres, and Upstash Redis.

**Production:** [puravidaminds.vercel.app](https://puravidaminds.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **Auth:** Clerk
- **Database:** Neon Postgres + Drizzle ORM
- **Cache/Rate Limiting:** Upstash Redis
- **Email:** Resend
- **File Uploads:** UploadThing
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npx tsx scripts/smoke-test.ts` | Deployment smoke test (use `SMOKE_TEST_URL` env) |
| `npx tsx scripts/test-password-validation.ts` | Password validation tests (use `VERIFICATION_URL` env) |
