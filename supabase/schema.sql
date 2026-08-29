-- ==============================================================================
-- KOPARGAON CITIZEN PORTAL (CIVICFIX) — SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Project: kopargaon-citizen-portal
-- Location: Kopargaon, Maharashtra, India
-- Designed for: PostgreSQL with Supabase Auth, Row Level Security, and Storage
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABLE: profiles
-- ==============================================================================
-- Stores user identity and role (citizen, admin, inspector) linked to Supabase Auth.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('citizen', 'admin', 'inspector')) DEFAULT 'citizen',
    avatar_url TEXT,
    ward_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Helper function to check user role safely without recursive RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'inspector')
    );
$$;

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 2. TABLE: reports
-- ==============================================================================
-- Citizen civic issues and complaint tickets across Kopargaon municipal wards.
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY, -- e.g. CF-KPG-1028
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Road', 'Pothole', 'Street Light', 'Water', 'Drainage', 'Garbage', 'Traffic', 'Park', 'Other'
    )),
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    status TEXT NOT NULL CHECK (status IN (
        'Pending', 'In Progress', 'Resolved', 'Rejected'
    )) DEFAULT 'Pending',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    ward_id TEXT NOT NULL DEFAULT 'W1',
    citizen_name TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_department TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_ward_id ON public.reports(ward_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- ==============================================================================
-- 3. TABLE: report_evidence
-- ==============================================================================
-- Photographic and video evidence attached to citizen complaints.
CREATE TABLE IF NOT EXISTS public.report_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id TEXT NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document')) DEFAULT 'image',
    caption TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_evidence_report_id ON public.report_evidence(report_id);

-- ==============================================================================
-- 4. TABLE: infrastructure
-- ==============================================================================
-- Catalog of civic infrastructure assets in Kopargaon with QR tag references.
CREATE TABLE IF NOT EXISTS public.infrastructure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id TEXT UNIQUE NOT NULL, -- e.g. ROAD-KPG-1028, LIGHT-KPG-0451
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Road', 'Street Light', 'Water', 'Drainage', 'Bridge', 'Park', 'Public Building', 'Waste Management'
    )),
    ward TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('Good', 'Moderate', 'Poor', 'Critical')) DEFAULT 'Good',
    condition_score NUMERIC(3, 1) DEFAULT 8.0,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    qr_code TEXT UNIQUE,
    installation_date DATE,
    last_inspection DATE,
    maintenance_status TEXT NOT NULL CHECK (maintenance_status IN ('Up-to-date', 'Due', 'Overdue')) DEFAULT 'Up-to-date',
    contractor TEXT,
    budget NUMERIC(12, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_infrastructure_asset_id ON public.infrastructure(asset_id);
CREATE INDEX IF NOT EXISTS idx_infrastructure_category ON public.infrastructure(category);
CREATE INDEX IF NOT EXISTS idx_infrastructure_ward ON public.infrastructure(ward);

-- ==============================================================================
-- 5. TABLE: projects
-- ==============================================================================
-- Municipal development projects and DPR budgets across Kopargaon.
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT UNIQUE NOT NULL, -- e.g. PROJECT-KPG-2026-01
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    ward TEXT NOT NULL,
    budget NUMERIC(14, 2) NOT NULL DEFAULT 0,
    spent NUMERIC(14, 2) NOT NULL DEFAULT 0,
    contractor TEXT,
    department TEXT DEFAULT 'Town Planning & Municipal Works',
    start_date DATE NOT NULL,
    expected_completion DATE NOT NULL,
    actual_completion DATE,
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN (
        'Planned', 'Approved', 'In Progress', 'Delayed', 'Completed'
    )) DEFAULT 'In Progress',
    qr_asset_ref TEXT REFERENCES public.infrastructure(asset_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_projects_project_id ON public.projects(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_ward ON public.projects(ward);

-- ==============================================================================
-- 6. TABLE: notifications
-- ==============================================================================
-- Real-time updates dispatched to citizens regarding report statuses.
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('status_update', 'inspection', 'announcement', 'assignment')) DEFAULT 'status_update',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infrastructure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone can view their own profile; admins can view all profiles.
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- REPORTS POLICIES
-- ------------------------------------------------------------------------------
-- Citizens see own reports. Public/anonymous visitors can see non-private report summaries.
-- Admins and inspectors see all reports.
CREATE POLICY "Citizens can view their own reports or public summaries"
    ON public.reports FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_admin()
        OR user_id IS NULL -- Guest/public submissions
    );

-- Citizens can insert their own reports (or anonymous guests)
CREATE POLICY "Anyone can create a report"
    ON public.reports FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        OR user_id IS NULL
    );

-- Citizens can update only their pending reports; Admins can update any report status
CREATE POLICY "Citizens can update own pending reports or Admins can update all"
    ON public.reports FOR UPDATE
    USING (
        (auth.uid() = user_id AND status = 'Pending') 
        OR public.is_admin()
    )
    WITH CHECK (
        (auth.uid() = user_id AND status = 'Pending') 
        OR public.is_admin()
    );

-- ------------------------------------------------------------------------------
-- REPORT EVIDENCE POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users view evidence for accessible reports"
    ON public.report_evidence FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_admin()
        OR user_id IS NULL
    );

CREATE POLICY "Users can upload evidence for their reports"
    ON public.report_evidence FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        OR user_id IS NULL
    );

-- ------------------------------------------------------------------------------
-- INFRASTRUCTURE & PROJECTS (PUBLIC READ, ADMIN WRITE)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public read infrastructure"
    ON public.infrastructure FOR SELECT
    USING (true);

CREATE POLICY "Admin write infrastructure"
    ON public.infrastructure FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Public read projects"
    ON public.projects FOR SELECT
    USING (true);

CREATE POLICY "Admin write projects"
    ON public.projects FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 8. STORAGE BUCKET: report-evidence
-- ==============================================================================
-- To be executed in Supabase SQL editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-evidence', 'report-evidence', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access for report evidence"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'report-evidence');

CREATE POLICY "Authenticated & Guest Uploads to report evidence"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'report-evidence');
