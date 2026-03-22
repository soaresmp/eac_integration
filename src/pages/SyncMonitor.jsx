import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, ArrowRight, Database } from 'lucide-react';

const initialSyncJobs = [
  { id: 'SYNC-001', type: 'manufacturer', direction: 'KE→TZ', description: 'Kenya Breweries Limited', records: 1, status: 'completed', ts: '2024-03-16 14:32:07', duration: '1.2s' },
  { id: 'SYNC-002', type: 'code_batch', direction: 'TZ→KE', description: 'ORD-KE-2024-1046: 30,000 codes', records: 30000, status: 'pending', ts: '2024-03-16 16:10:00', duration: '—' },
  { id: 'SYNC-003', type: 'activation', direction: 'KE→TZ', description: 'ORD-TZ-2024-0891: 5,000 activated', records: 5000, status: 'completed', ts: '2024-03-16 09:14:55', duration: '0.8s' },
  { id: 'SYNC-004', type: 'importer', direction: 'TZ→KE', description: 'Tanzania Beverages Dist. profile sync', records: 1, status: 'completed', ts: '2024-03-15 10:00:00', duration: '0.5s' },
  { id: 'SYNC-005', type: 'code_batch', direction: 'KE→TZ', description: 'ORD-TZ-2024-0892: 25,000 codes', records: 25000, status: 'completed', ts: '2024-03-15 08:30:12', duration: '3.1s' },
  { id: 'SYNC-006', type: 'activation', direction: 'TZ→KE', description: 'ORD-KE-2024-1045: 80,000 activated', records: 80000, status: 'completed', ts: '2024-03-05 14:00:00', duration: '8.4s' },
];

const typeIcon = {
  manufacturer: '🏭',
  code_batch: '🔢',
  activation: '✅',
  importer: '🏢',
};

const statusBadge = {
  completed: 'badge-success',
  pending: 'badge-warning',
  failed: 'badge-danger',
  syncing: 'badge-info',
};

