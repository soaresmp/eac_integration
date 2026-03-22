import { Bell, RefreshCw } from 'lucide-react';

const pageTitles = {
  overview: 'EAC Integration Overview',
  dashboard: 'Analytics Dashboard',
  manufacturers: 'Manufacturer Registry',
  importers: 'Importer Registry',
  orders: 'Order Management',
  marking: 'Direct Marking & Activation',
  sync: 'System Synchronisation Monitor',
  audit: 'Audit Trail',
};

export default function Topbar({ page, activeCountry, setActiveCountry }) {
  return (
    <header className="portal-topbar">
      <span className="topbar-title">{pageTitles[page] || 'EAC Portal'}</span>
      <div className="topbar-right">
        <div className="country-selector">
          <button
            className={`country-btn ${activeCountry === 'KE' ? 'active-ke' : ''}`}
            onClick={() => setActiveCountry('KE')}
          >
            Kenya
          </button>
          <button
            className={`country-btn ${activeCountry === 'TZ' ? 'active-tz' : ''}`}
            onClick={() => setActiveCountry('TZ')}
          >
            Tanzania
          </button>
        </div>
        <span className="status-badge badge-success">Systems Online</span>
      </div>
    </header>
  );
}
