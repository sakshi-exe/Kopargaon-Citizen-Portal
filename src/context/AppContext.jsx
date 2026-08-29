import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { infrastructure as initialInfra } from '../data/infrastructure.js';
import { projects as initialProjects } from '../data/projects.js';
import { issues as initialIssues, generateIssueId } from '../data/issues.js';
import { landUseZones } from '../data/landuse.js';
import { wards } from '../data/wards.js';
import { transformations } from '../data/transformations.js';
import {
  supabase,
  isSupabaseConfigured,
  signUpUser,
  loginUser,
  logoutUser,
  getCurrentProfile,
  createReportInSupabase,
  fetchLiveReports,
  fetchMyReportsFromSupabase,
  updateReportStatusInSupabase,
  fetchLiveInfrastructure,
  fetchLiveProjects
} from '../lib/supabase.js';

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  // Role: 'citizen' | 'admin' | 'inspector'
  role: 'citizen',

  // Dark mode
  darkMode: true,

  // Core data (with fallback to seed data)
  infrastructure: initialInfra,
  projects: initialProjects,
  issues: initialIssues,
  landUseZones,
  wards,
  transformations,

  // Global Asset Detail Modal
  selectedAsset: null,

  // Inspection logs
  inspections: [
    {
      id: 'INSP-2026-0818-01',
      assetId: 'ROAD-KPG-1028',
      date: '2026-08-18',
      inspectorName: 'Er. Sandeep Patil',
      role: 'Executive Municipal Engineer',
      condition: 4,
      conditionLabel: 'Poor',
      remarks: 'Bituminous cracking and edge erosion identified. Emergency overlay recommended under Project PRJ-01.',
      evidencePhoto: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      status: 'Verified'
    },
    {
      id: 'INSP-2026-0816-02',
      assetId: 'DRAIN-KPG-0138',
      date: '2026-08-16',
      inspectorName: 'Shri V. R. Deshmukh',
      role: 'Chief Sanitation Officer',
      condition: 9,
      conditionLabel: 'Excellent',
      remarks: 'Post-monsoon hydraulic discharge test successful. Twin-cell RCC box channel running at full efficiency.',
      evidencePhoto: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
      status: 'Certified'
    }
  ],

  // UI state
  selectedWard: null,
  mapLayers: {
    roads: true,
    water: true,
    drainage: true,
    streetLights: true,
    publicBuildings: true,
    parks: true,
    projects: true,
    issues: true,
    landuse: false,
  },

  // Citizen: my submitted issues
  myIssues: [],

  // Live Supabase status indicator
  isSupabaseLive: false,
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    case 'OPEN_ASSET_MODAL':
      return { ...state, selectedAsset: action.payload };

    case 'CLOSE_ASSET_MODAL':
      return { ...state, selectedAsset: null };

    case 'TOGGLE_LAYER':
      return {
        ...state,
        mapLayers: {
          ...state.mapLayers,
          [action.payload]: !state.mapLayers[action.payload],
        },
      };

    case 'SET_ALL_LAYERS':
      return { ...state, mapLayers: action.payload };

    case 'SELECT_WARD':
      return { ...state, selectedWard: action.payload };

    case 'SET_LIVE_DATA': {
      const { liveIssues, liveInfrastructure, liveProjects } = action.payload;
      return {
        ...state,
        issues: liveIssues && liveIssues.length > 0 ? liveIssues : state.issues,
        infrastructure: liveInfrastructure && liveInfrastructure.length > 0 ? liveInfrastructure : state.infrastructure,
        projects: liveProjects && liveProjects.length > 0 ? liveProjects : state.projects,
        isSupabaseLive: true,
      };
    }

    case 'SET_MY_ISSUES':
      return { ...state, myIssues: action.payload };

    case 'SUBMIT_ISSUE': {
      const newIssue = {
        ...action.payload,
        id: action.payload.id || generateIssueId(),
        status: action.payload.status || 'Pending',
        submittedDate: action.payload.submittedDate || new Date().toISOString().split('T')[0],
        updatedDate: action.payload.updatedDate || new Date().toISOString().split('T')[0],
      };
      return {
        ...state,
        issues: [newIssue, ...state.issues.filter(i => i.id !== newIssue.id)],
        myIssues: [newIssue, ...state.myIssues.filter(i => i.id !== newIssue.id)],
      };
    }

    case 'UPDATE_ISSUE_STATUS': {
      const { issueId, newStatus } = action.payload;
      return {
        ...state,
        issues: state.issues.map(i =>
          i.id === issueId
            ? { ...i, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
            : i
        ),
        myIssues: state.myIssues.map(i =>
          i.id === issueId
            ? { ...i, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
            : i
        ),
      };
    }

    case 'UPDATE_PROJECT': {
      const { projectId, updates } = action.payload;
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId ? { ...p, ...updates } : p
        ),
      };
    }

    case 'UPDATE_INFRASTRUCTURE': {
      const { infraId, updates } = action.payload;
      return {
        ...state,
        infrastructure: state.infrastructure.map(i =>
          i.id === infraId ? { ...i, ...updates } : i
        ),
      };
    }

    case 'SUBMIT_INSPECTION': {
      const inspection = {
        ...action.payload,
        id: `INSP-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Verified'
      };

      const updatedInfra = state.infrastructure.map(i => {
        if (i.id === action.payload.assetId) {
          const conditionScore = action.payload.conditionScore || (
            action.payload.condition === 'Good' ? 8 :
            action.payload.condition === 'Moderate' ? 6 :
            action.payload.condition === 'Poor' ? 3 : 2
          );
          const newMaintenance = conditionScore >= 7 ? 'Up-to-date' : conditionScore >= 5 ? 'Due' : 'Overdue';
          const newHistory = [
            { date: inspection.date, action: `Field inspection by ${action.payload.inspectorName || 'Inspection Team'}: ${action.payload.remarks || 'Condition logged'}` },
            ...(i.maintenanceHistory || [])
          ];

          return {
            ...i,
            condition: conditionScore,
            lastInspection: inspection.date,
            maintenanceStatus: newMaintenance,
            maintenanceHistory: newHistory,
            verifiedBy: action.payload.inspectorName || i.verifiedBy,
          };
        }
        return i;
      });

      return {
        ...state,
        inspections: [inspection, ...state.inspections],
        infrastructure: updatedInfra,
      };
    }

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Authentication State
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Dark mode class sync
  useEffect(() => {
    const html = document.documentElement;
    if (state.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Load active session and subscribe to Supabase Auth changes
  useEffect(() => {
    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          const userProfile = await getCurrentProfile(data.session.user.id);
          if (userProfile) {
            setProfile(userProfile);
            if (userProfile.role) {
              dispatch({ type: 'SET_ROLE', payload: userProfile.role });
            }
          }
        }
      } catch (err) {
        console.warn('Initial session check skipped:', err.message);
      } finally {
        setAuthLoading(false);
      }
    }

    initAuth();

    // Listen to auth events
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      if (newSession?.user) {
        const p = await getCurrentProfile(newSession.user.id);
        setProfile(p);
        if (p?.role) {
          dispatch({ type: 'SET_ROLE', payload: p.role });
        }
      } else {
        setProfile(null);
      }
      setAuthLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch initial live Supabase data (reports, infrastructure, projects)
  const refreshLiveData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [liveReports, liveInfra, liveProj] = await Promise.all([
        fetchLiveReports(),
        fetchLiveInfrastructure(),
        fetchLiveProjects(),
      ]);

      // Normalize reports if any exist in Supabase
      const formattedReports = liveReports.map(r => ({
        id: r.id,
        category: r.category,
        description: r.description,
        wardId: r.ward_id || 'W1',
        lat: r.latitude,
        lng: r.longitude,
        status: r.status === 'Pending' ? 'Reported' : r.status,
        submittedDate: r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        updatedDate: r.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        citizenName: r.citizen_name || 'Anonymous',
        isAnonymous: r.is_anonymous,
        photoUrl: r.report_evidence?.[0]?.file_path || null,
        userId: r.user_id,
      }));

      // Normalize infrastructure if available
      const formattedInfra = liveInfra.map(i => ({
        id: i.asset_id || i.id,
        name: i.name,
        type: i.category,
        wardId: i.ward,
        condition: Math.round(Number(i.condition_score) || (i.condition === 'Good' ? 8 : 5)),
        lat: i.latitude,
        lng: i.longitude,
        description: i.description,
        installDate: i.installation_date,
        lastInspection: i.last_inspection,
        maintenanceStatus: i.maintenance_status,
        contractor: i.contractor,
        budget: Number(i.budget) || 0,
      }));

      // Normalize projects if available
      const formattedProjects = liveProj.map(p => ({
        id: p.project_id || p.id,
        name: p.name,
        category: 'Urban Infrastructure',
        department: p.department || 'Municipal Works',
        wardId: p.ward,
        budget: Number(p.budget) || 0,
        spent: Number(p.spent) || 0,
        startDate: p.start_date,
        expectedEnd: p.expected_completion,
        status: p.status,
        progress: p.progress,
        contractor: p.contractor,
        description: p.description,
      }));

      dispatch({
        type: 'SET_LIVE_DATA',
        payload: {
          liveIssues: formattedReports,
          liveInfrastructure: formattedInfra,
          liveProjects: formattedProjects,
        }
      });
    } catch (err) {
      console.warn('Could not sync live Supabase data, using seed data:', err.message);
    }
  }, []);

  useEffect(() => {
    refreshLiveData();
  }, [refreshLiveData]);

  // Load user's live reports when user logs in
  useEffect(() => {
    async function loadUserReports() {
      if (user?.id && isSupabaseConfigured) {
        const userReports = await fetchMyReportsFromSupabase(user.id);
        if (userReports && userReports.length > 0) {
          const formatted = userReports.map(r => ({
            id: r.id,
            category: r.category,
            description: r.description,
            wardId: r.ward_id,
            lat: r.latitude,
            lng: r.longitude,
            status: r.status === 'Pending' ? 'Reported' : r.status,
            submittedDate: r.created_at?.split('T')[0],
            updatedDate: r.updated_at?.split('T')[0],
            citizenName: r.citizen_name,
            photoUrl: r.report_evidence?.[0]?.file_path,
          }));
          dispatch({ type: 'SET_MY_ISSUES', payload: formatted });
        }
      }
    }
    loadUserReports();
  }, [user]);

  // Auth functions exposed to consumers
  const login = async (email, password) => {
    setAuthError(null);
    const result = await loginUser({ email, password });
    if (result.error) {
      setAuthError(result.error.message);
    }
    return result;
  };

  const signup = async (email, password, fullName, role, phone, wardId) => {
    setAuthError(null);
    const result = await signUpUser({ email, password, fullName, role, phone, wardId });
    if (result.error) {
      setAuthError(result.error.message);
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setSession(null);
    setProfile(null);
    dispatch({ type: 'SET_ROLE', payload: 'citizen' });
  };

  // Connected helper to submit report
  const submitCitizenReport = async (reportData, file = null) => {
    const enrichedData = {
      ...reportData,
      userId: user?.id || null,
      citizenName: reportData.isAnonymous ? 'Anonymous' : (reportData.citizenName || profile?.full_name || 'Citizen'),
    };

    // 1. Update client-side state immediately
    dispatch({ type: 'SUBMIT_ISSUE', payload: enrichedData });

    // 2. Persist to Supabase
    const dbResult = await createReportInSupabase(enrichedData, file);
    return dbResult;
  };

  // Connected helper to update report status
  const updateReportStatus = async (reportId, newStatus, resolutionNotes = '') => {
    dispatch({ type: 'UPDATE_ISSUE_STATUS', payload: { issueId: reportId, newStatus } });
    await updateReportStatusInSupabase(reportId, newStatus, resolutionNotes);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        user,
        session,
        profile,
        authLoading,
        authError,
        setAuthError,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        submitCitizenReport,
        updateReportStatus,
        refreshLiveData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ── Derived selectors ─────────────────────────────────────────────────────────
export function useAnalytics() {
  const { state } = useApp();
  const { infrastructure, projects, issues, wards } = state;

  // Infrastructure stats
  const infraByType = {};
  const infraByWard = {};
  infrastructure.forEach(i => {
    infraByType[i.type] = (infraByType[i.type] || 0) + 1;
    infraByWard[i.wardId] = (infraByWard[i.wardId] || 0) + 1;
  });

  const conditionDist = { 'Excellent (8-10)': 0, 'Good (6-7)': 0, 'Fair (5)': 0, 'Poor (3-4)': 0, 'Critical (1-2)': 0 };
  infrastructure.forEach(i => {
    if (i.condition >= 8) conditionDist['Excellent (8-10)']++;
    else if (i.condition >= 6) conditionDist['Good (6-7)']++;
    else if (i.condition === 5) conditionDist['Fair (5)']++;
    else if (i.condition >= 3) conditionDist['Poor (3-4)']++;
    else conditionDist['Critical (1-2)']++;
  });

  // Project stats
  const projectsByStatus = {};
  const projectsByCategory = {};
  let totalBudget = 0, totalSpent = 0;
  projects.forEach(p => {
    projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
    projectsByCategory[p.category] = (projectsByCategory[p.category] || 0) + 1;
    totalBudget += p.budget;
    totalSpent += p.spent;
  });

  // Issue stats
  const issuesByCategory = {};
  const issuesByStatus = {};
  const issuesByWard = {};
  issues.forEach(i => {
    issuesByCategory[i.category] = (issuesByCategory[i.category] || 0) + 1;
    issuesByStatus[i.status] = (issuesByStatus[i.status] || 0) + 1;
    issuesByWard[i.wardId] = (issuesByWard[i.wardId] || 0) + 1;
  });
  const resolvedCount = (issuesByStatus['Resolved'] || 0) + (issuesByStatus['Verified'] || 0) + (issuesByStatus['Closed'] || 0);
  const unresolvedCount = issues.length - resolvedCount;

  return {
    infrastructure: {
      total: infrastructure.length,
      byType: infraByType,
      byWard: infraByWard,
      conditionDist,
      criticalCount: infrastructure.filter(i => i.condition <= 4).length,
      avgCondition: (infrastructure.reduce((s, i) => s + i.condition, 0) / (infrastructure.length || 1)).toFixed(1),
    },
    projects: {
      total: projects.length,
      byStatus: projectsByStatus,
      byCategory: projectsByCategory,
      totalBudget,
      totalSpent,
      activeCount: (projectsByStatus['In Progress'] || 0) + (projectsByStatus['Approved'] || 0),
      completedCount: projectsByStatus['Completed'] || 0,
      delayedCount: projectsByStatus['Delayed'] || 0,
    },
    issues: {
      total: issues.length,
      byCategory: issuesByCategory,
      byStatus: issuesByStatus,
      byWard: issuesByWard,
      resolvedCount,
      unresolvedCount,
      resolutionRate: issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 0,
    },
    wards: wards.map(w => ({
      ...w,
      infraCount: infraByWard[w.id] || 0,
      issueCount: issuesByWard[w.id] || 0,
      projectCount: projects.filter(p => p.wardId === w.id).length,
    }))
  };
}
