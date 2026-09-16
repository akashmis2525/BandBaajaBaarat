# Band Baaja Baarat API

Base URL: `http://localhost:4000/api` (LAN devices must use `http://<LAN-IP>:4000/api`)

The server binds to `0.0.0.0`. Set `EXPO_PUBLIC_API_URL` on the device; do not hardcode a developer IP in source.

All responses use:

```json
{ "success": true, "message": "…", "data": {} }
```

Errors:

```json
{ "success": false, "message": "…" }
```

`error` details are included only outside staging and production.

Authenticated routes require `Authorization: Bearer <accessToken>`.

Roles: `customer` | `vendor`. There is no admin API.

OTP is stored hashed, expires in 5 minutes, and cannot be reused.

- `NODE_ENV=development` or `test`: send-OTP may include `otp` so the 4-digit UI can be tested without SMS.
- `NODE_ENV=staging` or `production`: OTP is **never** returned. `SMS_PROVIDER` + `SMS_API_KEY` are required. Missing SMS configuration returns **503**. OTP is never written to logs.

Staging and production require `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGODB_URI`, and an explicit `CORS_ORIGIN` list (never `*`). Native apps with no `Origin` header are allowed; unknown browser origins are rejected.

`GET /api/health` returns `{ status: "ok", environment, database }` and does not expose secrets or connection strings.

---

## Auth

Rate limited (40 / 15 min): OTP send, OTP verify, vendor email login. Refresh is rate limited (60 / 15 min).

| Method | Path | Auth | Role | Request | Response | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| GET | /health | No | — | — | `{ status: "ok", environment, database }` | — |
| POST | /auth/otp/send | No | — | `{ phone, role? }` | `{ phone, expiresInSeconds, otp? }` | 400 invalid phone, 429 rate limit, 503 SMS not configured |
| POST | /auth/otp/verify | No | — | `{ phone, otp, role? }` | `{ accessToken, refreshToken, user, isNewUser }` | 400 incorrect/expired, 403 blocked, 429 attempts |
| POST | /auth/vendor/email-login | No | vendor | `{ email, password }` | `{ accessToken, refreshToken, user }` | 401 invalid, 403 blocked |
| POST | /auth/refresh | No | — | `{ refreshToken }` | `{ accessToken, refreshToken, user }` | 401 |
| POST | /auth/logout | Yes | — | `{ refreshToken? }` | `{}` | 401 |
| GET | /auth/me | Yes | — | — | `{ user, vendor? }` | 401 |
| POST | /auth/complete-profile | Yes | — | `{ name, email, whatsappNumber, referralCode? }` | `{ user }` | 400 |
| POST | /auth/referral | Yes | — | `{ referralCode }` | `{ user }` | 400 self-referral, 404, 409 duplicate |

Blocked/deactivated users cannot authenticate. Logout drops the presented refresh token (or all sessions if omitted).

---

## Users

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | /users/me | Yes | Current profile |
| PATCH | /users/me | Yes | Update profile fields from Edit Profile / Settings |
| POST | /users/me/password | Yes | Set or change password |
| PATCH | /users/me/notifications | Yes | Notification settings |
| PATCH | /users/me/privacy | Yes | Privacy toggles |
| GET | /users/me/referral | Yes | Referral code + history (reward amounts are server-controlled) |
| DELETE | /users/me | Yes | Deactivate account (`isBlocked=true`) |

---

## Catalog / discovery

Queries run in MongoDB with indexes on category, city, rating, price, and geo. Pagination is `page` + `limit` (max 50). Public vendor payloads never include wallet or KYC bank details.

| Method | Path | Auth | Query / body |
| --- | --- | --- | --- |
| GET | /services | No | `category`, `q` |
| GET | /vendors | Optional | `q`, `category`, `city`, `type`, `sort=recommended\|price_low\|price_high\|rating\|distance`, `minRating`, `onlyVerified`, `priceMin`, `priceMax`, `lat`, `lng`, `maxKm`, `page`, `limit` |
| GET | /vendors/:id | Optional | ObjectId required |
| GET | /location/stats | No | `city` — live MongoDB count |
| GET | /coupons | No | `category` — active, unexpired |
| POST | /coupons/apply | Yes | `{ code, amount }` — expiry, min amount, usage limit, duplicate use |
| GET | /faqs | No | — |

---

## Bookings

Owners only: customer or assigned vendor. Invalid ObjectIds return 400. Cancelled/completed bookings cannot be rescheduled. Duplicate vendor+date+time for active bookings is rejected (409). Calendar blocked dates are enforced. Coupon discounts are calculated on the server.

Bookings are created with `paymentStatus: pending`. Wallet credits happen only after payment is recorded.

