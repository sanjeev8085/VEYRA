import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Role, AdminRole, Permission } from '../types';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';


/**
 * Granular Role Permission Matrix
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'manage_products',
    'delete_products',
    'manage_inventory',
    'manage_orders',
    'view_customers',
    'manage_coupons',
    'manage_cms',
    'manage_settings',
    'manage_admins',
    'view_analytics',
  ],
  product_manager: [
    'manage_products',
    'manage_inventory',
    'manage_coupons',
    'manage_cms',
    'view_analytics',
  ],
  order_manager: [
    'manage_orders',
    'view_customers',
    'view_analytics',
  ],
  customer: [],
};

/**
 * Check if a role possesses a specific permission
 */
export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a role is within the allowed roles array
 */
export function hasRequiredRole(userRole: Role | undefined, allowedRoles: (Role | AdminRole)[]): boolean {
  if (!userRole) return false;
  if (userRole === 'super_admin') return true; // Super admin always possesses access
  return allowedRoles.includes(userRole);
}

/**
 * Luxury 403 Access Denied View
 */
export const AccessDeniedView: React.FC<{
  currentRole?: Role;
  requiredRoles?: (Role | AdminRole)[];
  requiredPermission?: Permission;
}> = ({ currentRole, requiredRoles, requiredPermission }) => {
  const adminLogout = useStore((state) => state.adminLogout);

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(220, 38, 38, 0.12)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#ef4444',
          }}
        >
          403 Access Restricted
        </span>

        <h2 className="font-display" style={{ fontSize: '1.75rem', marginTop: '0.5rem', marginBottom: '1rem', color: '#fff' }}>
          Privilege Elevation Required
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Your current session role (
          <strong style={{ color: 'var(--accent-gold)' }}>{currentRole?.replace('_', ' ').toUpperCase() || 'UNASSIGNED'}</strong>
          ) does not have sufficient permissions to access this administrative module.
          {requiredRoles && (
            <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Required Roles: {requiredRoles.join(', ')}
            </span>
          )}
          {requiredPermission && (
            <span style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Required Permission: {requiredPermission}
            </span>
          )}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/admin" className="btn btn-outline" style={{ padding: '0.65rem 1.25rem' }}>
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>

          <button
            onClick={() => {
              adminLogout();
              window.location.href = '/admin/login';
            }}
            className="btn btn-gold"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <Lock size={16} />
            <span>Switch Role Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Admin Route Guard with RBAC Permission Checking
 */
interface AdminAuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: AdminRole[];
  requiredPermission?: Permission;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
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

  const currentRole = adminSession.user.role as AdminRole;

  // Check allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRequiredRole(currentRole, allowedRoles)) {
      return (
        <AccessDeniedView
          currentRole={currentRole}
          requiredRoles={allowedRoles}
          requiredPermission={requiredPermission}
        />
      );
    }
  }

  // Check required permission
  if (requiredPermission) {
    if (!hasPermission(currentRole, requiredPermission)) {
      return (
        <AccessDeniedView
          currentRole={currentRole}
          requiredRoles={allowedRoles}
          requiredPermission={requiredPermission}
        />
      );
    }
  }

  return <>{children}</>;
};

/**
 * Backward compatibility alias for AdminProtectedRoute
 */
export const AdminProtectedRoute = AdminAuthGuard;

/**
 * Customer Route Guard for VIP Profile and Orders
 */
interface CustomerAuthGuardProps {
  children: React.ReactNode;
  allowGuest?: boolean;
}

export const CustomerAuthGuard: React.FC<CustomerAuthGuardProps> = ({
  children,
  allowGuest = false,
}) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);
  const location = useLocation();

  const isAuthorized = isAuthenticated && user && (allowGuest || !user.isGuest);

  if (!isAuthorized) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Guest Only Route Guard (for Login / Register pages when user is already logged in)
 */
export const GuestOnlyGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);
  const location = useLocation();

  if (isAuthenticated && user && !user.isGuest) {
    const from = (location.state as any)?.from?.pathname || '/account';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
