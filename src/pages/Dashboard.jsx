import { TrendingUp, Package, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { dashboardStats, orders, auditLogs } from '../data/mockData';

const monthlyData = [
  { month: 'Oct', ke: 42000, tz: 38000 },
  { month: 'Nov', ke: 55000, tz: 47000 },
  { month: 'Dec', ke: 61000, tz: 53000 },
  { month: 'Jan', ke: 49000, tz: 44000 },
  { month: 'Feb', ke: 71000, tz: 63000 },
  { month: 'Mar', ke: 85000, tz: 70000 },
];

function BarChart({ data }) {
  const max = Math.max(...data.flatMap(d => [d.ke, d.tz]));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 120, padding: '0 4px' }}>
      {data.map(d => (
        <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
            <div style={{
              width: 16,
              height: `${(d.ke / max) * 100}%`,
              background: 'var(--ke-green)',
              borderRadius: '3px 3px 0 0',
              opacity: 0.85,
              minHeight: 4,
            }} title={`KE: ${d.ke.toLocaleString()}`} />
            <div style={{
              width: 16,
              height: `${(d.tz / max) * 100}%`,
              background: 'var(--tz-blue)',
              borderRadius: '3px 3px 0 0',
              opacity: 0.85,
              minHeight: 4,
            }} title={`TZ: ${d.tz.toLocaleString()}`} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function MiniDonut({ value, total, color }) {
  const pct = (value / total) * 100;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

const statusMap = {
  pending: { label: 'Pending', cls: 'badge-warning' },
  approved: { label: 'Approved', cls: 'badge-info' },
  marking: { label: 'Marking', cls: 'badge-warning' },
  completed: { label: 'Completed', cls: 'badge-success' },
};

export default function Dashboard() {
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="section-gap">
      {/* KPIs */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-card-label">Codes Issued (Mar)</div>
          <div className="stat-card-value">{(155000).toLocaleString()}</div>
          <div className="stat-card-delta delta-up">
            <TrendingUp size={12} /> +19.6% vs Feb
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Codes Activated</div>
          <div className="stat-card-value">{(111200).toLocaleString()}</div>
          <div className="stat-card-delta delta-up">
            <TrendingUp size={12} /> 71.7% activation rate
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Active Orders</div>
          <div className="stat-card-value">2</div>
          <div className="stat-card-delta" style={{ color: 'var(--text-muted)' }}>
            4 total this month
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Fraud Alerts</div>
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>0</div>
          <div className="stat-card-delta delta-up">
            <ShieldCheck size={12} /> All marks verified
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Codes Issued by Country (Monthly)</span>
            <div className="flex gap-3">
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--ke-green)', display: 'inline-block' }} /> Kenya
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--tz-blue)', display: 'inline-block' }} /> Tanzania
              </span>
            </div>
          </div>
          <div className="card-body">
            <BarChart data={monthlyData} />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="text-xs text-muted">Kenya (ETSMS)</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ke-green)' }}>85,000</div>
                <div className="text-xs text-muted">codes this month</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-xs text-muted">Tanzania (EGMS)</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tz-blue)' }}>70,000</div>
                <div className="text-xs text-muted">codes this month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Excise Revenue (Mar)</span>
          </div>
          <div className="card-body">
            <div className="flex gap-4 items-center mb-4">
              <div style={{ position: 'relative' }}>
                <MiniDonut value={71} total={100} color="var(--ke-green)" />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>71%</div>
              </div>
              <div>
                <div className="text-xs text-muted">Kenya (KES)</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ke-green)' }}>4.7M</div>
                <div className="text-xs text-muted">from cross-border imports</div>
              </div>
            </div>
            <div className="divider" style={{ margin: '12px 0' }} />
            <div className="flex gap-4 items-center">
              <div style={{ position: 'relative' }}>
                <MiniDonut value={55} total={100} color="var(--tz-blue)" />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>55%</div>
              </div>
              <div>
                <div className="text-xs text-muted">Tanzania (TZS)</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tz-blue)' }}>2.13M</div>
                <div className="text-xs text-muted">from cross-border imports</div>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: 10, background: 'var(--bg)', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div className="text-xs text-muted">Pending sync codes</div>
              <div className="flex justify-between items-center mt-1">
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--warning)' }}>12,400</span>
                <span className="status-badge badge-warning">Syncing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Orders</span>
          <span className="status-badge badge-neutral">{orders.length} total</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Importer → Producer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Prefix</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => {
                const pct = o.quantity > 0 ? Math.round((o.markedCount / o.quantity) * 100) : 0;
                const st = statusMap[o.status] || { label: o.status, cls: 'badge-neutral' };
                return (
                  <tr key={o.id}>
                    <td className="font-mono" style={{ fontSize: 12 }}>{o.id}</td>
                    <td>
                      <div className="text-sm" style={{ lineHeight: 1.4 }}>
                        <span className={`pill pill-${o.importerCountry.toLowerCase()}`}>{o.importerName}</span>
                        <ArrowRight size={12} style={{ margin: '0 4px', color: 'var(--text-muted)', verticalAlign: 'middle' }} />
                        <span className={`pill pill-${o.producerCountry.toLowerCase()}`}>{o.producerName}</span>
                      </div>
                    </td>
                    <td className="text-sm">{o.product}</td>
                    <td className="text-sm">{o.quantity.toLocaleString()}</td>
                    <td>
                      <code style={{
                        fontSize: 12, fontWeight: 700, padding: '2px 7px',
                        background: o.prefix === 'KE' ? 'rgba(0,102,0,0.1)' : 'rgba(30,58,138,0.1)',
                        color: o.prefix === 'KE' ? 'var(--ke-green)' : 'var(--tz-blue)',
                      }}>{o.prefix}</code>
                    </td>
                    <td style={{ width: 100 }}>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar-wrap" style={{ flex: 1, height: 6, margin: 0 }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--success)' : undefined }} />
                        </div>
                        <span className="text-xs text-muted">{pct}%</span>
                      </div>
                    </td>
                    <td><span className={`status-badge ${st.cls}`}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent events */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent System Events</span>
          <span className="status-badge badge-success">Live</span>
        </div>
        <div className="card-body">
          <div className="timeline">
            {auditLogs.slice(0, 5).map((log, i) => (
              <div key={log.id} className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-dot" style={{
                    background: log.type === 'sync' ? 'var(--eac-light)' :
                                log.type === 'marking' ? 'rgba(0,102,0,0.1)' :
                                log.type === 'payment' ? '#fef9c3' : '#f1f5f9',
                    color: log.type === 'sync' ? 'var(--eac-blue)' :
                           log.type === 'marking' ? 'var(--ke-green)' :
                           log.type === 'payment' ? 'var(--warning)' : 'var(--text-muted)',
                    fontSize: 14,
                  }}>
                    {log.type === 'sync' ? '⟷' : log.type === 'marking' ? '📦' : log.type === 'payment' ? '💰' : '📋'}
                  </div>
                  <div className="timeline-line" />
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">{log.event}</div>
                  <div className="timeline-desc">{log.detail}</div>
                  <div className="timeline-time">
                    {log.timestamp} &nbsp;·&nbsp;
                    <span className={`pill pill-${log.country.toLowerCase()}`}>{log.country}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
