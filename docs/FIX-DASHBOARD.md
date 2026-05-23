# Fix dashboard 500 on Vercel

## 1. Use Neon **pooled** URL in Vercel

Neon dashboard → your project → **Connect** → copy **Pooled connection** (not unpooled).

Host looks like: `ep-xxxx-pooler.us-east-1.aws.neon.tech`

Set as `DATABASE_URL` in Vercel → **Redeploy**.

## 2. Push the latest code

```powershell
cd velocity-luxe-receptionist
npm install
git add .
git commit -m "Fix Vercel build: Prisma 6 lockfile + database"
git push
```

If build failed with `prisma generate && next build exited with 1`, it was usually **package-lock.json stuck on Prisma 7**. Run `npm install` locally before push so lockfile matches `package.json`.

Vercel auto-deploys from GitHub.

## 3. Verify

- https://velocity-luxe-receptionist.vercel.app/api/health → `"ok": true`
- https://velocity-luxe-receptionist.vercel.app/dashboard → loads (empty OK)

## Required Vercel env vars

- `DATABASE_URL` (pooled Neon string)
- `NEXT_PUBLIC_APP_URL` = `https://velocity-luxe-receptionist.vercel.app`
- `ADMIN_SECRET`
- `VAPI_API_KEY`
