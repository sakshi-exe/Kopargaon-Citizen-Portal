import { createClient } from '@supabase/supabase-js';

// Read from Vite environment variables
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid credentials exist
export const isSupabaseConfigured = Boolean(
  rawSupabaseUrl &&
  rawSupabaseKey &&
  rawSupabaseUrl !== 'https://your-project.supabase.co' &&
  rawSupabaseUrl !== 'https://klscvpaukgnwuoknzfyy.supabase.co/unconfigured'
);

if (!isSupabaseConfigured) {
  console.warn(
    '[CivicFix / Kopargaon Fix Warning] Supabase environment variables are missing or unconfigured.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env.local file.\n' +
    'The application will operate in demo fallback mode with local mock data.'
  );
}

// Ensure createClient never crashes with "supabaseUrl is required"
const fallbackUrl = 'https://klscvpaukgnwuoknzfyy.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder-dev-key';

const activeUrl = rawSupabaseUrl || fallbackUrl;
const activeKey = rawSupabaseKey || fallbackKey;

export const supabase = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ==============================================================================
// AUTHENTICATION HELPERS
// ==============================================================================

export async function signUpUser({ email, password, fullName, role = 'citizen', phone = '', wardId = 'W1' }) {
  if (!isSupabaseConfigured) {
    return {
      data: {
        user: { id: `mock-${Date.now()}`, email },
        session: null,
      },
      error: null,
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone,
          ward_id: wardId,
        },
      },
    });

    if (error) throw error;

    // Create profile entry
    if (data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        phone,
        role,
        ward_id: wardId,
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Supabase signUp error:', error);
    return { data: null, error };
  }
}

export async function loginUser({ email, password }) {
  if (!isSupabaseConfigured) {
    return {
      data: {
        user: { id: 'mock-user-1', email, user_metadata: { role: 'citizen', full_name: 'Demo Citizen' } },
        session: { access_token: 'mock-token' },
      },
      error: null,
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Supabase login error:', error);
    return { data: null, error };
  }
}

export async function logoutUser() {
  if (!isSupabaseConfigured) return { error: null };
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Supabase logout error:', error);
    return { error };
  }
}

export async function getCurrentProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  } catch (err) {
    console.error('Fetch profile error:', err);
    return null;
  }
}

// ==============================================================================
// STORAGE HELPERS: report-evidence
// ==============================================================================

export async function uploadReportEvidence(file, reportId) {
  if (!isSupabaseConfigured || !file) {
    // If not configured or mock, return local object url or data url
    return {
      url: typeof file === 'string' ? file : URL.createObjectURL(file),
      path: 'local-file',
      type: file?.type?.startsWith('video') ? 'video' : 'image',
    };
  }

  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const fileName = `${reportId || 'rep'}-${Date.now()}.${fileExt}`;
    const filePath = `evidence/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('report-evidence')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Storage upload warning, fallback to local URL:', uploadError.message);
      return {
        url: URL.createObjectURL(file),
        path: filePath,
        type: file?.type?.startsWith('video') ? 'video' : 'image',
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from('report-evidence')
      .getPublicUrl(filePath);

    return {
      url: publicUrlData?.publicUrl || URL.createObjectURL(file),
      path: filePath,
      type: file?.type?.startsWith('video') ? 'video' : 'image',
    };
  } catch (err) {
    console.error('Upload evidence exception:', err);
    return {
      url: typeof file === 'string' ? file : URL.createObjectURL(file),
      path: 'fallback-file',
      type: 'image',
    };
  }
}

// ==============================================================================
// REPORTS / ISSUES HELPERS
// ==============================================================================

export async function createReportInSupabase(reportData, file = null) {
  const reportId = reportData.id || `CF-KPG-${Math.floor(1000 + Math.random() * 9000)}`;

  let evidence = null;
  if (file) {
    evidence = await uploadReportEvidence(file, reportId);
  }

  if (!isSupabaseConfigured) {
    return {
      success: true,
      data: {
        ...reportData,
        id: reportId,
        status: 'Pending',
        photoUrl: evidence?.url || reportData.photoUrl || null,
        created_at: new Date().toISOString(),
      },
      isMock: true,
    };
  }

  try {
    // 1. Insert into reports table
    const { data: reportResult, error: reportError } = await supabase
      .from('reports')
      .insert([
        {
          id: reportId,
          user_id: reportData.userId || null,
          title: `${reportData.category} issue near ${reportData.wardId || 'Kopargaon'}`,
          description: reportData.description,
          category: reportData.category || 'Other',
          priority: reportData.priority || 'Medium',
          status: 'Pending',
          latitude: reportData.lat || 19.8917,
          longitude: reportData.lng || 74.4789,
          ward_id: reportData.wardId || 'W1',
          citizen_name: reportData.isAnonymous ? 'Anonymous' : (reportData.citizenName || 'Citizen'),
          is_anonymous: Boolean(reportData.isAnonymous),
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (reportError) throw reportError;

    // 2. Insert evidence record if photo/video uploaded
    if (evidence && evidence.url) {
      await supabase.from('report_evidence').insert([
        {
          report_id: reportId,
          user_id: reportData.userId || null,
          file_path: evidence.url,
          file_type: evidence.type || 'image',
          caption: reportData.description?.slice(0, 100) || 'Citizen evidence',
        },
      ]);
    }

    return { success: true, data: reportResult, evidenceUrl: evidence?.url };
  } catch (error) {
    console.error('Supabase createReport error:', error);
    // Return gracefully so UI can still update local state
    return { success: false, error, fallbackId: reportId };
  }
}

export async function fetchLiveReports() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        report_evidence ( file_path, file_type )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Fetch live reports fallback to mock:', err.message);
    return [];
  }
}

export async function fetchMyReportsFromSupabase(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        report_evidence ( file_path, file_type )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Fetch my reports fallback:', err.message);
    return [];
  }
}

export async function updateReportStatusInSupabase(reportId, newStatus, resolutionNotes = '') {
  if (!isSupabaseConfigured) return { success: true, isMock: true };
  try {
    const updates = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (newStatus === 'Resolved') {
      updates.resolved_at = new Date().toISOString();
      updates.resolution_notes = resolutionNotes || 'Resolved and verified by municipal authority.';
    }

    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', reportId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update report status error:', error);
    return { success: false, error };
  }
}

// ==============================================================================
// INFRASTRUCTURE & PROJECTS HELPERS
// ==============================================================================

export async function fetchLiveInfrastructure() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('infrastructure')
      .select('*')
      .order('asset_id', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Fetch live infrastructure fallback:', err.message);
    return [];
  }
}

export async function fetchLiveProjects() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Fetch live projects fallback:', err.message);
    return [];
  }
}