# Deploy — Aaronsbytesncodes / Vercel

Repo: https://github.com/Aaronsbytesncodes/velocity-luxe-receptionist

## 1. Push code (if not on GitHub yet)

```powershell
cd velocity-luxe-receptionist
git init
git add .
git commit -m "Initial commit: Velocity Luxe Media AI receptionist"
git branch -M main
git remote add origin https://github.com/Aaronsbytesncodes/velocity-luxe-receptionist.git
git push -u origin main
```

If `remote origin already exists`:

```powershell
git remote set-url origin https://github.com/Aaronsbytesncodes/velocity-luxe-receptionist.git
git push -u origin main
```

## 2. Neon Postgres (free)

1. https://neon.tech → Sign up → New project
2. Copy **connection string** (pooled URL is fine)
3. Keep it for Vercel `DATABASE_URL`

## 3. Create tables (once)

On your PC, with the Neon URL in `.env`:

```powershell
cd velocity-luxe-receptionist
# .env contains DATABASE_URL=postgresql://...
npx prisma db push
```

## 4. Vercel

1. https://vercel.com/new → Import **Aaronsbytesncodes/velocity-luxe-receptionist**
2. **Environment variables** (Production):

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://...` from Neon |
| `ADMIN_SECRET` | `vlm-prod-CHANGE-THIS-long-random` |
| `NEXT_PUBLIC_APP_URL` | `https://velocity-luxe-receptionist.vercel.app` (your real URL) |
| `VAPI_API_KEY` | from Vapi dashboard |

Optional: `TWILIO_*`, `RESEND_API_KEY`

3. **Deploy**

4. After deploy, open your site → `/onboarding` → test with `ADMIN_SECRET`

## 5. Vapi webhook

In [Vapi Dashboard](https://dashboard.vapi.ai) → each assistant:

- **Server URL:** `https://YOUR-VERCEL-URL.vercel.app/api/webhooks/vapi`

Tool URLs are set automatically when you create a contractor (uses `NEXT_PUBLIC_APP_URL`).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Prisma | Ensure `DATABASE_URL` is set; run `npx prisma db push` locally first |
| 401 on onboarding | `ADMIN_SECRET` in Vercel must match what you type on the form |
| Calls work but no booking | Contractor needs `calcomApiKey` + `calcomEventTypeId` in onboarding |
