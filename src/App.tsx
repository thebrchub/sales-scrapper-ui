import { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { getToken, clearToken } from "./api/client";
import { AuthContext } from "./hooks/useAuth";
import { getUserRole } from "./hooks/useRole";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AboutPage from "./pages/AboutPage";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage";
import CRMLeadsPage from "./pages/CRMLeadsPage";
import CRMHistoryPage from "./pages/CRMHistoryPage";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import AdminManagementPage from "./pages/AdminManagementPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}

function RoleDashboard() {
  const role = getUserRole();
  if (role === "employee") return <EmployeeDashboardPage />;
  return <DashboardPage />;
}

export default function App() {
  const [, setTick] = useState(0);

  const logout = useCallback(() => {
    clearToken();
    setTick((t) => t + 1);
  }, []);

  const isAuthenticated = !!getToken();

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleDashboard />} />
            {/* Admin/Super Admin routes */}
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="employees" element={<EmployeeManagementPage />} />
            <Route path="admins" element={<AdminManagementPage />} />
            {/* Employee CRM routes */}
            <Route path="crm/leads" element={<CRMLeadsPage />} />
            <Route path="crm/history" element={<CRMHistoryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AuthContext.Provider>
  );
}
