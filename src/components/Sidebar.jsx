import {
  LayoutDashboard, Building2, Users,
  Stamp, BarChart3, FileText, ArrowLeftRight,
  Package, Map, Bell,
} from 'lucide-react';

const navItems = [
  { section: 'PORTAL', items: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ]},
  { section: 'REGISTRATION', items: [
    { id: 'manufacturers', label: 'Manufacturers', icon: Building2 },
    { id: 'importers', label: 'Importers', icon: Users },
  ]},
  { section: 'OPERATIONS', items: [
    { id: 'marking', label: 'Direct Marking', icon: Stamp },
    { id: 'sync', label: 'Sync Monitor', icon: ArrowLeftRight },
  ]},
  { section: 'TRACKING', items: [
    { id: 'import_tracking', label: 'Import Tracking', icon: Package },
    { id: 'audit', label: 'Audit & Verify', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: Map },
  ]},
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="portal-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">EAC Integration</div>
        <div className="sidebar-logo-sub">Excise Management Portal</div>
        <div className="sidebar-flags">
          <span className="flag-badge flag-ke">🇰🇪 KE</span>
          <span className="flag-badge flag-tz">🇹🇿 TZ</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            <div className="nav-section-title">{section}</div>
            {items.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`nav-item ${page === id ? 'active' : ''}`}
                onClick={() => setPage(id)}
              >
                <Icon size={16} className="nav-icon" />
                {label}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: 6, fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
          SYSTEM STATUS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
          <span>ETSMS (Kenya) — Online</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
          <span>EGMS (Tanzania) — Online</span>
        </div>
        <div>Phase I Prototype · v1.0.0</div>
      </div>
    </aside>
  );
}
