-- Kliiq Dashboard Schema Setup
-- Run this in your Supabase SQL Editor

-- 1. Devices Table
CREATE TABLE IF NOT EXISTS public.devices (
    id TEXT PRIMARY KEY DEFAULT 'DEV-' || lpad(floor(random() * 1000)::text, 3, '0'),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'desktop', -- desktop, laptop, mobile
    os TEXT,
    status TEXT NOT NULL DEFAULT 'offline', -- online, offline, warning
    last_sync TIMESTAMPTZ DEFAULT now(),
    specs TEXT,
    user_id UUID REFERENCES auth.users(id),
    is_host BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Policies: Authenticated users can manage their own devices
CREATE POLICY "Users can view their own devices" ON public.devices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices" ON public.devices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" ON public.devices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" ON public.devices
    FOR DELETE USING (auth.uid() = user_id);

-- 2. Apps Table
CREATE TABLE IF NOT EXISTS public.apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    domain TEXT,
    status TEXT DEFAULT 'available',
    version TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Software Packs Table
CREATE TABLE IF NOT EXISTS public.packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    app_ids UUID[] DEFAULT '{}',
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for packs
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own packs" ON public.packs
    FOR ALL USING (auth.uid() = user_id);

-- Enable RLS for apps
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view apps" ON public.apps
    FOR SELECT TO authenticated USING (true);

-- Insert Initial Mock Devices (Optional)
-- Note: Replace 'your-user-id' with an actual user id if you want them assigned immediately
-- INSERT INTO public.devices (id, name, type, os, status, specs, is_host) VALUES
-- ('DEV-001', 'Design-Lead-01', 'desktop', 'macOS Sonoma', 'online', 'M2 Max / 32GB RAM', false),
-- ('DEV-002', 'Dev-Station-Alpha', 'desktop', 'Windows 11 Pro', 'warning', 'i9-13900K / 64GB RAM', true);
