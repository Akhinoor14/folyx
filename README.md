# Folyx — Professional Portfolio Platform

> Multi-tenant portfolio platform for students and engineers.  
> Built with Next.js 14 · TypeScript · Tailwind CSS · Supabase · GitHub API · Cloudflare R2

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/folyxhq/folyx.git
cd folyx
npm install
cp .env.example .env.local
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Go to Storage → Create bucket `portfolios` (public)
4. Copy your Project URL and anon key to `.env.local`

### 3. Set up GitHub
1. Create a Personal Access Token with `repo` scope
2. Create a template repo named `folyx-portfolio-template`
3. Add token and org/username to `.env.local`

### 4. Set up Cloudflare R2 (for PDFs and GLB files)
1. Create an R2 bucket named `folyx-assets`
2. Set up a custom domain for public access
3. Create API token with R2 write access
4. Add credentials to `.env.local`

### 5. Configure EmailJS
1. Create account at [emailjs.com](https://emailjs.com)
2. Create a service and template
3. Add keys to `.env.local`

### 6. Run locally
```bash
npm run dev
# Company site:  http://localhost:3000
# Portfolio:     http://localhost:3000?subdomain=akhinoor
# Admin:         http://localhost:3000/admin/login
# Boss CMS:      http://localhost:3000/boss/{clientId}/login
```

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add your domain
vercel domains add folyx.com
vercel domains add *.folyx.com   # wildcard for client subdomains
```

Set all environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── company/          # folyx.com — landing, pricing, features, contact
│   ├── portfolio/        # [subdomain].folyx.com — client portfolios
│   ├── admin/            # admin.folyx.com — supreme admin panel
│   ├── boss/             # Only Boss CMS — per-client content manager
│   └── api/              # API routes — clients, github, upload
├── components/
│   ├── shared/           # Navbar, Footer, SplashScreen, SearchModal
│   ├── portfolio/        # ProjectCard, ModelViewer, PDFReader, BookCard
│   ├── admin/            # ClientActions
│   └── boss/             # FileUploader
├── lib/
│   ├── supabase.ts       # Supabase client (browser + server + admin)
│   ├── github.ts         # GitHub API with rate-limit caching
│   ├── r2.ts             # Cloudflare R2 client
│   └── utils.ts          # cn(), formatDate(), APP_CONFIG, PLAN_CONFIG
├── types/
│   ├── client.ts         # ClientInfo, ClientRow, NewClientFormData
│   └── content.ts        # All project and content types
└── middleware.ts          # Multi-tenant subdomain routing
```

---

## 🏗️ Architecture

| Layer | Service | Free Tier |
|-------|---------|-----------|
| Hosting | Vercel | 100 GB/month |
| Database + Auth | Supabase | 500 MB, 50k users |
| Code + Content | GitHub | Unlimited public |
| Images | Supabase Storage | 1 GB |
| PDFs + 3D Models | Cloudflare R2 | 10 GB/month |
| Email | EmailJS | 200/month |
| DNS + CDN | Cloudflare | Free |
| Domain | folyx.com | ~$10/year |

**Total monthly cost: ~$0** (only domain ~$10/year)

---

## 👤 How to Add a New Client

1. Go to `admin.folyx.com` → Dashboard → Add Client
2. Fill in the 3-step form (name, subdomain, plan, academic info)
3. Click "Create Portfolio"

**What happens automatically:**
- ✅ Supabase client row + Boss auth user created
- ✅ GitHub portfolio repo generated from template
- ✅ Vercel subdomain provisioned (`name.folyx.com`)
- ✅ Welcome email sent with login credentials
- ✅ Portfolio live within ~2 minutes

---

## 🔑 Auth Flow

| Role | Login URL | Auth Method |
|------|-----------|-------------|
| Supreme Admin | `/admin/login` | Supabase Auth (admin role in metadata) |
| Client Boss | `/boss/{clientId}/login` | Supabase Auth (boss role + clientId in metadata) |

---

## 📦 Adding Dependencies

```bash
# If you need @aws-sdk for R2:
npm install @aws-sdk/client-s3

# If you need Sharp for image optimization:
npm install sharp
```

---

## 🌍 Environment Variables Reference

See `.env.example` for all required variables.

---

*Built by Folyx · Part of Noor Academy · Bangladesh*
