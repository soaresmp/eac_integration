import { CheckCircle, ArrowRight, ShieldCheck, TrendingUp, Package, FileBarChart } from 'lucide-react';

const benefits = [
  { icon: ShieldCheck, text: 'Improved fraud detection via cross-border data checks' },
  { icon: TrendingUp, text: 'Near real-time visibility of imported production' },
  { icon: Package, text: 'Marks applied at source — no importer restamping' },
  { icon: FileBarChart, text: 'Unified audit trail across KRA and TRA' },
];

const prefixTable = [
  { source: 'Kenya', dest: 'Tanzania', prefix: 'TZ', system: 'ETSMS → EGMS' },
  { source: 'Kenya', dest: 'Kenya', prefix: 'KE', system: 'ETSMS internal' },
  { source: 'Tanzania', dest: 'Kenya', prefix: 'KE', system: 'EGMS → ETSMS' },
  { source: 'Tanzania', dest: 'Tanzania', prefix: 'TZ', system: 'EGMS internal' },
];

const steps = [
  {
    num: 1,
    title: 'Registration',
    country: 'Both',
    desc: 'Manufacturers and importers are registered and synchronized between ETSMS (Kenya) and EGMS (Tanzania). Importers are linked to specific foreign producers.',
  },
  {
    num: 2,
    title: 'Ordering',
    country: 'Importer',
    desc: 'The importer places an order with their tax authority for secure direct marks. Upon approval and payment, the foreign producer is notified and codes are synchronized.',
  },
  {
    num: 3,
    title: 'Direct Marking',
    country: 'Producer',
    desc: "At the foreign producer's SCL line, the operator selects the importer and order, then runs production. Codes are applied, activated, and securely synced to the destination country's database.",
  },
  {
    num: 4,
    title: 'Export & Clearance',
    country: 'Both',
    desc: 'Marked products are exported. Inspectors in the destination country can authenticate products using existing audit devices — no additional stamping required at customs.',
  },
];

export default function Overview() {
  return (
    <div className="section-gap">
      {/* Hero */}
      <div className="hero-banner">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 10 }}>
            East African Community · Phase I
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -0.5, margin: 0, lineHeight: 1.3 }}>
            EAC Excise Mark Integration
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 10, fontSize: 14, maxWidth: 640, lineHeight: 1.6 }}>
            Interoperable secure fiscal marks between Kenya (ETSMS) and Tanzania (EGMS), enabling products to be marked at the source country during manufacturing — eliminating post-import restamping.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}></span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Beer · Sodas · Juices · Water</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa', flexShrink: 0 }}></span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Secure 2D codes on SCL lines</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f9a8d4', flexShrink: 0 }}></span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>KRA × TRA collaboration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="grid-2">
        <div className="country-panel panel-ke">
          <div className="panel-ke-header">
            <span style={{ fontSize: 20 }}>🇰🇪</span>
            Kenya — ETSMS
          </div>
          <div className="section-gap" style={{ gap: 8 }}>
            <div className="flex gap-2 items-center">
              <span className="status-badge badge-success">KRA</span>
              <span className="text-sm text-muted">Kenya Revenue Authority</span>
            </div>
            <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
              The <strong>Excise Tax Stamps Management System</strong> manages excise stamp issuance, tracking, and authentication for products destined for the Kenyan market.
            </p>
            <div className="mt-2">
              <div className="text-xs text-muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Products covered</div>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {['Beer', 'Cider', 'Spirits', 'Juices', 'Water', 'Sodas'].map(p => (
                  <span key={p} className="pill pill-ke">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="country-panel panel-tz">
          <div className="panel-tz-header">
            <span style={{ fontSize: 20 }}>🇹🇿</span>
            Tanzania — EGMS
          </div>
          <div className="section-gap" style={{ gap: 8 }}>
            <div className="flex gap-2 items-center">
              <span className="status-badge badge-info">TRA</span>
              <span className="text-sm text-muted">Tanzania Revenue Authority</span>
            </div>
            <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
              The <strong>Excise Goods Management System</strong> manages fiscal stamp issuance and control for excisable goods on the Tanzanian market. Interoperable with ETSMS.
            </p>
            <div className="mt-2">
              <div className="text-xs text-muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Products covered</div>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {['Beer', 'Spirits', 'Wine', 'Juices', 'Water', 'Tobacco'].map(p => (
                  <span key={p} className="pill pill-tz">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process steps */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Integration Process — Phase I</span>
          <span className="status-badge badge-info">4 Steps</span>
        </div>
        <div className="card-body">
          <div className="process-flow" style={{ marginBottom: 28 }}>
            {steps.map((s, i) => (
              <div key={s.num} className={`process-step ${i < 3 ? 'completed' : 'active'}`}>
                <div className="step-circle">{i < 3 ? '✓' : s.num}</div>
                <div className="step-label">{s.title}</div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            {steps.map(s => (
              <div key={s.num} style={{ background: 'var(--bg)', borderRadius: 8, padding: 16, border: '1px solid var(--border)' }}>
                <div className="flex gap-2 items-center mb-2">
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--eac-blue)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{s.num}</span>
                  <strong style={{ fontSize: 13.5, color: 'var(--text-heading)' }}>{s.title}</strong>
                  <span className="status-badge badge-neutral text-xs" style={{ marginLeft: 'auto' }}>{s.country}</span>
                </div>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prefix table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Secure Mark Prefix Rules</span>
          <span className="text-xs text-muted">Destination-based prefix assignment</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source Country</th>
                <th>Destination Country</th>
                <th>Prefix Applied</th>
                <th>System Route</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {prefixTable.map((row, i) => (
                <tr key={i}>
                  <td>
                    <span className={`pill pill-${row.source === 'Kenya' ? 'ke' : 'tz'}`}>
                      {row.source === 'Kenya' ? '🇰🇪' : '🇹🇿'} {row.source}
                    </span>
                  </td>
                  <td>
                    <span className={`pill pill-${row.dest === 'Kenya' ? 'ke' : 'tz'}`}>
                      {row.dest === 'Kenya' ? '🇰🇪' : '🇹🇿'} {row.dest}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: 13, fontWeight: 700, background: row.prefix === 'KE' ? 'rgba(0,102,0,0.1)' : 'rgba(30,58,138,0.1)', color: row.prefix === 'KE' ? 'var(--ke-green)' : 'var(--tz-blue)', padding: '2px 8px' }}>
                      {row.prefix}
                    </code>
                  </td>
                  <td className="text-sm text-muted font-mono" style={{ fontSize: 12 }}>{row.system}</td>
                  <td className="text-sm text-muted">{row.dest === row.source ? 'Domestic market' : 'Cross-border export'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Key Benefits</span>
        </div>
        <div className="card-body">
          <div className="grid-2" style={{ gap: 10 }}>
            {[
              'Improved fraud detection by cross-checking production data with import/export declarations',
              'Increased control over export production — reduces risk of "fake exports"',
              'Ability to audit export products in both origin and destination countries',
              'Improved supply chain visibility — products activated and reported during production',
              'Enhanced customer trust — marks applied by licensed producers at source',
              'Facilitates customs clearance processes at borders',
              'Reduces compliance cost — importers no longer need to unpack and restamp products',
              'KRA and TRA receive near real-time data on expected imports and taxes to collect',
            ].map((b, i) => (
              <div key={i} className="flex gap-2 items-start" style={{ padding: '8px 0', borderBottom: i < 6 ? '1px solid var(--border)' : 'none' }}>
                <CheckCircle size={15} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                <span className="text-sm" style={{ lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
