import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ChangePassword from './pages/auth/ChangePassword';

function DashboardRedirect() {
  const savedUser = localStorage.getItem(
    'storerate_user',
  );

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('storerate_user');
    localStorage.removeItem('storerate_token');

    return <Navigate to="/login" replace />;
  }

  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'STORE_OWNER') {
    return <Navigate to="/owner" replace />;
  }

  if (user.role === 'USER') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route
          path="/"
          element={<DashboardRedirect />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['USER']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* STORE OWNER */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute roles={['STORE_OWNER']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* CHANGE PASSWORD */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute
              roles={[
                'USER',
                'STORE_OWNER',
                'ADMIN',
              ]}
            >
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN */}
        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}