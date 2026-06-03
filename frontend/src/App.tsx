import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
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

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/ujian" element={
            <ProtectedRoute>
              <Ujian />
            </ProtectedRoute>
          } />
          <Route path="/tagihan" element={
            <ProtectedRoute>
              <Tagihan />
            </ProtectedRoute>
          } />
          <Route path="/logs" element={
            <ProtectedRoute>
              <Logs />
            </ProtectedRoute>
          } />
          <Route path="/statistik" element={
            <ProtectedRoute>
              <Statistik />
            </ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
