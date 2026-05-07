# Subdomain Routing Fix - Production Issues

## Problem
Subdomains not working live (e.g., `john.folyx.com`, `admin.folyx.com` not routing correctly).

## Root Cause
Three things are needed for subdomain routing to work in production:

1. **DNS Wildcard Record** - Not pointing to Vercel
2. **Vercel Domain Config** - Not accepting all subdomains
3. **Middleware Header** - `x-forwarded-host` not being sent by Vercel

---

## Solution

### Step 1: Add Wildcard DNS Record

Go to your domain registrar (wherever you bought `folyx.com`):

**Add this DNS record:**
```
Type: CNAME
Name: *.folyx.com
Value: cname.vercel-dns.com
```

**Also verify:**
```
Type: A
Name: folyx.com (root)
Value: 76.76.19.163

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

### Step 2: Add Domain to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Domains**
4. Add `folyx.com` if not already there
5. Under `folyx.com`, click **Add** and add `*.folyx.com`

Vercel should show all as "Valid Configuration"

---

### Step 3: Update `vercel.json` for Rewrites

Replace your current `vercel.json` with:

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "Service-Worker-Allowed", "value": "/" }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

### Step 4: Update `next.config.js` for Better Support

Add this to ensure Vercel passes headers correctly:

```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'folyx-cache',
        expiration: { maxEntries: 200, maxAgeSeconds: 86400 },
        networkTimeoutSeconds: 10,
      },
    },
  ],
})

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  // Important: Enable experimental server actions
  experimental: {
    serverActions: {
      allowedOrigins: ['*.folyx.com', 'folyx.com', 'localhost:3000'],
    },
  },
}

module.exports = withPWA(nextConfig)
```

---

## Testing

### Local Testing
```bash
# Start dev server
npm run dev

# Test subdomains with:
http://localhost:3000?subdomain=john      # Portfolio
http://localhost:3000?subdomain=admin     # Admin panel
http://localhost:3000                     # Company website
```

### Production Testing (after DNS propagates)
```bash
# Wait 24-48 hours for DNS to propagate, then test:
https://john.folyx.com       # Should load john's portfolio
https://admin.folyx.com      # Should load admin panel
https://folyx.com            # Should load company site
https://www.folyx.com        # Should load company site
```

---

## Troubleshooting

### Subdomains still not working after 48 hours?

1. **Check DNS propagation:**
   - Go to [MXToolbox](https://mxtoolbox.com/problem/cname)
   - Enter `folyx.com`
   - Verify both `*.folyx.com` and `folyx.com` are pointing to Vercel

2. **Check Vercel certificate:**
   - In Vercel Dashboard → Domain Settings
   - Click the domain and scroll to "Certificate"
   - Should show "Valid" for all subdomains

3. **Check middleware logs:**
   - In Vercel dashboard, check Function Logs
   - Verify `x-forwarded-host` header is being received

4. **Redeploy:**
   ```bash
   git push origin main
   # Vercel auto-deploys
   ```

---

## How It Works

1. User visits `john.folyx.com`
2. DNS resolves to Vercel
3. Middleware reads `x-forwarded-host: john.folyx.com`
4. Extracts subdomain: `john`
5. Rewrites internally to `/portfolio/john`
6. Next.js matches `app/portfolio/[subdomain]/layout.tsx`
7. Calls `getClientInfo('john')` to load portfolio data

---

## Files to Update

- [ ] DNS at your domain registrar (add wildcard CNAME)
- [ ] Vercel dashboard (add *.folyx.com domain)
- [x] `vercel.json` - Updated above
- [x] `next.config.js` - Updated above
- [x] `src/middleware.ts` - Already correct!

