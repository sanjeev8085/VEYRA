import React from 'react';
import { useStore } from '../../store/useStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const toasts = useStore((state) => state.toasts);
  const removeToast = useStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '380px',
        width: 'calc(100% - 3rem)',
      }}
    >
      {toasts.map((toast) => {
        let icon = <Info size={20} color="#38bdf8" />;
        let borderColor = 'rgba(56, 189, 248, 0.4)';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={20} color="#10b981" />;
          borderColor = 'rgba(16, 185, 129, 0.4)';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={20} color="#ef4444" />;
          borderColor = 'rgba(239, 68, 68, 0.4)';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={20} color="#f59e0b" />;
          borderColor = 'rgba(245, 158, 11, 0.4)';
        }

        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              padding: '1rem 1.25rem',
              background: 'rgba(15, 15, 22, 0.95)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <div style={{ marginTop: '2px' }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
