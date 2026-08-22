import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const isAdminAuthenticated = useStore((state) => state.isAdminAuthenticated);
  const adminSession = useStore((state) => state.adminSession);
  const location = useLocation();

  const isSessionValid =
    isAdminAuthenticated &&
    adminSession &&
    new Date(adminSession.expiresAt).getTime() > Date.now();

  if (!isSessionValid) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
