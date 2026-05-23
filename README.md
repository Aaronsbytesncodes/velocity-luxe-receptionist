# Velocity Luxe Media — AI Receptionist

AI phone answering + lead booking for contractors. Built for **cold-call sales** with **7-day free trials** and **real Cal.com calendar slots**.

## What it does

1. **Inbound call** → Vapi AI answers with the contractor's greeting
2. **Qualifies** → service, address, urgency, contact info
3. **Checks availability** → live Cal.com slots via `/api/tools/check-availability`
4. **Books appointment** → Cal.com booking + lead in dashboard
5. **Alerts contractor** → SMS (Twilio) + email (Resend)

**Repository:** https://github.com/Aaronsbytesncodes/velocity-luxe-receptionist

## Quick start (local demo)

```bash
cd velocity-luxe-receptionist
cp .env.example .env
# Edit .env — at minimum set ADMIN_SECRET and VAPI_API_KEY

npm install
npm run db:push
npm run dev
```

Open http://localhost:3000

## Cold-call workflow

Use this on a live sales call:

1. **Open** `/onboarding` on your laptop
2. **Fill in** contractor details while they're on the phone (business name, trade, mobile for alerts)
3. **Connect Cal.com** — have them share API key + event type ID, or set up a free Cal.com account for them
4. **Create trial** → system spins up Vapi assistant automatically
5. **Assign phone number** in [Vapi dashboard](https://dashboard.vapi.ai) → link number to new assistant
6. **Live demo** → call the number from your phone, book a slot, show SMS hit their phone
7. **Close** → "7 days free, then $497/mo" (Professional — see pricing below)

## Deploy for production demos

Deploy to **Vercel** (or Railway) so Vapi webhooks reach your app:

1. Push repo to GitHub
2. Import in Vercel
3. Set env vars from `.env.example`
4. Use **Postgres** in production (Neon/Supabase) — change `provider` in `prisma/schema.prisma` to `postgresql`
5. Set `NEXT_PUBLIC_APP_URL` to your production URL
6. In Vapi → assistant **Server URL** = `https://yourdomain.com/api/webhooks/vapi`

For local webhook testing use [ngrok](https://ngrok.com): `ngrok http 3000`

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `ADMIN_SECRET` | Yes | Protects trial signup (you enter on onboarding form) |
| `VAPI_API_KEY` | Yes | Creates assistants + handles calls |
| `NEXT_PUBLIC_APP_URL` | Yes | Tool webhook base URL |
| `CALCOM_*` | Per contractor | Stored per contractor in DB during onboarding |
| `TWILIO_*` | Optional | SMS lead alerts |
| `RESEND_API_KEY` | Optional | Email lead alerts |

## Pricing (Velocity Luxe Media)

Premium positioning — contractors lose $300–$2,000+ per missed emergency call. Don't underprice.

| Tier | Price | Best for |
|------|-------|----------|
| Trial | Free 7 days | Full Professional features, your cost ~$15–40 in voice minutes |
| **Essentials** | **$297/mo** | Business-hours only, single line, 500 min |
| **Professional** | **$497/mo** | 24/7 — **default on cold calls** |
| **Elite** | **$797/mo** | 2 lines, high volume, script tuning |

Position against missed calls: *"One emergency job you miss is $800+. This is $497."*

Annual option (optional close): 2 months free at **$4,970/yr** (Professional).

Pricing constants live in `src/lib/pricing.ts` — update once, sync scripts & site.

## Cold-call pitch (30 sec)

> "Hey [Name], quick question — when you're on a job and the phone rings, what happens?"
>
> "We built an AI receptionist under Velocity Luxe Media that answers like your office, books real appointments on your calendar, and texts you the lead. We're doing 7-day free trials — I can set you up in 5 minutes and you can call it right now. Want to try it?"

## Next build steps

- [ ] Stripe billing after trial
- [ ] Contractor self-serve portal (no admin secret)
- [ ] Jobber / ServiceTitan integration
- [ ] Outbound trial reminder calls
- [ ] Branded demo line for Velocity Luxe Media sales

## Stack

- Next.js 15 · Prisma · SQLite (dev) / Postgres (prod)
- [Vapi](https://vapi.ai) voice AI
- [Cal.com](https://cal.com) scheduling
- Twilio SMS · Resend email

---

**Velocity Luxe Media** — Never miss a lead.
