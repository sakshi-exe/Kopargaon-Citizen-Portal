import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';

import { supabase } from '../lib/supabase.js';

import { infrastructure as initialInfra } from '../data/infrastructure.js';
import { projects as initialProjects } from '../data/projects.js';
import { issues as initialIssues, generateIssueId } from '../data/issues.js';
import { landUseZones } from '../data/landuse.js';
import { wards } from '../data/wards.js';
import { transformations } from '../data/transformations.js';

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  // Role: 'citizen' | 'admin' | 'inspector'
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
      remarks:
        'Bituminous cracking and edge erosion identified. Emergency overlay recommended under Project PRJ-01.',
      evidencePhoto:
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      status: 'Verified',
    },
    {
      id: 'INSP-2026-0816-02',
      assetId: 'DRAIN-KPG-0138',
      date: '2026-08-16',
      inspectorName: 'Shri V. R. Deshmukh',
      role: 'Chief Sanitation Officer',
      condition: 9,
      conditionLabel: 'Excellent',
      remarks:
        'Post-monsoon hydraulic discharge test successful. Twin-cell RCC box channel running at full efficiency.',
      evidencePhoto:
        'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
      status: 'Certified',
    },
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
};

// ── Convert Supabase issue → App issue ────────────────────────────────────────

function mapSupabaseIssue(row) {
  return {
    id: row.id,

    title: row.title,

    description: row.description,

    category: row.category,

    priority: row.priority || 'medium',

    // Convert database status into the status names
    // already used by the existing UI.
    status:
      row.status === 'pending'
        ? 'Reported'
        : row.status === 'under_review'
        ? 'Under Review'
        : row.status === 'assigned'
        ? 'Assigned'
        : row.status === 'in_progress'
        ? 'In Progress'
        : row.status === 'resolved'
        ? 'Resolved'
        : row.status === 'verified'
        ? 'Verified'
        : row.status === 'closed'
        ? 'Closed'
        : row.status || 'Reported',

    wardId: row.location,

    citizenName: row.citizen_name,

    isAnonymous: row.citizen_name === 'Anonymous',

    lat: row.latitude ?? 0,

    lng: row.longitude ?? 0,

    submittedDate: row.created_at
      ? row.created_at.split('T')[0]
      : new Date().toISOString().split('T')[0],

    updatedDate: row.created_at
      ? row.created_at.split('T')[0]
      : new Date().toISOString().split('T')[0],

    linkedAssetId: row.linked_asset_id || null,

    photo: row.photo_url || null,
  };
}

// ── Convert UI status → Supabase status ───────────────────────────────────────

