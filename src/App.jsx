
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { supabase } from './lib/supabase.js';
import AssetDetailModal from './components/ui/AssetDetailModal.jsx';

// Auth
import Auth from './pages/Auth.jsx';

// Layouts
import CitizenLayout from './layouts/CitizenLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Citizen Pages
import CitizenHome from './pages/citizen/Home.jsx';
import CitizenCityMap from './pages/citizen/CityMap.jsx';
import ReportIssue from './pages/citizen/ReportIssue.jsx';
import MyReports from './pages/citizen/MyReports.jsx';
import CitizenProjects from './pages/citizen/Projects.jsx';
import CitizenTransparency from './pages/citizen/Transparency.jsx';
import QRScanner from './pages/citizen/QRScanner.jsx';
import CitizenTransformationsPage from './pages/citizen/TransformationsPage.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminGISMap from './pages/admin/GISMap.jsx';
import AdminInfrastructure from './pages/admin/Infrastructure.jsx';
import AdminLandUse from './pages/admin/LandUse.jsx';
import AdminProjects from './pages/admin/Projects.jsx';
import AdminCitizenIssues from './pages/admin/CitizenIssues.jsx';
import AdminAnalytics from './pages/admin/Analytics.jsx';
import AdminPlanningInsights from './pages/admin/PlanningInsights.jsx';
import WardAnalysis from './pages/admin/WardAnalysis.jsx';
import AdminTransparency from './pages/admin/Transparency.jsx';
import FieldInspection from './pages/admin/FieldInspection.jsx';

/* ─────────────────────────────────────────────────────────────
   Authentication Guard
───────────────────────────────────────────────────────────── */

function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } =
        await supabase.auth.getSession();

      if (mounted) {
        setSession(
          data?.session || null
        );

        setLoading(false);
      }
    };

    checkSession();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          if (mounted) {
            setSession(
              newSession || null
            );
          }
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07111f',
          color: '#94a3b8',
          fontSize: '16px',
        }}
      >
        Loading CivicFix...
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/auth"
        replace
      />
    );
  }

  return children;
}

/* ─────────────────────────────────────────────────────────────
   Role Router
───────────────────────────────────────────────────────────── */

function RoleRouter() {
  const { state } = useApp();

  return (
    <Navigate
      to={state.role === 'admin' ? '/admin' : '/citizen'}
      replace
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Application Routes
───────────────────────────────────────────────────────────── */

function AppRoutes() {
  return (
    <>
      <Routes>

        {/* Authentication */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Application */}
        <Route
          path="/*"
          element={
            <AuthGuard>
              <Routes>

                {/* Root redirect based on role */}
                <Route path="/" element={<RoleRouter />} />

                {/* Citizen routes */}
                <Route path="/citizen" element={<CitizenLayout />}>
                  <Route index element={<CitizenHome />} />
                  <Route path="map" element={<CitizenCityMap />} />
                  <Route path="scan-qr" element={<QRScanner />} />
                  <Route
                    path="transformations"
                    element={<CitizenTransformationsPage />}
                  />
                  <Route path="report" element={<ReportIssue />} />
                  <Route path="my-reports" element={<MyReports />} />
                  <Route path="projects" element={<CitizenProjects />} />
                  <Route
                    path="transparency"
                    element={<CitizenTransparency />}
                  />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="gis-map" element={<AdminGISMap />} />
                  <Route
                    path="field-inspection"
                    element={<FieldInspection />}
                  />
                  <Route
                    path="transformations"
                    element={<CitizenTransformationsPage />}
                  />
                  <Route
                    path="infrastructure"
                    element={<AdminInfrastructure />}
                  />
                  <Route path="landuse" element={<AdminLandUse />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="issues" element={<AdminCitizenIssues />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route
                    path="insights"
                    element={<AdminPlanningInsights />}
                  />
                  <Route path="ward-analysis" element={<WardAnalysis />} />
                  <Route
                    path="transparency"
                    element={<AdminTransparency />}
                  />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </AuthGuard>
          }
        />

      </Routes>

      {/* Global Asset QR & Transparency Profile Modal */}
      <AssetDetailModal />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   App
───────────────────────────────────────────────────────────── */

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
