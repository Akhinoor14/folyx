# Internal Connections & Navigation Guide

## Architecture Overview

Your Folyx app has 4 main sections that need to connect properly:

```
folyx.com (Company Website)
├─ /company        → Marketing site
├─ /admin          → Admin dashboard
├─ /boss           → Client dashboards
└─ /portfolio      → Individual portfolios

Subdomains:
├─ folyx.com       → /company (redirects)
├─ admin.folyx.com → /admin 
├─ name.folyx.com  → /portfolio/name
└─ (no boss subdomain, accessed via boss.folyx.com/[clientId])
```

---

## Current Routing Logic (from middleware.ts)

### Path Rewriting

```
Company Website:
  folyx.com/          → /company/
  folyx.com/features  → /company/features
  www.folyx.com/*     → /company/*

Admin Dashboard:
  admin.folyx.com/    → /admin/
  admin.folyx.com/dashboard → /admin/dashboard

Client Portfolios:
  john.folyx.com/     → /portfolio/john/
  john.folyx.com/projects → /portfolio/john/projects

Client Dashboards:
  folyx.com/boss/[clientId]/ → /boss/[clientId]/
```

---

## Navigation Connections Checklist

### 1. Company → Admin
**Link:** `https://admin.folyx.com/login`

Check: [src/app/company/page.tsx](src/app/company/page.tsx)
```tsx
// Should have button linking to admin
<a href="https://admin.folyx.com/login">Admin Login</a>
```

### 2. Company → Portfolio Listings  
**Link:** `https://folyx.com/portfolios` lists all client portfolios

This should fetch from GitHub/Supabase and show cards with links like:
```tsx
<a href={`https://${portfolio.subdomain}.folyx.com`}>
  View Portfolio
</a>
```

### 3. Admin → Create New Client
**Flow:**
1. Admin creates client in dashboard
2. Client gets assigned `subdomain` in database
3. Creates GitHub repo with portfolio data
4. Client access: `https://[subdomain].folyx.com`

### 4. Client → Their Portfolio
**Routes:**
- Personal: `https://john.folyx.com`
- Dashboard: `https://folyx.com/boss/[clientId]/dashboard`

These must cross between subdomains properly.

### 5. Portfolio → Edit (if logged in)
**Flow:**
- Portfolio loads at `john.folyx.com`
- "Edit" button → redirects to dashboard at `https://folyx.com/boss/[clientId]/dashboard`
- Uses client ID (from Supabase) to identify user

---

## Key Files That Need Connection Review

### 1. Company Navigation
**File:** [src/app/company/page.tsx](src/app/company/page.tsx)
- [ ] Has link to admin login
- [ ] Lists all portfolios (from GitHub API)
- [ ] Each portfolio links to correct subdomain

### 2. Admin Dashboard
**File:** [src/app/admin/dashboard/page.tsx](src/app/admin/dashboard/page.tsx)
- [ ] Shows all clients
- [ ] "New Client" button creates subdomain
- [ ] Dashboard actions update GitHub/Supabase

### 3. Client Portfolio
**File:** [src/app/portfolio/[subdomain]/page.tsx](src/app/portfolio/[subdomain]/page.tsx)
- [ ] Fetches client data from GitHub by subdomain
- [ ] Shows "Edit" button (if user is logged in)
- [ ] Edit button links to: `https://folyx.com/boss/[clientId]/dashboard`

### 4. Client Dashboard
**File:** [src/app/boss/[clientId]/layout.tsx](src/app/boss/[clientId]/layout.tsx)
- [ ] Protects routes (must be logged in)
- [ ] Has "View Portfolio" button
- [ ] Button links to: `https://[subdomain].folyx.com`

---

## Potential Connection Issues & Fixes

### Issue 1: Portfolio doesn't know its Client ID
**Problem:** Portfolio page loads but can't link to edit dashboard

**Fix:** Store client ID in portfolio data
```typescript
// In GitHub portfolio repo, add .folyx/config.json:
{
  "clientId": "uuid-from-supabase",
  "subdomain": "john",
  "name": "John Doe"
}
```

### Issue 2: Admin creates client but portfolio doesn't appear
**Problem:** New client created but `subdomain.folyx.com` shows 404

**Likely causes:**
- DNS cache (wait 24hrs)
- Client not actually created in Supabase
- GitHub repo not created
- `getClientInfo()` function failing

**Fix:** Check [src/lib/github.ts](src/lib/github.ts)
```typescript
export async function getClientInfo(subdomain: string): Promise<ClientInfo | null> {
  // Must:
  // 1. Query Supabase for client with matching subdomain
  // 2. If not found, return null (triggers 404)
  // 3. If found, fetch data from GitHub repo
  // 4. Return complete ClientInfo object
}
```