function mapStatusToDatabase(status) {
  const statusMap = {
    Reported: 'pending',
    'Under Review': 'under_review',
    Assigned: 'assigned',
    'In Progress': 'in_progress',
    Resolved: 'resolved',
    Verified: 'verified',
    Closed: 'closed',
  };

  return statusMap[status] || status;
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function appReducer(state, action) {
  switch (action.type) {
    // Role switching
    case 'SET_ROLE':
      return {
        ...state,
        role: action.payload,
      };

    // Dark mode
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };

    // Asset Detail Modal
    case 'OPEN_ASSET_MODAL':
      return {
        ...state,
        selectedAsset: action.payload,
      };

    case 'CLOSE_ASSET_MODAL':
      return {
        ...state,
        selectedAsset: null,
      };

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
      return {
        ...state,
        mapLayers: action.payload,
      };

    // Ward selection
    case 'SELECT_WARD':
      return {
        ...state,
        selectedWard: action.payload,
      };

    // ── Load issues from Supabase ─────────────────────────────────────────────

    case 'SET_ISSUES':
      return {
        ...state,
        issues: action.payload,
      };

    // ── Citizen: submit a new issue ───────────────────────────────────────────

    case 'SUBMIT_ISSUE': {
      const newIssue = {
        ...action.payload,
        id: action.payload.id || generateIssueId(),
        status: 'Reported',
        submittedDate:
          action.payload.submittedDate ||
          new Date().toISOString().split('T')[0],
        updatedDate:
          action.payload.updatedDate ||
          new Date().toISOString().split('T')[0],
      };

      return {
        ...state,

        issues: [newIssue, ...state.issues],

        myIssues: [newIssue, ...state.myIssues],
      };
    }

    // ── Admin: update issue status ───────────────────────────────────────────

    case 'UPDATE_ISSUE_STATUS': {
      const { issueId, newStatus } = action.payload;

      const updatedDate = new Date()
        .toISOString()
        .split('T')[0];

      return {
        ...state,

        issues: state.issues.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                status: newStatus,
                updatedDate,
              }
            : issue
        ),

        myIssues: state.myIssues.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                status: newStatus,
                updatedDate,
              }
            : issue
        ),
      };
    }

    // ── Admin: update project ─────────────────────────────────────────────────

    case 'UPDATE_PROJECT': {
      const { projectId, updates } = action.payload;

      return {
        ...state,

        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                ...updates,
              }
            : project
        ),
      };
    }

    // ── Admin: update infrastructure ─────────────────────────────────────────

    case 'UPDATE_INFRASTRUCTURE': {
      const { infraId, updates } = action.payload;

      return {
        ...state,

        infrastructure: state.infrastructure.map((item) =>
          item.id === infraId
            ? {
                ...item,
                ...updates,
              }
            : item
        ),
      };
    }

    // ── Field Worker: Submit Field Inspection ────────────────────────────────

    case 'SUBMIT_INSPECTION': {
      const inspection = {
        ...action.payload,

        id: `INSP-${Date.now().toString().slice(-6)}`,

        date: new Date().toISOString().split('T')[0],

        status: 'Verified',
      };

      const updatedInfra = state.infrastructure.map((item) => {
        if (item.id === action.payload.assetId) {
          const conditionScore =
            action.payload.conditionScore ||
            (action.payload.condition === 'Good'
              ? 8
              : action.payload.condition === 'Moderate'
              ? 6
              : action.payload.condition === 'Poor'
              ? 3
              : 2);

          const newMaintenance =
            conditionScore >= 7
              ? 'Up-to-date'
              : conditionScore >= 5
              ? 'Due'
              : 'Overdue';

          const newHistory = [
            {
              date: inspection.date,
              action: `Field inspection by ${
                action.payload.inspectorName || 'Inspection Team'
              }: ${
                action.payload.remarks || 'Condition logged'
              }`,
            },

            ...(item.maintenanceHistory || []),
          ];

          return {
            ...item,

            condition: conditionScore,

            lastInspection: inspection.date,

            maintenanceStatus: newMaintenance,

            maintenanceHistory: newHistory,

            verifiedBy:
              action.payload.inspectorName || item.verifiedBy,
          };
        }

        return item;
      });

      return {
        ...state,

        inspections: [
          inspection,
          ...state.inspections,
        ],

        infrastructure: updatedInfra,
      };
    }

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(
    appReducer,
    initialState
  );

  // ── Load real citizen issues from Supabase ─────────────────────────────────

  const loadIssues = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        console.error(
          'Failed to load issues from Supabase:',
          error
        );
        return;
      }

      const mappedIssues = (data || []).map(
        mapSupabaseIssue
      );

      dispatch({
        type: 'SET_ISSUES',
        payload: mappedIssues,
      });

      console.log(
        'Issues loaded from Supabase:',
        mappedIssues
      );
    } catch (error) {
      console.error(
        'Unexpected error loading issues:',
        error
      );
    }
  }, []);

  // Load issues when application starts
  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  // ── Sync dark mode ─────────────────────────────────────────────────────────

  useEffect(() => {
    const html = document.documentElement;

    if (state.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [state.darkMode]);

  // ── Supabase-aware dispatch ────────────────────────────────────────────────

  const appDispatch = useCallback(
    async (action) => {
      // Admin status update
      if (action.type === 'UPDATE_ISSUE_STATUS') {
        const { issueId, newStatus } = action.payload;

        try {
          const databaseStatus =
            mapStatusToDatabase(newStatus);

          const { error } = await supabase
            .from('issues')
            .update({
              status: databaseStatus,
            })
            .eq('id', issueId);

          if (error) {
            console.error(
              'Failed to update issue status in Supabase:',
              error
            );

            alert(
              `Failed to update issue: ${error.message}`
            );

            return;
          }

          console.log(
            'Issue status updated in Supabase:',
            issueId,
            databaseStatus
          );

          // Only update UI after Supabase succeeds
          dispatch(action);

          return;
        } catch (error) {
          console.error(
            'Unexpected status update error:',
            error
          );

          alert(
            'Something went wrong while updating the issue.'
          );

          return;
        }
      }

      // Normal local actions
      dispatch(action);
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch: appDispatch,
        reloadIssues: loadIssues,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error(
      'useApp must be used within AppProvider'
    );
  }

  return ctx;
}

// ── Derived selectors ─────────────────────────────────────────────────────────

export function useAnalytics() {
  const { state } = useApp();

  const {
    infrastructure,
    projects,
    issues,
    wards,
  } = state;

  // Infrastructure stats
  const infraByType = {};
  const infraByWard = {};

  infrastructure.forEach((item) => {
    infraByType[item.type] =
      (infraByType[item.type] || 0) + 1;

    infraByWard[item.wardId] =
      (infraByWard[item.wardId] || 0) + 1;
  });

  const conditionDist = {
    'Excellent (8-10)': 0,
    'Good (6-7)': 0,
    'Fair (5)': 0,
    'Poor (3-4)': 0,
    'Critical (1-2)': 0,
  };

  infrastructure.forEach((item) => {
    if (item.condition >= 8) {
      conditionDist['Excellent (8-10)']++;
    } else if (item.condition >= 6) {
      conditionDist['Good (6-7)']++;
    } else if (item.condition === 5) {
      conditionDist['Fair (5)']++;
    } else if (item.condition >= 3) {
      conditionDist['Poor (3-4)']++;
    } else {
      conditionDist['Critical (1-2)']++;
    }
  });

  // Project stats
  const projectsByStatus = {};
  const projectsByCategory = {};

  let totalBudget = 0;
  let totalSpent = 0;

  projects.forEach((project) => {
    projectsByStatus[project.status] =
      (projectsByStatus[project.status] || 0) + 1;

    projectsByCategory[project.category] =
      (projectsByCategory[project.category] || 0) + 1;

    totalBudget += project.budget;
    totalSpent += project.spent;
  });

  // Issue stats
  const issuesByCategory = {};
  const issuesByStatus = {};
  const issuesByWard = {};

  issues.forEach((issue) => {
    issuesByCategory[issue.category] =
      (issuesByCategory[issue.category] || 0) + 1;

    issuesByStatus[issue.status] =
      (issuesByStatus[issue.status] || 0) + 1;

    issuesByWard[issue.wardId] =
      (issuesByWard[issue.wardId] || 0) + 1;
  });

  const resolvedCount =
    (issuesByStatus['Resolved'] || 0) +
    (issuesByStatus['Verified'] || 0) +
    (issuesByStatus['Closed'] || 0);

  const unresolvedCount =
    issues.length - resolvedCount;

  return {
    infrastructure: {
      total: infrastructure.length,

      byType: infraByType,

      byWard: infraByWard,

      conditionDist,

      criticalCount:
        infrastructure.filter(
          (item) => item.condition <= 4
        ).length,

      avgCondition:
        infrastructure.length > 0
          ? (
              infrastructure.reduce(
                (sum, item) =>
                  sum + item.condition,
                0
              ) / infrastructure.length
            ).toFixed(1)
          : '0.0',
    },

    projects: {
      total: projects.length,

      byStatus: projectsByStatus,

      byCategory: projectsByCategory,

      totalBudget,

      totalSpent,

      activeCount:
        (projectsByStatus['In Progress'] || 0) +
        (projectsByStatus['Approved'] || 0),

      completedCount:
        projectsByStatus['Completed'] || 0,

      delayedCount:
        projectsByStatus['Delayed'] || 0,
    },

    issues: {
      total: issues.length,

      byCategory: issuesByCategory,

      byStatus: issuesByStatus,

      byWard: issuesByWard,

      resolvedCount,

      unresolvedCount,

      resolutionRate:
        issues.length > 0
          ? Math.round(
              (resolvedCount / issues.length) * 100
            )
          : 0,
    },

    wards: wards.map((ward) => ({
      ...ward,

      infraCount:
        infraByWard[ward.id] || 0,

      issueCount:
        issuesByWard[ward.id] || 0,

      projectCount:
        projects.filter(
          (project) =>
            project.wardId === ward.id
        ).length,
    })),
  };
}