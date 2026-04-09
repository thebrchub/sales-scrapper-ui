import { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { getToken, clearToken } from "./api/client";
import { AuthContext } from "./hooks/useAuth";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";
import LeadsPage from "./pages/LeadsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DeadLetterPage from "./pages/DeadLetterPage";
import SettingsPage from "./pages/SettingsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
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
            <Route index element={<DashboardPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="dead-letter" element={<DeadLetterPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AuthContext.Provider>
  );
}
