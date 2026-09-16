# Staging deployment

Band Baaja Baarat is a React Native / Expo customer + vendor app with an Express API and MongoDB.

Do **not** run `npm run seed` against production. Seed is allowed only for development and staging catalog data.

Status: **READY FOR STAGING** until production MongoDB, SMS, payment gateway, HTTPS, and device testing are complete.

---

## MongoDB

Required:

```
MONGODB_URI=mongodb://127.0.0.1:27017/bandbaajabaarat
```

Staging Atlas example (do not commit credentials):

```
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/bandbaajabaarat_staging
```

After the API starts, mongoose creates schema indexes (unique favorites, unique coupon redemptions, unique active vendor+date+time bookings, OTP TTL, geo `2dsphere`).

Verify indexes against a **real** database:

```
cd backend
npm run verify:indexes
```

Staging catalog (optional, never production):

```
cd backend
npm run seed
```

---

## Backend

```
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env` with real staging values.

Development:

```
npm run dev
```

Staging / production process:

```
npm run build
npm start
```

The process binds to `BIND_HOST` (default `0.0.0.0`) port `PORT` (default `4000`) so LAN devices can connect.

Health:

```
GET /api/health
```

Returns `{ status, environment, database }` with no secrets.

---

## Frontend

```
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` in the project `.env` (see `.env.example`). Restart Expo after changing it.

There is no separate native store build script in `package.json`. Typecheck/build:

```
npm run typecheck
npm test
npm run build
```

(`npm run build` runs `tsc --noEmit`.)

---

## Environment

| Variable | Required in staging | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Yes | Staging cluster or local MongoDB |
| `JWT_SECRET` | Yes | No fallback in staging/production |
| `JWT_REFRESH_SECRET` | Yes | No fallback in staging/production |
| `JWT_EXPIRES_IN` | No | Default `15m` |
| `JWT_REFRESH_EXPIRES_IN` | No | Default `30d` |
| `CORS_ORIGIN` | Yes | Comma-separated allowlist. Never `*` |
| `PUBLIC_BASE_URL` | Yes for uploads | Absolute URL used in upload responses |
| `SMS_PROVIDER` | Yes for OTP SMS | `msg91` or `twilio` |
| `SMS_API_KEY` | Yes for OTP SMS | Never commit |
| `SMS_SENDER` | Provider-specific | MSG91 sender / Twilio From |
| `SMS_TEMPLATE_ID` | MSG91 | DLT template id |
| `TWILIO_ACCOUNT_SID` | Twilio | With `SMS_API_KEY` as auth token |
| `PAYMENT_GATEWAY` | Yes for live charges | Empty = staging ledger only, **503 in production** |
| `EXPO_PUBLIC_API_URL` | Yes on devices | Host only, no trailing `/api` |
| `PORT` | No | Default `4000` |
| `BIND_HOST` | No | Default `0.0.0.0` |
| `NODE_ENV` | Staging: `staging` | `staging`/`production` hide OTP and require secrets |

---

## Mobile / physical device

Do **not** use `http://localhost:4000` on a phone.

1. Phone and PC on the same Wi-Fi.
2. Find the PC LAN IPv4 (Windows: `ipconfig`, look for IPv4 under Wi-Fi).
3. Set `EXPO_PUBLIC_API_URL=http://<LAN-IP>:4000` (no `/api`, no trailing slash).
4. Allow inbound TCP **4000** on Windows Defender Firewall if the phone cannot connect.
5. Restart Expo so the public env var is picked up.

The client always calls `${EXPO_PUBLIC_API_URL}/api/...`.

---

## SMS

Development/test may return `otp` in `POST /api/auth/otp/send`.

Staging/production never return OTP. The 4-digit code is hashed in MongoDB, expires in 5 minutes, and cannot be reused.

If `SMS_PROVIDER` / `SMS_API_KEY` are missing, send-OTP returns **503**. Do not fake SMS success.

Template should include a 4-digit code and 5-minute expiry.

---

## Payments

No Razorpay/Stripe processor is wired.

Staging without `PAYMENT_GATEWAY` records an advance on `POST /api/bookings/:id/confirm-payment` after a real booking exists. Amounts, discounts, and wallet balances are calculated on the server.

Production without `PAYMENT_GATEWAY` returns **503**. Do not fake client-side payment success.

Never store PAN or CVV.

---

## Windows firewall (LAN testing)

If a physical device cannot reach the API:

1. Windows Security → Firewall → Allow an app → Node.js, or
2. Inbound rule: TCP port 4000 on private networks.

---

## Staging checklist

- [ ] Real MongoDB connected
- [ ] MongoDB indexes verified (`npm run verify:indexes`)
- [ ] Customer OTP works (SMS in staging; API `otp` field absent)
- [ ] Vendor login works
- [ ] JWT works
- [ ] Refresh works
- [ ] Logout works
- [ ] Customer profile works
- [ ] Vendor profile works
- [ ] Vendor search works
- [ ] Filters work
- [ ] Favorites work
- [ ] Address works
- [ ] Payment methods work
- [ ] Booking works
- [ ] Booking conflict protection works
- [ ] Reschedule works
- [ ] Cancel works
- [ ] Chat works
- [ ] Notifications work
- [ ] Vendor dashboard works
- [ ] KYC works
- [ ] Portfolio works
- [ ] Calendar works
- [ ] Quotations work
- [ ] Negotiations work
- [ ] Wallet works
- [ ] Withdrawal validation works
- [ ] Upload works (JPEG/PNG/WebP ≤ 5MB)
- [ ] CORS configured (explicit origins, not `*`)
- [ ] Rate limiting works
- [ ] Error handling works (app does not crash when API is down)
- [ ] No secrets exposed in git or logs
- [ ] No OTP returned outside development/test
- [ ] Physical device tested (`EXPO_PUBLIC_API_URL` LAN IP)