export default function SyncMonitor({ notify }) {
  const [jobs, setJobs] = useState(initialSyncJobs);
  const [keStatus, setKeStatus] = useState('online');
  const [tzStatus, setTzStatus] = useState('online');
  const [latency, setLatency] = useState({ ke: 45, tz: 62 });
  const [forcingSync, setForcingSync] = useState(false);

  function forceSync() {
    setForcingSync(true);
    const pendingJob = jobs.find(j => j.status === 'pending');
    if (pendingJob) {
      setJobs(prev => prev.map(j =>
        j.id === pendingJob.id ? { ...j, status: 'syncing' } : j
      ));
      setTimeout(() => {
        setJobs(prev => prev.map(j =>
          j.id === pendingJob.id ? { ...j, status: 'completed', duration: '2.3s', ts: new Date().toLocaleString() } : j
        ));
        setForcingSync(false);
        notify('✓ Sync completed — 30,000 codes transferred to ETSMS (Kenya)');
      }, 2500);
    } else {
      setTimeout(() => setForcingSync(false), 1000);
    }
  }

  useEffect(() => {
    const t = setInterval(() => {
      setLatency({ ke: Math.floor(Math.random() * 20 + 35), tz: Math.floor(Math.random() * 25 + 50) });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const pending = jobs.filter(j => j.status === 'pending').length;
  const completed = jobs.filter(j => j.status === 'completed').length;
  const totalRecords = jobs.filter(j => j.status === 'completed').reduce((s, j) => s + j.records, 0);

  return (
    <div className="section-gap">
      <div className="flex justify-between items-center page-header">
        <div>
          <div className="page-title">System Synchronisation Monitor</div>
          <div className="page-desc">Real-time data sync between ETSMS (Kenya) and EGMS (Tanzania)</div>
        </div>
        <button className="btn btn-primary" onClick={forceSync} disabled={forcingSync || pending === 0}>
          <RefreshCw size={14} className={forcingSync ? 'spin' : ''} />
          {forcingSync ? 'Syncing...' : 'Force Sync'}
        </button>
      </div>

      {/* System health */}
      <div className="grid-2">
        {[
          { country: 'KE', name: 'Kenya — ETSMS', system: 'KRA Data Management', status: keStatus, lat: latency.ke },
          { country: 'TZ', name: 'Tanzania — EGMS', system: 'TRA Data Management', status: tzStatus, lat: latency.tz },
        ].map(sys => (
          <div key={sys.country} className={`country-panel panel-${sys.country.toLowerCase()}`}>
            <div className={`panel-${sys.country.toLowerCase()}-header`}>
              {sys.country === 'KE' ? '🇰🇪' : '🇹🇿'} {sys.name}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-muted">{sys.system}</div>
                <div className="flex gap-2 items-center mt-2">
                  <span className="status-badge badge-success">● Online</span>
                  <span className="text-xs text-muted">Latency: {sys.lat}ms</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-xs text-muted">Last sync</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-heading)' }}>2 min ago</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Integration arrow */}
      <div className="card">
        <div className="card-body" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--ke-green)', fontSize: 14 }}>ETSMS</div>
              <div className="text-xs text-muted">Kenya Revenue Authority</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--eac-blue)' }}>
                <span>Manufacturers</span>
                <ArrowRight size={12} />
              </div>
              <div style={{ width: 120, height: 2, background: `linear-gradient(90deg, var(--ke-green), var(--tz-blue))`, borderRadius: 2 }} />
              <div style={{ width: 120, height: 2, background: `linear-gradient(90deg, var(--tz-blue), var(--ke-green))`, borderRadius: 2 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--eac-blue)' }}>
                <ArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
                <span>Codes + Activations</span>
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--tz-blue)', fontSize: 14 }}>EGMS</div>
              <div className="text-xs text-muted">Tanzania Revenue Authority</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Pending Jobs', val: pending, color: 'var(--warning)' },
              { label: 'Completed', val: completed, color: 'var(--success)' },
              { label: 'Records Synced', val: totalRecords.toLocaleString(), color: 'var(--eac-blue)' },
              { label: 'Sync Health', val: '100%', color: 'var(--success)' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '10px 0', borderRadius: 6, background: 'var(--bg)' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sync jobs */}
      <div className="card">
        <div className="card-header">
          <span className="card-title"><Database size={16} /> Synchronisation Jobs</span>
          <span className="status-badge badge-neutral">{jobs.length} jobs</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Type</th>
                <th>Direction</th>
                <th>Description</th>
                <th>Records</th>
                <th>Timestamp</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td className="font-mono text-xs">{j.id}</td>
                  <td>
                    <span style={{ fontSize: 16 }}>{typeIcon[j.type]}</span>{' '}
                    <span className="text-xs text-muted">{j.type}</span>
                  </td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <span className={`pill pill-${j.direction.slice(0,2).toLowerCase()}`}>{j.direction.slice(0,2)}</span>
                      <ArrowRight size={10} style={{ color: 'var(--text-muted)' }} />
                      <span className={`pill pill-${j.direction.slice(3).toLowerCase()}`}>{j.direction.slice(3)}</span>
                    </div>
                  </td>
                  <td className="text-sm">{j.description}</td>
                  <td className="text-sm font-bold">{j.records.toLocaleString()}</td>
                  <td className="text-xs text-muted">{j.ts}</td>
                  <td className="text-xs font-mono">{j.duration}</td>
                  <td>
                    <span className={`status-badge ${statusBadge[j.status] || 'badge-neutral'}`}>
                      {j.status === 'syncing' ? '⟳ Syncing' : j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--eac-blue)' }}>
        <div className="card-body">
          <div className="flex gap-3 items-start">
            <span style={{ fontSize: 22 }}>🔐</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-heading)' }}>Data Sovereignty Guarantee</div>
              <p className="text-sm text-muted" style={{ marginTop: 4, lineHeight: 1.6 }}>
                Data intended for a specific government is stored only in their own database.
                KRA data stays in ETSMS (Kenya), TRA data stays in EGMS (Tanzania).
                Cross-border synchronisation only transfers the minimum necessary data
                (code batches, activation confirmations) using secure encrypted channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
