import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

// Separate wrapper to check auth for login page (redirect to home if already logged in)
const AuthRoute = () => {
  const { user } = useApp();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthRoute />} />
      
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* Full screen pages without bottom nav */}
      <Route path="/quiz" element={
        <ProtectedRoute>
           <div className="fixed inset-0 bg-white z-[60] overflow-y-auto max-w-md mx-auto">
              <Quiz />
           </div>
        </ProtectedRoute>
      } />

      {/* Admin Route - No Layout */}
      <Route path="/admin" element={
        // In a real app, add role-based protection here
        <div className="fixed inset-0 bg-slate-50 z-[100] overflow-y-auto">
            <AdminDashboard />
        </div>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;