### Issue 3: Cross-subdomain navigation doesn't work
**Problem:** Can't navigate from `john.folyx.com` to `folyx.com/boss/...`

**Fix:** Use absolute URLs with domain:
```tsx
// ❌ Wrong - stays on same subdomain
<a href="/boss/123/dashboard">Edit</a>

// ✅ Correct - goes to main domain
<a href="https://folyx.com/boss/123/dashboard">Edit</a>
```

### Issue 4: Admin login redirects to wrong place
**Problem:** After login on `admin.folyx.com`, redirects to `john.folyx.com` 

**Fix:** Check [src/app/admin/login/page.tsx](src/app/admin/login/page.tsx)
```tsx
// After successful login, redirect to:
router.push('https://admin.folyx.com/dashboard')
// NOT just: router.push('/dashboard')
```

---

## Implementation Checklist

### Portfolio Pages
- [ ] [src/app/portfolio/[subdomain]/page.tsx](src/app/portfolio/[subdomain]/page.tsx) - loads portfolio
- [ ] [src/app/portfolio/[subdomain]/about/page.tsx](src/app/portfolio/[subdomain]/about/page.tsx)
- [ ] [src/app/portfolio/[subdomain]/projects/page.tsx](src/app/portfolio/[subdomain]/projects/page.tsx)
- [ ] [src/app/portfolio/[subdomain]/studio/page.tsx](src/app/portfolio/[subdomain]/studio/page.tsx) - books/courses/etc
- [ ] Edit button on portfolio → links to `https://folyx.com/boss/[clientId]/dashboard`

### Admin Pages
- [ ] [src/app/admin/login/page.tsx](src/app/admin/login/page.tsx) - login form
- [ ] [src/app/admin/dashboard/page.tsx](src/app/admin/dashboard/page.tsx) - lists clients
- [ ] [src/app/admin/dashboard/clients/new/page.tsx](src/app/admin/dashboard/clients/new/page.tsx) - create client
- [ ] Creating client generates subdomain & GitHub repo

### Client Dashboard (Boss) Pages  
- [ ] [src/app/boss/[clientId]/layout.tsx](src/app/boss/[clientId]/layout.tsx) - auth protected
- [ ] [src/app/boss/[clientId]/dashboard/page.tsx](src/app/boss/[clientId]/dashboard/page.tsx) - main dashboard
- [ ] [src/app/boss/[clientId]/settings/page.tsx](src/app/boss/[clientId]/settings/page.tsx) - settings
- [ ] Navbar has link to `https://[subdomain].folyx.com` (View Portfolio button)

### Company Pages
- [ ] [src/app/company/page.tsx](src/app/company/page.tsx) - homepage
- [ ] [src/app/company/portfolios/page.tsx](src/app/company/portfolios/page.tsx) - lists all portfolios
- [ ] [src/app/company/contact/page.tsx](src/app/company/contact/page.tsx) - contact form

---

## Environment Variables Needed

These must be set in Vercel:

```
NEXT_PUBLIC_APP_DOMAIN=folyx.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GITHUB_TOKEN=...
GITHUB_OWNER=your-github-username
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=auto
AWS_BUCKET_NAME=...
```

---

## Testing Each Connection

### Local Test (with subdomains)
```bash
# Terminal 1: Start app
npm run dev

# Terminal 2: Test each section
# Company
curl http://localhost:3000?subdomain=company

# Admin
curl http://localhost:3000?subdomain=admin

# Portfolio
curl http://localhost:3000?subdomain=john

# Client Dashboard (via URL manipulation)
curl http://localhost:3000/boss/client-uuid/dashboard
```

### Production Test (after DNS fixes)
```bash
# Company
curl https://folyx.com
curl https://www.folyx.com

# Admin
curl https://admin.folyx.com

# Portfolio
curl https://john.folyx.com

# All should return HTML, not 404 or redirect loops
```

---

## Summary of What Needs to Connect

| From | To | URL | Must Use |
|------|----|----|----------|
| Company | Admin Login | admin.folyx.com/login | Absolute URL |
| Company | Portfolio List | folyx.com/portfolios | Absolute URL |
| Company | View Portfolio | john.folyx.com | Absolute URL |
| Portfolio | Edit Dashboard | folyx.com/boss/ID | Absolute URL |
| Admin | New Client | Creates subdomain | GitHub API |
| Admin | View Client Portfolio | [subdomain].folyx.com | Absolute URL |
| Dashboard | View Portfolio | [subdomain].folyx.com | Absolute URL |
| Portfolio | Studio | [subdomain].folyx.com/studio | Relative OK |

**Key Rule:** When crossing subdomains or domains, ALWAYS use absolute URLs with the full domain.

