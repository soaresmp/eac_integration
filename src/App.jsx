import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import NotificationCenter from './components/NotificationCenter';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import Manufacturers from './pages/Manufacturers';
import Importers from './pages/Importers';
import Orders from './pages/Orders';
import DirectMarking from './pages/DirectMarking';
import SyncMonitor from './pages/SyncMonitor';
import ImportTracking from './pages/ImportTracking';
import AuditVerification from './pages/AuditVerification';
import Analytics from './pages/Analytics';
import { Bell } from 'lucide-react';

const pageTitles = {
  overview: 'EAC Integration Overview',
  dashboard: 'Analytics Dashboard',
  manufacturers: 'Manufacturer Registry',
  importers: 'Importer Registry',
  orders: 'Order Management',
  marking: 'Direct Marking — SCL Interface',
  sync: 'Synchronisation Monitor',
  import_tracking: 'Import Tracking & Revenue',
  audit: 'Audit & Verification',
  analytics: 'Reporting & Analytics',
};

export default function App() {
  const [page, setPage] = useState('overview');
  const [activeCountry, setActiveCountry] = useState('KE');
  const [notification, setNotification] = useState(null);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notify = useCallback((msg) => {
    setNotification(msg);
    setLiveNotifications(prev => [msg, ...prev.slice(0, 9)]);
    setUnreadCount(c => c + 1);
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const pageProps = { activeCountry, notify };

  const pages = {
    overview: <Overview />,
    dashboard: <Dashboard />,
    manufacturers: <Manufacturers {...pageProps} />,
    importers: <Importers {...pageProps} />,
    orders: <Orders {...pageProps} />,
    marking: <DirectMarking {...pageProps} />,
    sync: <SyncMonitor notify={notify} />,
    import_tracking: <ImportTracking activeCountry={activeCountry} />,
    audit: <AuditVerification notify={notify} />,
    analytics: <Analytics activeCountry={activeCountry} />,
  };

  // Extended nav includes import_tracking and analytics (accessed from topbar shortcuts)
  function handleSetPage(p) {
    setPage(p);
  }

  return (
    <div className="portal-layout">
      <Sidebar page={page} setPage={handleSetPage} />

      <div className="portal-content">
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
          padding: '0 24px', height: 56,
          position: 'sticky', top: 0, zIndex: 50, gap: 12,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-heading)', flex: 1 }}>
            {pageTitles[page] || 'EAC Portal'}
          </span>

          {/* Quick nav for extra pages */}
          <button
            onClick={() => handleSetPage('import_tracking')}
            className={`btn btn-sm ${page === 'import_tracking' ? 'btn-outline' : 'btn-ghost'}`}
            style={{ fontSize: 12 }}
          >
            📦 Import Tracking
          </button>
          <button
            onClick={() => handleSetPage('analytics')}
            className={`btn btn-sm ${page === 'analytics' ? 'btn-outline' : 'btn-ghost'}`}
            style={{ fontSize: 12 }}
          >
            📊 Analytics
          </button>

          {/* Country selector */}
          <div className="country-selector">
            <button
              className={`country-btn ${activeCountry === 'KE' ? 'active-ke' : ''}`}
              onClick={() => setActiveCountry('KE')}
            >
              🇰🇪 KE
            </button>
            <button
              className={`country-btn ${activeCountry === 'TZ' ? 'active-tz' : ''}`}
              onClick={() => setActiveCountry('TZ')}
            >
              🇹🇿 TZ
            </button>
          </div>

          {/* Notifications bell */}
          <button
            className="btn btn-ghost btn-sm"
            style={{ position: 'relative', padding: '6px 10px' }}
            onClick={() => { setShowNotifications(s => !s); setUnreadCount(0); }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: 'var(--danger)', color: '#fff',
                width: 16, height: 16, borderRadius: '50%',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <span className="status-badge badge-success" style={{ flexShrink: 0 }}>● Live</span>
        </div>

        <main className="portal-main">
          {pages[page] || pages.overview}
        </main>
      </div>

      {/* Toast notification */}
      {notification && (
        <div className="notification">
          <span style={{ fontSize: 16 }}>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Slide-in notification panel */}
      {showNotifications && (
        <NotificationCenter
          liveNotifications={liveNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
