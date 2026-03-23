import { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { auditLogs } from '../data/mockData';

const codeDatabase = {
  'TZ-31200001': { prefix: 'TZ', orderId: 'ORD-TZ-2024-0891', product: 'Beer (500ml)', producer: 'Kenya Breweries Ltd', producerCountry: 'KE', destCountry: 'TZ', activated: true, exported: true, borderCleared: false, marketRelease: false, activatedAt: '2024-03-16 09:14', exportedAt: '2024-03-17', borderAt: null, exportDecl: { system: 'iCMS', ref: 'iCMS-EXP-2024-KBL-0891' }, importEntry: { system: 'TANCIS', ref: 'TANCIS-IMP-2024-DS-0891', pending: true }, alert: null },
  'TZ-40000050': { prefix: 'TZ', orderId: 'ORD-TZ-2024-0880', product: 'Beer (500ml)', producer: 'Kenya Breweries Ltd', producerCountry: 'KE', destCountry: 'TZ', activated: true, exported: true, borderCleared: true, marketRelease: true, activatedAt: '2024-02-05 14:22', exportedAt: '2024-02-08', borderAt: '2024-02-09', exportDecl: { system: 'iCMS', ref: 'iCMS-EXP-2024-KBL-0880' }, importEntry: { system: 'TANCIS', ref: 'TANCIS-IMP-2024-DS-0880', pending: false }, alert: null },
  'KE-80000123': { prefix: 'KE', orderId: 'ORD-KE-2024-1045', product: 'Beer (330ml)', producer: 'Tanzania Breweries Ltd', producerCountry: 'TZ', destCountry: 'KE', activated: true, exported: true, borderCleared: true, marketRelease: true, activatedAt: '2024-02-27 11:00', exportedAt: '2024-03-02', borderAt: '2024-03-03', exportDecl: { system: 'TANCIS', ref: 'TANCIS-EXP-2024-TBL-1045' }, importEntry: { system: 'iCMS', ref: 'iCMS-IMP-2024-NBI-1045', pending: false }, alert: null },
  'KE-00001234': { prefix: 'KE', orderId: 'ORD-KE-FAKE', product: 'Beer (500ml)', producer: 'Unknown', producerCountry: 'TZ', destCountry: 'KE', activated: false, exported: false, borderCleared: false, marketRelease: false, activatedAt: null, exportedAt: null, borderAt: null, exportDecl: null, importEntry: null, alert: 'UNREGISTERED_CODE' },
  'TZ-99999999': { prefix: 'TZ', orderId: 'ORD-TZ-SUSP', product: 'Beer (500ml)', producer: 'Kenya Breweries Ltd', producerCountry: 'KE', destCountry: 'KE', activated: true, exported: false, borderCleared: false, marketRelease: false, activatedAt: '2024-03-10 08:00', exportedAt: null, borderAt: null, exportDecl: null, importEntry: null, alert: 'WRONG_COUNTRY' },
};

export default function AuditVerification({ notify }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [tab, setTab] = useState('verify');

  function handleSearch(e) {
    e.preventDefault();
    const code = query.trim().toUpperCase();
    const found = codeDatabase[code];
    setResult(found || null);
    setSearched(true);
    if (!found) notify('Code not found in database');
  }

  const trailSteps = result ? [
    { label: 'Order Created', done: true, detail: `${result.orderId}`, country: result.destCountry, date: '—' },
    { label: 'Codes Generated', done: true, detail: `Prefix ${result.prefix} assigned`, country: result.destCountry, date: '—' },
    { label: 'Synced to Producer', done: true, detail: `${result.producerCountry === 'KE' ? 'ETSMS' : 'EGMS'} → ${result.producerCountry === 'KE' ? 'producer SCL' : 'producer SCL'}`, country: result.producerCountry, date: '—' },
    { label: 'Activated at Production', done: result.activated, detail: result.activated ? `Applied at ${result.producer} — SCL codes activated` : 'Not yet activated', country: result.producerCountry, date: result.activatedAt || '—' },
    {
      label: `Exported — ${result.exportDecl ? result.exportDecl.system + ' Export Declaration' : (result.producerCountry === 'KE' ? 'iCMS' : 'TANCIS')}`,
      done: result.exported,
      detail: result.exported && result.exportDecl
        ? `${result.exportDecl.ref} · ${result.producerCountry === 'KE' ? 'Kenya Revenue Authority' : 'Tanzania Revenue Authority'}`
        : result.exported ? 'Exported — declaration reference unavailable' : 'Not yet exported',
      country: result.producerCountry,
      date: result.exportedAt || '—',
    },
    {
      label: `Border Cleared — ${result.importEntry ? result.importEntry.system + ' Import Entry' : (result.destCountry === 'KE' ? 'iCMS' : 'TANCIS')}`,
      done: result.borderCleared,
      detail: result.borderCleared && result.importEntry
        ? `${result.importEntry.ref} · Pre-registered, cleared without restamping`
        : result.importEntry && result.importEntry.pending ? `${result.importEntry.ref} · Import entry lodged — clearance pending` : 'Not yet at border',
      country: result.destCountry,
      date: result.borderAt || '—',
    },
    { label: 'Market Release', done: result.marketRelease, detail: result.marketRelease ? 'In market' : 'Pending', country: result.destCountry, date: '—' },
  ] : [];

  return (
    <div className="section-gap">
      <div className="page-header">
        <div className="page-title">Audit & Mark Verification</div>
        <div className="page-desc">Authenticate secure codes and trace supply chain across borders</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {[
          { key: 'verify', label: 'Mark Authentication' },
          { key: 'trail', label: 'Cross-Border Trace' },
          { key: 'log', label: 'Audit Log' },
          { key: 'alerts', label: 'Exception Alerts' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 13.5, fontWeight: 500,
            color: tab === t.key ? 'var(--eac-blue)' : 'var(--text-muted)',
            borderBottom: `2px solid ${tab === t.key ? 'var(--eac-blue)' : 'transparent'}`,
            marginBottom: -1,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {(tab === 'verify' || tab === 'trail') && (
        <div className="card">
          <div className="card-header">
            <span className="card-title"><Search size={15} /> Code Lookup</span>
            <span className="text-xs text-muted">Try: TZ-31200001 · KE-80000123 · KE-00001234 · TZ-99999999</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleSearch} className="inline-form">
              <input
                className="form-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter code e.g. TZ-31200001"
                style={{ flex: 1, fontFamily: 'monospace' }}
              />
              <button type="submit" className="btn btn-primary">
                <Search size={14} /> Verify
              </button>
            </form>

            {searched && !result && (
              <div style={{ marginTop: 16, padding: 16, background: '#fee2e2', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
                <ShieldAlert size={20} style={{ color: 'var(--danger)' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--danger)' }}>Code Not Found</div>
                  <div className="text-sm text-muted">This code is not registered in either the ETSMS or EGMS database.</div>
                </div>
              </div>
            )}

            {result && (
              <div style={{ marginTop: 16 }}>
                {result.alert === 'WRONG_COUNTRY' && (
                  <div style={{ padding: 12, background: '#fef3c7', borderRadius: 8, border: '1px solid #d97706', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <ShieldAlert size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--warning)', fontSize: 13 }}>⚠ Suspicious Activity Detected</div>
                      <div className="text-xs text-muted">Code has prefix <strong>{result.prefix}</strong> but was detected in the wrong market. Possible fake export / diversion.</div>
                    </div>
                  </div>
                )}
                {result.alert === 'UNREGISTERED_CODE' && (
                  <div style={{ padding: 12, background: '#fee2e2', borderRadius: 8, border: '1px solid #dc2626', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <ShieldAlert size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--danger)', fontSize: 13 }}>🚨 Counterfeit / Unregistered Code</div>
                      <div className="text-xs text-muted">This code is not linked to any valid order. The product may be counterfeit or the mark has been tampered with.</div>
                    </div>
                  </div>
                )}
                {!result.alert && (
                  <div style={{ padding: 12, background: '#dcfce7', borderRadius: 8, border: '1px solid var(--success)', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--success)', fontSize: 13 }}>✓ Authentic — Valid Secure Mark</div>
                      <div className="text-xs text-muted">Code verified against {result.destCountry === 'KE' ? 'ETSMS (Kenya)' : 'EGMS (Tanzania)'} database.</div>
                    </div>
                  </div>
                )}

                <div className="grid-2" style={{ gap: 12 }}>
                  {[
                    ['Code', query.toUpperCase()],
                    ['Prefix', result.prefix],
                    ['Product', result.product],
                    ['Order ID', result.orderId],
                    ['Producer', result.producer],
                    ['Producer Country', result.producerCountry === 'KE' ? '🇰🇪 Kenya' : '🇹🇿 Tanzania'],
                    ['Destination', result.destCountry === 'KE' ? '🇰🇪 Kenya' : '🇹🇿 Tanzania'],
                    ['Activated', result.activated ? `✓ ${result.activatedAt}` : '✗ Not activated'],
                    [
                      `${result.exportDecl?.system || (result.producerCountry === 'KE' ? 'iCMS' : 'TANCIS')} Export Decl.`,
                      result.exportDecl?.ref || '—',
                    ],
                    [
                      `${result.importEntry?.system || (result.destCountry === 'KE' ? 'iCMS' : 'TANCIS')} Import Entry`,
                      result.importEntry?.ref ? (result.importEntry.pending ? `${result.importEntry.ref} (pending)` : result.importEntry.ref) : '—',
                    ],
                  ].map(([k, v]) => (
                    <div key={k} style={{ padding: 10, background: 'var(--bg)', borderRadius: 6 }}>
                      <div className="text-xs text-muted">{k}</div>
                      <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-heading)', fontFamily: k === 'Code' || k === 'Order ID' ? 'monospace' : undefined }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'trail' && result && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Cross-Border Supply Chain Trail — {query.toUpperCase()}</span>
          </div>
          <div className="card-body">
            <div className="timeline">
              {trailSteps.map((step, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-left">
                    <div className="timeline-dot" style={{
                      background: step.done ? '#dcfce7' : 'var(--bg)',
                      border: `2px solid ${step.done ? 'var(--success)' : 'var(--border)'}`,
                      color: step.done ? 'var(--success)' : 'var(--text-muted)',
                      fontSize: 14,
                    }}>
                      {step.done ? '✓' : i + 1}
                    </div>
                    <div className="timeline-line" />
                  </div>
                  <div className="timeline-content">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="timeline-title" style={{ color: step.done ? 'var(--text-heading)' : 'var(--text-muted)' }}>
                          {step.label}
                        </div>
                        <div className="timeline-desc">{step.detail}</div>
                        {step.date !== '—' && <div className="timeline-time">{step.date}</div>}
                      </div>
                      <span className={`pill pill-${step.country?.toLowerCase()}`} style={{ flexShrink: 0 }}>
                        {step.country === 'KE' ? '🇰🇪' : '🇹🇿'} {step.country}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'log' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Audit Trail Log</span>
            <span className="status-badge badge-success">{auditLogs.length} events</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Country</th>
                  <th>Event</th>
                  <th>Detail</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs">{log.id}</td>
                    <td className="text-xs text-muted">{log.timestamp}</td>
                    <td>
                      <span style={{ fontSize: 14 }}>
                        {log.type === 'sync' ? '🔄' : log.type === 'marking' ? '📦' : log.type === 'payment' ? '💰' : '📋'}
                      </span>{' '}
                      <span className="text-xs">{log.type}</span>
                    </td>
                    <td><span className={`pill pill-${log.country.toLowerCase()}`}>{log.country === 'KE' ? '🇰🇪' : '🇹🇿'} {log.country}</span></td>
                    <td style={{ fontSize: 13.5, fontWeight: 500 }}>{log.event}</td>
                    <td className="text-sm text-muted">{log.detail}</td>
                    <td><span className="status-badge badge-success">✓</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'alerts' && (
        <div className="section-gap">
          <div className="card" style={{ borderLeft: '3px solid var(--danger)' }}>
            <div className="card-header">
              <span className="card-title"><ShieldAlert size={15} style={{ color: 'var(--danger)' }} /> Exception Alerts</span>
              <span className="status-badge badge-danger">1 active</span>
            </div>
            <div className="card-body section-gap" style={{ gap: 12 }}>
              {[
                {
                  type: 'WRONG_COUNTRY',
                  severity: 'warning',
                  title: 'Potential Fake Export / Code Diversion',
                  detail: 'Code TZ-99999999 bears TZ prefix but was scanned at a KE market checkpoint. This may indicate that goods were not actually exported to Tanzania.',
                  detectedAt: '2024-03-16 14:05',
                  code: 'TZ-99999999',
                  orderId: 'ORD-TZ-SUSP',
                },
              ].map((alert, i) => (
                <div key={i} style={{
                  padding: 14, borderRadius: 8,
                  background: alert.severity === 'danger' ? '#fee2e2' : '#fef9c3',
                  border: `1px solid ${alert.severity === 'danger' ? 'var(--danger)' : 'var(--warning)'}`,
                }}>
                  <div className="flex justify-between items-start mb-2">
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: alert.severity === 'danger' ? 'var(--danger)' : 'var(--warning)' }}>
                      ⚠ {alert.title}
                    </div>
                    <span className={`status-badge ${alert.severity === 'danger' ? 'badge-danger' : 'badge-warning'}`}>Active</span>
                  </div>
                  <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>{alert.detail}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs text-muted">Detected: {alert.detectedAt}</span>
                    <span className="text-xs font-mono">Code: {alert.code}</span>
                  </div>
                </div>
              ))}

              <div style={{ padding: 14, borderRadius: 8, background: '#dcfce7', border: '1px solid var(--success)' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--success)', marginBottom: 4 }}>
                  ✓ No Other Exceptions Detected
                </div>
                <p className="text-sm text-muted">
                  All other codes are within expected parameters. Cross-border data validation is running normally.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
