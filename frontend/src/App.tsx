import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { FoodScannerPage } from './pages/FoodScannerPage';
import { FreshnessCheckerPage } from './pages/FreshnessCheckerPage';
import { KitchenHygienePage } from './pages/KitchenHygienePage';
import { CookingAssistantPage } from './pages/CookingAssistantPage';
import { MealPlannerPage } from './pages/MealPlannerPage';
import { AssistantPage } from './pages/AssistantPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Guard (Redirects to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Authenticated Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food-scanner"
            element={
              <ProtectedRoute>
                <FoodScannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freshness"
            element={
              <ProtectedRoute>
                <FreshnessCheckerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hygiene"
            element={
              <ProtectedRoute>
                <KitchenHygienePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cooking"
            element={
              <ProtectedRoute>
                <CookingAssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meal-planner"
            element={
              <ProtectedRoute>
                <MealPlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
