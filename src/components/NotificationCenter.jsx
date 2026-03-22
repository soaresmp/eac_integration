import { useState } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';

const initialNotifications = [
  {
    id: 'N001',
    type: 'order',
    title: 'Order Approved',
    message: 'ORD-TZ-2024-0892 has been approved by TRA. Payment awaited.',
    time: '16 Mar, 11:05',
    read: false,
    country: 'TZ',
  },
  {
    id: 'N002',
    type: 'sync',
    title: 'Sync Completed',
    message: '25,000 codes for ORD-TZ-2024-0892 synchronized to EGMS (Tanzania).',
    time: '15 Mar, 08:30',
    read: false,
    country: 'KE',
  },
  {
    id: 'N003',
    type: 'marking',
    title: 'Production Run Complete',
    message: 'Kenya Breweries completed marking 5,000 codes for ORD-TZ-2024-0891.',
    time: '16 Mar, 09:14',
    read: true,
    country: 'KE',
  },
  {
    id: 'N004',
    type: 'alert',
    title: 'Exception Alert',
    message: 'Code TZ-99999999 detected in wrong market. Possible diversion.',
    time: '16 Mar, 14:05',
    read: false,
    country: 'KE',
  },
  {
    id: 'N005',
    type: 'payment',
    title: 'Payment Confirmed',
    message: 'TZS 875,000 excise duty confirmed for ORD-TZ-2024-0892.',
    time: '15 Mar, 16:45',
    read: true,
    country: 'TZ',
  },
];

const typeConfig = {
  order: { icon: '📋', color: 'var(--eac-blue)', bg: 'var(--eac-light)' },
  sync: { icon: '🔄', color: 'var(--eac-blue)', bg: '#eff6ff' },
  marking: { icon: '📦', color: 'var(--ke-green)', bg: '#dcfce7' },
  alert: { icon: '⚠️', color: 'var(--warning)', bg: '#fef9c3' },
  payment: { icon: '💰', color: 'var(--success)', bg: '#dcfce7' },
};

export default function NotificationCenter({ liveNotifications, onClose }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const all = [
    ...liveNotifications.map((n, i) => ({
      id: `live-${i}`,
      type: 'sync',
      title: 'System Event',
      message: n,
      time: 'Just now',
      read: false,
      country: 'BOTH',
      isLive: true,
    })),
    ...notifications,
  ];

  const unread = all.filter(n => !n.read).length;

  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 380, height: '100vh', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', z: 200, display: 'flex', flexDirection: 'column', zIndex: 150 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-heading)' }}>
            <Bell size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Notifications
          </div>
          {unread > 0 && <div className="text-xs text-muted">{unread} unread</div>}
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={15} /></button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {all.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
            <div>No notifications</div>
          </div>
        ) : all.map(n => {
          const cfg = typeConfig[n.type] || typeConfig.sync;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--border)',
                background: n.read ? 'transparent' : 'rgba(29,78,216,0.03)',
                cursor: 'pointer',
                display: 'flex',
                gap: 12,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>
                {cfg.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between items-start">
                  <div style={{ fontWeight: n.read ? 500 : 700, fontSize: 13, color: 'var(--text-heading)' }}>{n.title}</div>
                  {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--eac-blue)', flexShrink: 0, marginTop: 4 }} />}
                </div>
                <div className="text-sm text-muted" style={{ marginTop: 2, lineHeight: 1.5 }}>{n.message}</div>
                <div className="flex gap-2 items-center" style={{ marginTop: 4 }}>
                  <span className="text-xs text-muted">{n.time}</span>
                  {n.country !== 'BOTH' && (
                    <span className={`pill pill-${n.country.toLowerCase()}`} style={{ fontSize: 10 }}>{n.country}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
