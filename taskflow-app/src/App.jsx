import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyTasksPage from './pages/MyTasksPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              token ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />

          <Route
            path="/register"
            element={
              token ? <Navigate to="/dashboard" replace /> : <RegisterPage />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <MyTasksPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Invalid URLs */}
          <Route
            path="*"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;