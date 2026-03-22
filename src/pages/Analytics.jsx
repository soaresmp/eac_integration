import { useState } from 'react';
import { TrendingUp, BarChart3, Map, FileBarChart } from 'lucide-react';

const productCategories = {
  phase1: [
    { name: 'Beer', icon: '🍺', active: true, keVolume: 1200000, tzVolume: 980000 },
    { name: 'Sodas', icon: '🥤', active: true, keVolume: 650000, tzVolume: 480000 },
    { name: 'Juices', icon: '🧃', active: true, keVolume: 420000, tzVolume: 350000 },
    { name: 'Water', icon: '💧', active: true, keVolume: 800000, tzVolume: 620000 },
  ],
  phase2: [
    { name: 'Wine', icon: '🍷', active: false, keVolume: 0, tzVolume: 0 },
    { name: 'Spirits', icon: '🥃', active: false, keVolume: 0, tzVolume: 0 },
    { name: 'Tobacco', icon: '🚬', active: false, keVolume: 0, tzVolume: 0 },
  ],
};

const complianceCostData = [
  { year: '2022', traditional: 100, integrated: null },
  { year: '2023', traditional: 105, integrated: null },
  { year: '2024 (Pre)', traditional: 108, integrated: null },
  { year: '2024 (Post)', traditional: null, integrated: 42 },
  { year: '2025 (Est)', traditional: null, integrated: 38 },
];

const fraudMetrics = [
  { metric: 'Codes verified', value: '155,000', status: 'good' },
  { metric: 'Failed verifications', value: '0', status: 'good' },
  { metric: 'Wrong-country detections', value: '1', status: 'warn' },
  { metric: 'Unregistered codes found', value: '0', status: 'good' },
  { metric: 'Fake export flags', value: '1', status: 'warn' },
  { metric: 'Revenue protected (KES)', value: '4.7M', status: 'good' },
];

