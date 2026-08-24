import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Mail,
  CheckCheck,
  Trash2,
  Package,
  CreditCard,
  Truck,
  Sparkles,
  Eye,
} from 'lucide-react';
import { CustomerNotification } from '../../types';
import {
  getNotifications,
  subscribeToNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  generateLuxuryEmailTemplate,
} from '../../services/notificationService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [selectedEmailNotif, setSelectedEmailNotif] = useState<CustomerNotification | null>(null);

  useEffect(() => {
    setNotifications(getNotifications());
    const unsubscribe = subscribeToNotifications((notifs) => {
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'order_placed':
        return <Package size={16} color="var(--accent-gold)" />;
      case 'payment_received':
        return <CreditCard size={16} color="var(--status-success)" />;
      case 'order_shipped':
        return <Truck size={16} color="var(--accent-sky)" />;
      case 'promotion_broadcast':
        return <Sparkles size={16} color="var(--accent-gold)" />;
      default:
        return <Bell size={16} color="var(--accent-gold)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 5, 8, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: selectedEmailNotif ? '850px' : '480px',
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-gold)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.6)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(184, 134, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Notifications & Status Alerts
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {unreadCount > 0 ? `${unreadCount} unread communication(s)` : 'All caught up'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem', minHeight: '34px' }}
                title="Mark all read"
              >
                <CheckCheck size={14} />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '50%',
              }}
              aria-label="Close notifications panel"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Split View Content: Notifications List + Email Simulator */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Notifications Feed */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {notifications.length === 0 ? (
              <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bell size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No alerts at the moment</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isSelected = selectedEmailNotif?.id === notif.id;
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      setSelectedEmailNotif(isSelected ? null : notif);
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: notif.isRead ? 'var(--bg-glass)' : 'rgba(184, 134, 11, 0.08)',
                      border: isSelected
                        ? '1px solid var(--accent-gold)'
                        : notif.isRead
                        ? '1px solid var(--border-subtle)'
                        : '1px solid var(--border-gold)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    {!notif.isRead && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'var(--accent-gold)',
                        }}
                      />
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIconForType(notif.type)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                          {notif.title}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                          {notif.message}
                        </p>

                        {/* Metadata Links */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.65rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {notif.channel.toUpperCase()}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEmailNotif(notif);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--accent-gold)',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Mail size={12} />
                              <span>View Email</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                                if (selectedEmailNotif?.id === notif.id) {
                                  setSelectedEmailNotif(null);
                                }
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '2px',
                              }}
                              title="Delete notification"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Luxury Email Dispatch Simulator Preview Pane */}
          {selectedEmailNotif && (
            <div
              style={{
                width: '420px',
                borderLeft: '1px solid var(--border-subtle)',
                background: '#070709',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.04)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Eye size={13} />
                  <span>Email Dispatch Simulator</span>
                </div>
                <button
                  onClick={() => setSelectedEmailNotif(null)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
                <iframe
                  title="Transactional Email Preview"
                  srcDoc={generateLuxuryEmailTemplate(selectedEmailNotif)}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '480px',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#121217',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
