import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ujian from './pages/Ujian';
import Tagihan from './pages/Tagihan';
import Logs from './pages/Logs';
import Statistik from './pages/Statistik';
import Profil from './pages/Profil';
import Layout from './components/Layout';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          } 
        />
        
        <Route path="/ujian" element={
          <ProtectedRoute>
            <PageTransition><Ujian /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/tagihan" element={
          <ProtectedRoute>
            <PageTransition><Tagihan /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/logs" element={
          <ProtectedRoute>
            <PageTransition><Logs /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/statistik" element={
          <ProtectedRoute>
            <PageTransition><Statistik /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute>
            <PageTransition><Profil /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
        <Toaster />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