| Method | Path | Auth | Role | Body / notes |
| --- | --- | --- | --- | --- |
| GET | /bookings | Yes | — | `status=All\|Upcoming\|Completed\|Cancelled` |
| POST | /bookings | Yes | customer | vendorProfileId, eventDate, eventTime, location, price, couponCode? |
| GET | /bookings/:id | Yes | owner | — |
| POST | /bookings/:id/cancel | Yes | customer owner | `{ reason }` |
| POST | /bookings/:id/reschedule | Yes | customer owner | `{ eventDate, eventTime, reason }` |
| POST | /bookings/:id/confirm-payment | Yes | customer owner | `{ paymentMode? }` — **503 in production unless `PAYMENT_GATEWAY` is set**. Development/test records the advance/balance without a card processor. This is not a Razorpay/Stripe charge. |
| PATCH | /bookings/:id/execution | Yes | assigned vendor | `{ executionStep: 1-4 }` — cannot move backwards or update cancelled bookings |

---

## Vendor

| Method | Path | Auth | Role |
| --- | --- | --- | --- |
| GET | /vendor/dashboard | Yes | vendor — metrics from MongoDB |
| POST | /vendor/kyc | Yes | vendor — stores KYC as `submitted` (not auto-verified) |
| PATCH | /vendor/profile | Yes | vendor |
| GET | /vendor/leads | Yes | vendor (own leads) |
| PATCH | /vendor/leads/:id | Yes | vendor owner | `{ status: new\|contacted\|quoted\|closed }` |
| POST | /leads | Yes | customer |
| POST | /quotations | Yes | vendor — lead must belong to the vendor when `leadId` is sent |
| POST | /negotiations | Yes | customer or vendor |
| POST | /negotiations/:id/agree | Yes | participant |
| GET/POST | /meetings | Yes | — |
| PATCH | /meetings/:id | Yes | participant |
| GET/POST | /portfolio | Yes | vendor (GET may pass `vendorId`) |
| DELETE | /portfolio/:id | Yes | vendor owner |
| GET/PUT | /calendar | Yes | vendor |
| GET | /wallet | Yes | vendor |
| POST | /wallet/withdraw | Yes | vendor | `{ amount }` — atomic, cannot exceed balance |
| GET | /vendor/reviews | Yes | vendor |

---

## Favorites, addresses, payments

| Method | Path | Notes |
| --- | --- | --- |
| GET/POST | /favorites | Unique per user+vendor |
| GET/POST | /addresses | Owner scoped |
| PATCH/DELETE | /addresses/:id | Owner scoped; missing = 404 |
| GET/POST | /payment-methods | Owner scoped |
| DELETE | /payment-methods/:id | Owner scoped |
| POST | /payment-methods/:id/default | Owner scoped |

Card PAN is never stored. Only brand, last4 and a masked subtitle are saved. CVV is ignored and discarded.

---

## Chat

| Method | Path |
| --- | --- |
| GET | /conversations |
| POST | /conversations `{ vendorProfileId }` | customer only |
| GET | /conversations/:id/messages | participants only |
| POST | /conversations/:id/messages `{ text }` | participants only |

Realtime: Socket.IO namespace `/`, auth via `auth.token`. `conversation:join` is allowed only for participants. Events: `conversation:join`, `message:new`.

---

## Notifications, reviews, support, uploads

| Method | Path | Notes |
| --- | --- | --- |
| GET | /notifications | Owner only |
| POST | /notifications/:id/read | Owner only |
| POST | /notifications/read-all | Owner only |
| POST | /reviews | Requires a **completed** booking owned by the customer; one review per booking |
| GET/POST | /support/tickets | Owner only |
| POST | /uploads | Auth required. JPEG/PNG/WebP, 5MB, MIME + magic-byte check, random filenames |

KYC identity numbers live in MongoDB on the vendor profile and are returned only to the owning vendor.

---

## Pagination

List endpoints that paginate return:

```json
{
  "items": [],
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

---

## Production configuration blockers

These cannot be invented by the application:

```
MONGODB_URI=REQUIRED_FOR_PRODUCTION
JWT_SECRET=REQUIRED_FOR_PRODUCTION
JWT_REFRESH_SECRET=REQUIRED_FOR_PRODUCTION
CORS_ORIGIN=https://your-app.example,https://vendor.example
SMS_PROVIDER=REQUIRED_FOR_PRODUCTION_OTP
SMS_API_KEY=REQUIRED_FOR_PRODUCTION_OTP
PAYMENT_GATEWAY=REQUIRED_FOR_LIVE_CHECKOUT
PUBLIC_BASE_URL=https://api.example.com
```

OTP SMS template should include a 4-digit code and 5-minute expiry.

Seed data (`npm run seed` in `backend/`) is for development only. Do not run it against a production database.
