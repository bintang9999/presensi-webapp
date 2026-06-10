import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from '../components/MobileNav';

export const ProtectedRoute: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-transparent"><p className="text-zinc-400">Loading...</p></div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const MainLayout: React.FC = () => {
  return (
    <div className="h-[100dvh] w-screen p-2 sm:p-4 lg:p-6 flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-6 overflow-hidden bg-transparent">
      {/* Floating Sidebar Panel (Desktop Only) */}
      <Sidebar />
      
      {/* Floating Main Content Panel */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-4 lg:gap-6 min-h-0 w-full max-w-full">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto rounded-3xl vision-pane p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Floating Bottom Nav (Mobile Only) */}
      <MobileNav />
    </div>
  );
};


