// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';
import UserLayout from './components/common/UserLayout';
import AdminLayout from './components/common/AdminLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import StockExplorer from './pages/StockExplorer';
import StockDetail from './pages/StockDetail';
import Trading from './pages/Trading';
import Learning from './pages/Learning';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  const currentRole = user.is_admin ? 'admin' : 'user';
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) return <Loader />;

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <UserLayout>
              <Home />
            </UserLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* User portal */}
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <UserLayout>
                <Dashboard />
              </UserLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/stocks"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <UserLayout>
                <StockExplorer />
              </UserLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/stocks/:symbol"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <UserLayout>
                <StockDetail />
              </UserLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/trading"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <UserLayout>
                <Trading />
              </UserLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/learning"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <UserLayout>
                <Learning />
              </UserLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleProtectedRoute allowedRoles={['user']}>
              <UserLayout>
                <Profile />
              </UserLayout>
            </RoleProtectedRoute>
          }
        />

        {/* Admin portal */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard section="overview" />
              </AdminLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard section="users" />
              </AdminLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/models"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard section="models" />
              </AdminLayout>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard section="reports" />
              </AdminLayout>
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
