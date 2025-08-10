# Next.js Phantom Token Auth (Opaque Token, No PII)

A minimal, production-ready authentication starter using **Next.js (App Router)**, **MongoDB (Mongoose)**, and **opaque (phantom) access tokens** stored in **httpOnly Secure cookies** — with **no PII inside tokens**. The server stores **only a SHA-256 hash** of each token, and an **introspection endpoint** converts the opaque token into minimal claims (`sub`, `scope`, `exp`) on each protected request.

> Repo: https://github.com/mistrypavankumar/nextjs-phantom-token-auth

---

## ✨ Highlights

- **Opaque token (phantom) pattern** — browser holds a random string only
- **No PII in tokens** — only `sub` + `scope` returned via introspection
- **Hash-at-rest** — DB stores `tokenHash` (SHA-256), never raw tokens
- **httpOnly + Secure cookies** — mitigate XSS token theft
- **Revocation-ready** — immediate invalidation via DB (`revoked: true`)
- **Middleware protection** — redirects pages, 401s APIs, forwards `x-sub`/`x-scope`
- **Optional NGINX front-door auth** with `auth_request`
- **Session policy** — single-session or capped multi-session included

---

## 🧱 Tech Stack

- **Next.js** (App Router, Route Handlers, Middleware)
- **MongoDB + Mongoose**
- **bcryptjs** for password hashing
- **Zod** for input validation

---

## 📁 Project Structure (key files)

```
app/
  page.tsx                  # public home (redirects to /dashboard if logged-in via middleware or page guard)
  login/page.tsx            # login form (calls /api/auth/login)
  register/page.tsx         # registration form (calls /api/auth/register)
  dashboard/page.tsx        # protected page, shows sub + scope and logout
  dashboard/LogoutButton.tsx

  api/auth/
    register/route.ts       # POST register
    login/route.ts          # POST login (issues opaque token; stores hash only)
    logout/route.ts         # POST logout (revokes token; clears cookie)
    introspect/route.ts     # POST turns opaque token -> { active, sub, scope, exp }
    authorize/route.ts      # GET authorize for NGINX auth_request (optional)

lib/
  db.ts                     # mongo connection cache
  opaque.ts                 # generateOpaqueToken, hashOpaqueToken, addSeconds

models/
  User.ts                   # email + hashed password
  AccessToken.ts            # tokenHash, userId, scope, expiresAt, revoked

middleware.ts               # protects routes, forwards x-sub/x-scope
.env.local                  # environment variables
```

---

## ⚙️ Setup

### 1) Clone the repo

```bash
git clone https://github.com/mistrypavankumar/nextjs-phantom-token-auth

cd nextjs-phantom-token-auth

```

### 2) Install deps

```bash
npm i
```

### 3) Environment

Create `.env.local`:

```ini
MONGODB_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

MAX_ACTIVE_TOKENS=5
```

### 3) Run

```bash
npm run dev
```

Open http://localhost:3000 — register, login, and visit `/dashboard`.

> In production, ensure HTTPS so `Secure` cookies work. Set `NEXT_PUBLIC_BASE_URL` to your public origin.

---

## 🔐 Auth Flow (Phantom/Opaque)

1. **Login** → server verifies credentials
2. Server mints **opaque token** (random string) and stores **SHA-256 hash** with `userId`, `scope`, `expiresAt`, `revoked:false`
3. Browser receives `phantom_token` cookie (`httpOnly`, `SameSite=Lax`, `Secure` in prod)
4. On protected routes, **middleware** calls `/api/auth/introspect` with the opaque token
5. Introspect returns **no PII**: `{ active, sub, scope, exp }`
6. Middleware forwards `x-sub` and `x-scope` headers to downstream handlers/pages
7. **Logout** revokes the token and clears the cookie

---

## 🛣️ API Endpoints

### `POST /api/auth/register`

```jsonc
// request
{ "email": "you@example.com", "password": "min8chars", "name": "Optional" }

// response (201)
{ "message": "Registered successfully" }
```

### `POST /api/auth/login`

```jsonc
// request
{ "email": "you@example.com", "password": "min8chars" }

// response (200) + httpOnly cookie "phantom_token"
{ "message": "Logged in" }
```

### `POST /api/auth/logout`

- Revokes the current opaque token and clears cookie.

### `POST /api/auth/introspect`

```jsonc
// request
{ "token": "<opaque string from cookie>" }

// response
{ "active": true, "sub": "userId", "scope": ["read"], "exp": 1735324816 }
```

---

## 🧩 Middleware

- For **public** pages `/`, `/login`, `/register`: if logged in, redirects to `/dashboard`.
- For **protected** pages/APIs (e.g., `/dashboard`, `/api/private/*`): introspects the opaque token, 401/redirects when inactive.
- For **downstream** handlers: forwards only **non-PII** headers `x-sub` and `x-scope`.

> Ensure the file is **`/middleware.ts`** at the project root. Restart the dev server after changes.

---

## 🔁 Session Policy (choose one)

- **Single-session (strict)**: revoke all existing tokens for user on login.
- **Capped multi-session (default)**: keep up to `MAX_ACTIVE_TOKENS` (e.g., 5) and revoke oldest beyond the cap.
- **Unlimited**: no cap; rely on `expiresAt` + TTL index for cleanup.
- **Sliding**: extend `expiresAt` on activity near expiry (optional).

> The project includes a **capped multi-session** example in the login route. Tune via `MAX_ACTIVE_TOKENS` or switch to single-session by revoking everything before minting a new token.

---

## 🛡️ Security Notes

- Store only **token hashes**; never the raw token value.
- **No PII** in tokens or forwarded headers — fetch PII server-side when needed.
- Use **Strong password hashing** (`bcrypt` with cost ~10–12).
- Cookies: `httpOnly`, `SameSite=Lax`, **`Secure` in production**.
- Add **rate limiting** to `/api/auth/*` (e.g., IP-based, user-based).
- Consider **CSRF protections** for sensitive state-changing endpoints if you accept cross-site POSTs.
- Use HTTPS everywhere in production.

---

## ❓ FAQ

**Q: Why opaque tokens instead of JWTs?**  
A: Real-time revocation and centralized validation; no PII leaves the backend; keys/signatures don’t need to be distributed.

**Q: Can I add Google/GitHub login?**  
A: Yes — use OAuth/OIDC to authenticate, then still issue an **opaque token** for your app sessions.

**Q: How do I show the user’s profile?**  
A: Use `x-sub` to fetch the user from DB **server-side**. Never rely on token-stored PII.

---

## 🧪 Quick Test Plan

1. Register a user → Login → Check `phantom_token` cookie set.
2. Hit `/dashboard` → Should load; shows `sub` + `scope`.
3. Call `/api/auth/logout` → Should clear cookie and revoke token.
4. Try `/dashboard` again → Should redirect to `/login`.
5. Visit `/` while logged-in → Should redirect to `/dashboard` (middleware).

---

## 📜 License

MIT © 2025 [Pavan Kumar Mistry](https://github.com/mistrypavankumar)

---

If you find this useful, ⭐ the repo and open issues/PRs with suggestions!
