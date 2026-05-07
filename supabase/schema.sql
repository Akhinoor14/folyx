-- ================================================================
-- Folyx — Supabase Database Schema
-- Run this in Supabase SQL Editor to set up the database
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Clients table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subdomain       TEXT UNIQUE NOT NULL,
  info            JSONB NOT NULL DEFAULT '{}',
  github_repo     TEXT,
  boss_email      TEXT NOT NULL,
  plan            TEXT NOT NULL DEFAULT 'monthly' CHECK (plan IN ('trial','monthly','half_yearly','yearly')),
  status          TEXT NOT NULL DEFAULT 'active'  CHECK (status IN ('active','expired','suspended','trial')),
  end_date        TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── GitHub cache table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS github_cache (
  cache_key   TEXT PRIMARY KEY,
  content     TEXT NOT NULL,
  cached_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-expire cache entries older than 1 day (run via pg_cron or manually)
-- DELETE FROM github_cache WHERE cached_at < NOW() - INTERVAL '1 day';

-- ── Activity logs ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID REFERENCES clients(id) ON DELETE CASCADE,
  action      TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ─────────────────────────────────────────
ALTER TABLE clients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_cache  ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Admin: full access (service role key bypasses RLS)
-- Boss users: can only read their own client row
CREATE POLICY "Boss can read own client"
  ON clients FOR SELECT
  USING (auth.jwt() ->> 'subdomain' = subdomain);

-- ── Supabase Storage buckets ───────────────────────────────────
-- Run in Supabase Dashboard → Storage → New Bucket:
-- Bucket name: "portfolios"  (public: true)
-- Max file size: 10MB
-- Allowed MIME types: image/*, application/pdf

-- ── Indexes ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_clients_subdomain  ON clients(subdomain);
CREATE INDEX IF NOT EXISTS idx_clients_status     ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_end_date   ON clients(end_date);
CREATE INDEX IF NOT EXISTS idx_activity_client_id ON activity_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_github_cache_key   ON github_cache(cache_key);
