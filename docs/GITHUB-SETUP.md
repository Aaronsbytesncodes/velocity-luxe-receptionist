# GitHub + Vercel setup

## What Aaron needs to provide

You only need to do **two things** on GitHub; the agent cannot log into your account.

1. **Create an empty repo** on GitHub (no README, no .gitignore — empty).
2. **Repo:** https://github.com/Aaronsbytesncodes/velocity-luxe-receptionist

Optional: tell us your GitHub username if you want the commands pre-filled.

---

## Step 1 — Create the repo (you, in browser)

1. Go to https://github.com/new
2. Repository name: `velocity-luxe-receptionist` (or any name you prefer)
3. **Private** recommended (API keys in env, business logic)
4. Do **not** add README, license, or .gitignore
5. Click **Create repository**

Copy the URL GitHub shows, e.g. `git@github.com:you/velocity-luxe-receptionist.git`

---

## Step 2 — Push code from your PC (you, in terminal)

Open terminal in the project folder:

```powershell
cd path\to\velocity-luxe-receptionist

git init
git add .
git commit -m "Initial commit: Velocity Luxe Media AI receptionist MVP"

git branch -M main
git remote add origin https://github.com/Aaronsbytesncodes/velocity-luxe-receptionist.git
git push -u origin main
```

If GitHub asks you to log in, use **GitHub CLI** or a **Personal Access Token** (not your password):

```powershell
gh auth login
```

Or: GitHub → Settings → Developer settings → Personal access tokens → generate with `repo` scope, use as password when `git push` prompts.

---

## Step 3 — Deploy on Vercel (you, in browser)

1. https://vercel.com → Sign in with **GitHub**
2. **Add New Project** → Import `velocity-luxe-receptionist`
3. Framework: **Next.js** (auto-detected)
4. **Environment variables** — add these before Deploy:

| Name | Value |
|------|--------|
| `ADMIN_SECRET` | Long random string you choose |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR-APP.vercel.app` (update after first deploy if needed) |
| `DATABASE_URL` | See Postgres note below |
| `VAPI_API_KEY` | From Vapi dashboard |
| `TWILIO_ACCOUNT_SID` | Optional |
| `TWILIO_AUTH_TOKEN` | Optional |
| `TWILIO_FROM_NUMBER` | Optional |
| `RESEND_API_KEY` | Optional |

5. Click **Deploy**

### Database on Vercel (important)

SQLite (`file:./dev.db`) does **not** work on Vercel serverless. For production:

1. Create free DB: https://neon.tech or https://supabase.com
2. Copy connection string → `DATABASE_URL`
3. In `prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`
4. Run locally once: `npx prisma db push`
5. Commit and push → Vercel redeploys

---

## Step 4 — Tell the agent (optional)

After the repo exists, you can paste:

- Repo URL
- Vercel URL after deploy

Then we can help wire Vapi server URL and fix any deploy errors.

---

## Checklist

- [ ] Empty GitHub repo created
- [ ] Code pushed to `main`
- [ ] Vercel project connected to that repo
- [ ] Env vars set in Vercel
- [ ] Postgres `DATABASE_URL` (production)
- [ ] `NEXT_PUBLIC_APP_URL` matches Vercel domain
