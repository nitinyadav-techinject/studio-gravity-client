import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './store/AuthContext';
import { injectTheme } from './theme/theme';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import ProfilePage from './pages/ProfilePage';
import UsersListPage from './pages/UsersListPage';
import MergeAccountsPage from './pages/MergeAccountsPage';
import ZohoSyncPage from './pages/ZohoSyncPage';
import AccountsPage from './pages/AccountsPage';

import { useAuth } from './store/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const userRole = user?.role || 'customer';
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard/contacts" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize theme system
    injectTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Application Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <DashboardPage />
                </RoleProtectedRoute>
              } />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="accounts" element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AccountsPage />
                </RoleProtectedRoute>
              } />
              <Route path="users" element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <UsersListPage />
                </RoleProtectedRoute>
              } />
              <Route path="merge-accounts" element={
                <RoleProtectedRoute allowedRoles={[]}>
                  <MergeAccountsPage />
                </RoleProtectedRoute>
              } />
              <Route path="zoho-sync" element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <ZohoSyncPage />
                </RoleProtectedRoute>
              } />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
                    <p className="text-slate-400">Settings module is coming soon.</p>
                  </div>
                </div>
              } />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
