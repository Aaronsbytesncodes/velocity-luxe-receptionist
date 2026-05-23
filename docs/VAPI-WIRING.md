# Vapi wiring — production

**Live app:** https://velocity-luxe-receptionist.vercel.app

## Vercel env vars (required)

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Neon connection string (prefer **pooled** from Neon dashboard) |
| `NEXT_PUBLIC_APP_URL` | `https://velocity-luxe-receptionist.vercel.app` |
| `ADMIN_SECRET` | Your secret for `/onboarding` |
| `VAPI_API_KEY` | From https://dashboard.vapi.ai |

After changing env vars → **Deployments → Redeploy**.

**Health check:** https://velocity-luxe-receptionist.vercel.app/api/health  
Should return `{ "ok": true, "database": "connected" }`.

---

## Vapi dashboard

### 1. Phone number
- **Phone Numbers** → Create or import (Twilio) → copy **Phone Number ID**

### 2. Server URL (global or per assistant)
```
https://velocity-luxe-receptionist.vercel.app/api/webhooks/vapi
```

### 3. Onboard a contractor
1. https://velocity-luxe-receptionist.vercel.app/onboarding
2. Enter `ADMIN_SECRET` + business details + Cal.com (optional)
3. Paste **Vapi phone number ID** → creates assistant automatically

### 4. Link number to assistant
If not done in onboarding: Vapi → Phone Number → **Inbound Assistant** = the new assistant ID from onboarding success screen.

### 5. Test call
Call the Vapi number → book appointment → check dashboard + contractor SMS (if Twilio configured).

---

## Tool endpoints (automatic)

Created per contractor when assistant is provisioned:

- `https://velocity-luxe-receptionist.vercel.app/api/tools/check-availability?contractorId=...`
- `https://velocity-luxe-receptionist.vercel.app/api/tools/book-appointment?contractorId=...`

Requires `NEXT_PUBLIC_APP_URL` set correctly at assistant creation time.
