import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { infrastructure as initialInfra } from '../data/infrastructure.js';
import { projects as initialProjects } from '../data/projects.js';
import { issues as initialIssues, generateIssueId } from '../data/issues.js';
import { landUseZones } from '../data/landuse.js';
import { wards } from '../data/wards.js';
import { transformations } from '../data/transformations.js';

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  // Role: 'citizen' | 'admin' | 'inspector'
  // In production, derived from JWT authentication
  role: 'citizen',

  // Dark mode
  darkMode: true,

  // Core data
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

  // Citizen: my submitted issues (session-level)
  myIssues: [],
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    // Role switching (demo only)
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    // Asset Detail Modal
    case 'OPEN_ASSET_MODAL':
      return { ...state, selectedAsset: action.payload };

    case 'CLOSE_ASSET_MODAL':
      return { ...state, selectedAsset: null };

    // Map layer toggles
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

    // Ward selection
    case 'SELECT_WARD':
      return { ...state, selectedWard: action.payload };

    // Citizen: submit a new issue
    case 'SUBMIT_ISSUE': {
      const newIssue = {
        ...action.payload,
        id: generateIssueId(),
        status: 'Reported',
        submittedDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
      };
      return {
        ...state,
        issues: [newIssue, ...state.issues],
        myIssues: [newIssue, ...state.myIssues],
      };
    }

    // Admin: update issue status
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

    // Admin: update project progress/status
    case 'UPDATE_PROJECT': {
      const { projectId, updates } = action.payload;
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId ? { ...p, ...updates } : p
        ),
      };
    }

    // Admin: update infrastructure item
    case 'UPDATE_INFRASTRUCTURE': {
      const { infraId, updates } = action.payload;
      return {
        ...state,
        infrastructure: state.infrastructure.map(i =>
          i.id === infraId ? { ...i, ...updates } : i
        ),
      };
    }

    // Field Worker: Submit Field Inspection
    case 'SUBMIT_INSPECTION': {
      const inspection = {
        ...action.payload,
        id: `INSP-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Verified'
      };

      // Update the infrastructure item condition & lastInspection
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

  // Sync dark mode class on html element
  useEffect(() => {
    const html = document.documentElement;
    if (state.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
      avgCondition: (infrastructure.reduce((s, i) => s + i.condition, 0) / infrastructure.length).toFixed(1),
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
      resolutionRate: Math.round((resolvedCount / issues.length) * 100),
    },
    wards: wards.map(w => ({
      ...w,
      infraCount: infraByWard[w.id] || 0,
      issueCount: issuesByWard[w.id] || 0,
      projectCount: projects.filter(p => p.wardId === w.id).length,
    }))
  };
}