function SimpleBar({ value, max, color, label }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-bold">{(value / 1000).toFixed(0)}K</span>
      </div>
      <div style={{ background: 'var(--border)', height: 10, borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 5, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

export default function Analytics({ activeCountry }) {
  const [tab, setTab] = useState('revenue');
  const [phase2Enabled, setPhase2Enabled] = useState({ Wine: false, Spirits: false, Tobacco: false });

  const allProducts = [...productCategories.phase1, ...productCategories.phase2];
  const maxVolume = Math.max(...allProducts.map(p => Math.max(p.keVolume, p.tzVolume)));

  return (
    <div className="section-gap">
      <div className="page-header">
        <div className="page-title">Reporting & Analytics</div>
        <div className="page-desc">Revenue intelligence, fraud risk, supply chain visibility</div>
      </div>

      <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
        {[
          { key: 'revenue', label: 'Revenue Intelligence' },
          { key: 'fraud', label: 'Fraud Risk Report' },
          { key: 'supply', label: 'Supply Chain Map' },
          { key: 'compliance', label: 'Compliance Cost' },
          { key: 'phase2', label: 'Phase II Readiness' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500,
            color: tab === t.key ? 'var(--eac-blue)' : 'var(--text-muted)',
            borderBottom: `2px solid ${tab === t.key ? 'var(--eac-blue)' : 'transparent'}`,
            marginBottom: -1, whiteSpace: 'nowrap',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'revenue' && (
        <div className="section-gap">
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Revenue Forecast — {activeCountry === 'KE' ? '🇰🇪 KRA' : '🇹🇿 TRA'}</span>
                <span className="status-badge badge-info">Near Real-Time</span>
              </div>
              <div className="card-body">
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Expected This Quarter</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: activeCountry === 'KE' ? 'var(--ke-green)' : 'var(--tz-blue)' }}>
                    {activeCountry === 'KE' ? 'KES 14.1M' : 'TZS 6.4M'}
                  </div>
                  <div className="text-sm text-muted" style={{ marginTop: 4 }}>Based on {activeCountry === 'KE' ? '155,000' : '125,000'} codes activated at foreign producers</div>
                </div>
                <div className="divider" />
                <div className="grid-2" style={{ gap: 10 }}>
                  {[
                    { label: 'Codes Activated', val: activeCountry === 'KE' ? '111,200' : '95,000', color: 'var(--eac-blue)' },
                    { label: 'In Transit', val: activeCountry === 'KE' ? '31,200' : '25,000', color: 'var(--warning)' },
                    { label: 'Border Cleared', val: activeCountry === 'KE' ? '80,000' : '70,000', color: 'var(--success)' },
                    { label: 'Tax Collected', val: activeCountry === 'KE' ? 'KES 3.2M' : 'TZS 2.1M', color: 'var(--ke-green)' },
                  ].map(s => (
                    <div key={s.label} style={{ padding: 10, background: 'var(--bg)', borderRadius: 6, textAlign: 'center' }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: s.color }}>{s.val}</div>
                      <div className="text-xs text-muted">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Revenue by Product Category</span>
              </div>
              <div className="card-body">
                {productCategories.phase1.map(p => (
                  <SimpleBar
                    key={p.name}
                    label={`${p.icon} ${p.name}`}
                    value={activeCountry === 'KE' ? p.keVolume : p.tzVolume}
                    max={maxVolume}
                    color={activeCountry === 'KE' ? 'var(--ke-green)' : 'var(--tz-blue)'}
                  />
                ))}
                <div className="text-xs text-muted mt-2" style={{ textAlign: 'right' }}>Units tracked in current period</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Monthly Revenue Trend</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 100 }}>
                {[1.8, 2.1, 2.4, 2.0, 2.8, 3.2, 3.7, 4.1, 4.5, 4.2, 4.7, 5.1].map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '100%', height: `${(v / 5.5) * 90}px`,
                      background: `linear-gradient(180deg, ${activeCountry === 'KE' ? 'var(--ke-green)' : 'var(--tz-blue)'}, rgba(0,0,0,0.1))`,
                      borderRadius: '4px 4px 0 0', opacity: i === 11 ? 1 : 0.6,
                    }} />
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 3 }}>
                      {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted mt-2 text-center">Revenue ({activeCountry === 'KE' ? 'KES Millions' : 'TZS Millions'}) — Current Year</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'fraud' && (
        <div className="section-gap">
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Fraud Risk Indicators</span>
                <span className="status-badge badge-success">Low Risk</span>
              </div>
              <div className="card-body section-gap" style={{ gap: 10 }}>
                {fraudMetrics.map(m => (
                  <div key={m.metric} className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span className="text-sm">{m.metric}</span>
                    <div className="flex gap-2 items-center">
                      <strong style={{ fontSize: 15 }}>{m.value}</strong>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.status === 'good' ? 'var(--success)' : 'var(--warning)', flexShrink: 0 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Cross-Reference Checks</span>
              </div>
              <div className="card-body section-gap" style={{ gap: 12 }}>
                {[
                  { label: 'Production vs Export Declaration match', pct: 99.2, ok: true },
                  { label: 'Export vs Import volume reconciliation', pct: 97.8, ok: true },
                  { label: 'Code prefix vs destination country', pct: 99.9, ok: true },
                  { label: 'Activation before border crossing', pct: 100, ok: true },
                ].map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{c.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.pct >= 99 ? 'var(--success)' : 'var(--warning)' }}>{c.pct}%</span>
                    </div>
                    <div style={{ background: 'var(--border)', height: 6, borderRadius: 3 }}>
                      <div style={{ width: `${c.pct}%`, height: '100%', background: c.pct >= 99 ? 'var(--success)' : 'var(--warning)', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'supply' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title"><Map size={15} /> Supply Chain Flow Map</span>
            <span className="text-xs text-muted">Product flows between Kenya and Tanzania</span>
          </div>
          <div className="card-body">
            <div style={{
              background: 'linear-gradient(160deg, #e0f2fe 0%, #dcfce7 100%)',
              borderRadius: 12, padding: 24, minHeight: 320, position: 'relative', overflow: 'hidden',
            }}>
              {/* Kenya */}
              <div style={{ position: 'absolute', top: 40, left: 60, textAlign: 'center' }}>
                <div style={{ width: 100, background: 'rgba(0,102,0,0.15)', border: '2px solid var(--ke-green)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 28 }}>🇰🇪</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ke-green)' }}>KENYA</div>
                  <div className="text-xs text-muted">ETSMS</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  {[{ name: 'Kenya Breweries', prod: ['Beer'] }, { name: 'Bidco Africa', prod: ['Juices'] }].map(p => (
                    <div key={p.name} style={{ background: '#fff', borderRadius: 6, padding: '4px 8px', marginTop: 4, fontSize: 11, border: '1px solid var(--ke-green)' }}>
                      🏭 {p.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tanzania */}
              <div style={{ position: 'absolute', top: 40, right: 60, textAlign: 'center' }}>
                <div style={{ width: 100, background: 'rgba(30,58,138,0.12)', border: '2px solid var(--tz-blue)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 28 }}>🇹🇿</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--tz-blue)' }}>TANZANIA</div>
                  <div className="text-xs text-muted">EGMS</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  {[{ name: 'TZ Breweries', prod: ['Beer'] }, { name: 'Bonite Bottlers', prod: ['Sodas', 'Water'] }].map(p => (
                    <div key={p.name} style={{ background: '#fff', borderRadius: 6, padding: '4px 8px', marginTop: 4, fontSize: 11, border: '1px solid var(--tz-blue)' }}>
                      🏭 {p.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flows */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--eac-blue)', fontWeight: 600, marginBottom: 4 }}>KE → TZ exports</div>
                <div style={{ fontSize: 20 }}>⟵→</div>
                <div style={{ fontSize: 11, color: 'var(--eac-blue)', fontWeight: 600, marginTop: 4 }}>TZ → KE exports</div>
                <div style={{ marginTop: 8, padding: '4px 12px', background: 'rgba(255,255,255,0.8)', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                  🛡 Pre-marked & activated
                </div>
              </div>

              {/* Stats */}
              <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20 }}>
                {[
                  { label: 'KE→TZ exports', val: '91,200 units', color: 'var(--ke-green)' },
                  { label: 'TZ→KE exports', val: '80,000 units', color: 'var(--tz-blue)' },
                  { label: 'Border incidents', val: '0', color: 'var(--success)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.85)', padding: '6px 14px', borderRadius: 8, textAlign: 'center', fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'compliance' && (
        <div className="section-gap">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Compliance Cost Reduction for Importers</span>
              <span className="status-badge badge-success">-61% cost reduction</span>
            </div>
            <div className="card-body">
              <div className="grid-2" style={{ gap: 24 }}>
                <div>
                  <div className="text-xs text-muted mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Traditional Model (Per 10,000 Units)</div>
                  {[
                    { item: 'Stock holding / warehousing', cost: 45000 },
                    { item: 'Labour for unpacking', cost: 28000 },
                    { item: 'Paper stamp procurement', cost: 62000 },
                    { item: 'Application & repacking', cost: 38000 },
                    { item: 'Time-to-market delay', cost: 35000 },
                  ].map(c => (
                    <div key={c.item} className="flex justify-between items-center" style={{ padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                      <span className="text-sm">{c.item}</span>
                      <span className="text-sm font-bold text-danger">KES {c.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center" style={{ padding: '10px 0', borderTop: '2px solid var(--text-heading)' }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 800, color: 'var(--danger)', fontSize: 16 }}>KES 208,000</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>EAC Integration Model (Per 10,000 Units)</div>
                  {[
                    { item: 'Stock holding / warehousing', cost: 8000 },
                    { item: 'Labour for unpacking', cost: 0 },
                    { item: 'Digital order placement', cost: 2000 },
                    { item: 'Border clearance (pre-registered)', cost: 5000 },
                    { item: 'Time-to-market delay', cost: 5000 },
                  ].map(c => (
                    <div key={c.item} className="flex justify-between items-center" style={{ padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                      <span className="text-sm">{c.item}</span>
                      <span className="text-sm font-bold" style={{ color: c.cost === 0 ? 'var(--success)' : 'var(--text)' }}>
                        {c.cost === 0 ? '✓ Eliminated' : `KES ${c.cost.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center" style={{ padding: '10px 0', borderTop: '2px solid var(--success)' }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: 16 }}>KES 20,000</span>
                  </div>
                  <div style={{ marginTop: 10, padding: 10, background: '#dcfce7', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)' }}>-90%</div>
                    <div className="text-sm text-muted">compliance cost reduction per 10,000 units</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'phase2' && (
        <div className="section-gap">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Phase II Readiness — Product Category Expansion</span>
              <span className="status-badge badge-info">Configurable</span>
            </div>
            <div className="card-body section-gap" style={{ gap: 12 }}>
              <div style={{ padding: 12, background: 'var(--eac-light)', borderRadius: 8, fontSize: 13, color: 'var(--eac-blue)', lineHeight: 1.6 }}>
                Phase I covers beer, sodas, juices, and water. The integration architecture is designed to scale to additional excisable product categories. Toggle below to simulate onboarding new categories.
              </div>

              <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13.5 }}>Phase I — Active</div>
              <div className="grid-2">
                {productCategories.phase1.map(p => (
                  <div key={p.name} style={{ padding: 14, background: '#dcfce7', borderRadius: 8, border: '2px solid var(--success)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 28 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                      <div className="text-xs text-muted">Active · {((p.keVolume + p.tzVolume) / 1000).toFixed(0)}K units tracked</div>
                    </div>
                    <span className="status-badge badge-success" style={{ marginLeft: 'auto' }}>Active</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 8, marginBottom: 4, fontWeight: 600, fontSize: 13.5 }}>Phase II — Onboard New Categories</div>
              <div className="grid-3">
                {productCategories.phase2.map(p => (
                  <div key={p.name} style={{
                    padding: 14, background: phase2Enabled[p.name] ? 'var(--eac-light)' : 'var(--bg)',
                    borderRadius: 8, border: `2px solid ${phase2Enabled[p.name] ? 'var(--eac-blue)' : 'var(--border)'}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }} onClick={() => setPhase2Enabled(prev => ({ ...prev, [p.name]: !prev[p.name] }))}>
                    <div style={{ fontSize: 28, textAlign: 'center', marginBottom: 6 }}>{p.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, textAlign: 'center' }}>{p.name}</div>
                    <div className="text-xs text-muted text-center" style={{ marginTop: 2 }}>
                      {phase2Enabled[p.name] ? 'Click to disable' : 'Click to enable'}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <span className={`status-badge ${phase2Enabled[p.name] ? 'badge-info' : 'badge-neutral'}`}>
                        {phase2Enabled[p.name] ? 'Onboarding...' : 'Not Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {Object.values(phase2Enabled).some(Boolean) && (
                <div style={{ padding: 14, background: '#eff6ff', borderRadius: 8, border: '1px solid var(--eac-blue)', fontSize: 13 }}>
                  <div style={{ fontWeight: 600, color: 'var(--eac-blue)', marginBottom: 4 }}>
                    {Object.entries(phase2Enabled).filter(([, v]) => v).map(([k]) => k).join(', ')} selected for Phase II onboarding
                  </div>
                  <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                    These categories would use the same SCL infrastructure and ETSMS/EGMS integration. Tax authorities would configure product-specific rules, tax rates, and mark formats before go-live.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
