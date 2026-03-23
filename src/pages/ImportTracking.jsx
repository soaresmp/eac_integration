import { useState } from 'react';
import { Package, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { orders } from '../data/mockData';

const incomingData = [
  {
    id: 'INC-TZ-2024-0891',
    orderId: 'ORD-TZ-2024-0891',
    product: 'Beer (500ml)',
    producer: 'Kenya Breweries Ltd',
    producerCountry: 'KE',
    prefix: 'TZ',
    expected: 50000,
    activated: 31200,
    borderCleared: 20000,
    marketRelease: 18500,
    status: 'in_transit',
    lastUpdate: '2024-03-16 09:14',
    taxExpected: 1250000,
    taxCollected: 500000,
    currency: 'TZS',
    customs: {
      export: { system: 'iCMS', ref: 'iCMS-EXP-2024-KBL-0891', date: '2024-03-17' },
      import: { system: 'TANCIS', ref: 'TANCIS-IMP-2024-DS-0891', date: null },
    },
  },
  {
    id: 'INC-TZ-2024-0880',
    orderId: 'ORD-TZ-2024-0880',
    product: 'Beer (500ml)',
    producer: 'Kenya Breweries Ltd',
    producerCountry: 'KE',
    prefix: 'TZ',
    expected: 40000,
    activated: 40000,
    borderCleared: 40000,
    marketRelease: 38700,
    status: 'completed',
    lastUpdate: '2024-03-10 11:00',
    taxExpected: 1000000,
    taxCollected: 1000000,
    currency: 'TZS',
    customs: {
      export: { system: 'iCMS', ref: 'iCMS-EXP-2024-KBL-0880', date: '2024-02-08' },
      import: { system: 'TANCIS', ref: 'TANCIS-IMP-2024-DS-0880', date: '2024-02-09' },
    },
  },
  {
    id: 'INC-KE-2024-1045',
    orderId: 'ORD-KE-2024-1045',
    product: 'Beer (330ml)',
    producer: 'Tanzania Breweries Ltd',
    producerCountry: 'TZ',
    prefix: 'KE',
    expected: 80000,
    activated: 80000,
    borderCleared: 80000,
    marketRelease: 79100,
    status: 'completed',
    lastUpdate: '2024-03-08 15:30',
    taxExpected: 3200000,
    taxCollected: 3200000,
    currency: 'KES',
    customs: {
      export: { system: 'TANCIS', ref: 'TANCIS-EXP-2024-TBL-1045', date: '2024-03-02' },
      import: { system: 'iCMS', ref: 'iCMS-IMP-2024-NBI-1045', date: '2024-03-03' },
    },
  },
  {
    id: 'INC-TZ-2024-0892',
    orderId: 'ORD-TZ-2024-0892',
    product: 'Juice (1L)',
    producer: 'Bidco Africa Ltd',
    producerCountry: 'KE',
    prefix: 'TZ',
    expected: 25000,
    activated: 0,
    borderCleared: 0,
    marketRelease: 0,
    status: 'awaiting_marking',
    lastUpdate: '2024-03-16 08:00',
    taxExpected: 875000,
    taxCollected: 0,
    currency: 'TZS',
    customs: {
      export: { system: 'iCMS', ref: null, date: null },
      import: { system: 'TANCIS', ref: null, date: null },
    },
  },
];

const statusMap = {
  completed: { label: 'Cleared', cls: 'badge-success' },
  in_transit: { label: 'In Transit', cls: 'badge-warning' },
  awaiting_marking: { label: 'Awaiting Marking', cls: 'badge-neutral' },
  border_hold: { label: 'Border Hold', cls: 'badge-danger' },
};

function MiniProgress({ value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-muted">{value.toLocaleString()} / {total.toLocaleString()}</span>
        <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="progress-bar-wrap" style={{ height: 6, margin: 0 }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--success)' : color || undefined }} />
      </div>
    </div>
  );
}

export default function ImportTracking({ activeCountry }) {
  const [tab, setTab] = useState('incoming');

  const incoming = incomingData.filter(i => i.prefix === activeCountry);
  const totalExpected = incoming.reduce((s, i) => s + i.expected, 0);
  const totalActivated = incoming.reduce((s, i) => s + i.activated, 0);
  const totalCleared = incoming.reduce((s, i) => s + i.borderCleared, 0);
  const taxExpected = incoming.reduce((s, i) => s + i.taxExpected, 0);
  const taxCollected = incoming.reduce((s, i) => s + i.taxCollected, 0);

  return (
    <div className="section-gap">
      <div className="page-header">
        <div className="page-title">Import Tracking & Revenue Forecasting</div>
        <div className="page-desc">
          {activeCountry === 'KE' ? '🇰🇪 Kenya — KRA' : '🇹🇿 Tanzania — TRA'} · Incoming marked products visibility
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-card-label">Expected Units</div>
          <div className="stat-card-value">{totalExpected.toLocaleString()}</div>
          <div className="stat-card-delta" style={{ color: 'var(--text-muted)' }}>Across {incoming.length} shipments</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Activated at Source</div>
          <div className="stat-card-value" style={{ color: 'var(--eac-blue)' }}>{totalActivated.toLocaleString()}</div>
          <div className="stat-card-delta delta-up">
            <TrendingUp size={11} /> {totalExpected > 0 ? Math.round((totalActivated / totalExpected) * 100) : 0}% of expected
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Border Cleared</div>
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>{totalCleared.toLocaleString()}</div>
          <div className="stat-card-delta delta-up">No restamping required</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Tax Forecasted</div>
          <div className="stat-card-value" style={{ color: 'var(--ke-green)', fontSize: 22 }}>
            {activeCountry === 'KE' ? 'KES' : 'TZS'} {(taxExpected / 1000000).toFixed(1)}M
          </div>
          <div className="stat-card-delta" style={{ color: 'var(--text-muted)' }}>
            {taxExpected > 0 ? Math.round((taxCollected / taxExpected) * 100) : 0}% collected
          </div>
        </div>
      </div>

      {/* Revenue reconciliation */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Revenue Reconciliation</span>
          <span className="status-badge badge-info">Near Real-Time</span>
        </div>
        <div className="card-body">
          <div className="grid-2" style={{ gap: 20 }}>
            <div>
              <div className="text-xs text-muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tax Expected vs Collected ({activeCountry === 'KE' ? 'KES' : 'TZS'})
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-heading)' }}>
                {taxExpected.toLocaleString()}
              </div>
              <div className="progress-bar-wrap" style={{ margin: '8px 0' }}>
                <div className="progress-bar-fill" style={{
                  width: `${taxExpected > 0 ? (taxCollected / taxExpected) * 100 : 0}%`,
                  background: 'var(--success)',
                }} />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-success">{taxCollected.toLocaleString()} collected</span>
                <span className="text-xs text-muted">{(taxExpected - taxCollected).toLocaleString()} pending</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted mb-3" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Shipment Pipeline
              </div>
              {['awaiting_marking', 'in_transit', 'completed'].map(s => {
                const count = incoming.filter(i => i.status === s).length;
                return (
                  <div key={s} className="flex justify-between items-center" style={{ padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                    <span className={`status-badge ${statusMap[s]?.cls || 'badge-neutral'}`}>{statusMap[s]?.label || s}</span>
                    <strong style={{ fontSize: 16 }}>{count}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Incoming register */}
      <div className="card">
        <div className="card-header">
          <span className="card-title"><Package size={16} /> Incoming Imports Register</span>
          <span className="status-badge badge-neutral">{incoming.length} entries</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Source Producer</th>
                <th>Activated at Source</th>
                <th>Border Cleared</th>
                <th>Market Released</th>
                <th>Tax ({activeCountry === 'KE' ? 'KES' : 'TZS'})</th>
                <th>Customs Events</th>
                <th>Border Ready</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {incoming.map(item => {
                const borderReady = item.activated > 0 && item.activated === item.expected;
                const partialReady = item.activated > 0;
                return (
                  <tr key={item.id}>
                    <td className="font-mono text-xs">{item.id}</td>
                    <td className="text-sm">{item.product}</td>
                    <td>
                      <span className={`pill pill-${item.producerCountry.toLowerCase()}`}>
                        {item.producerCountry === 'KE' ? '🇰🇪' : '🇹🇿'} {item.producer}
                      </span>
                    </td>
                    <td style={{ minWidth: 140 }}>
                      <MiniProgress value={item.activated} total={item.expected} color="var(--eac-blue)" />
                    </td>
                    <td style={{ minWidth: 140 }}>
                      <MiniProgress value={item.borderCleared} total={item.expected} color="var(--success)" />
                    </td>
                    <td style={{ minWidth: 140 }}>
                      <MiniProgress value={item.marketRelease} total={item.expected} color="var(--ke-green)" />
                    </td>
                    <td>
                      <div className="text-xs">
                        <div className="text-success">{item.taxCollected.toLocaleString()} ✓</div>
                        <div className="text-muted">{(item.taxExpected - item.taxCollected).toLocaleString()} pending</div>
                      </div>
                    </td>
                    <td style={{ minWidth: 180 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--eac-blue)', textTransform: 'uppercase', minWidth: 52 }}>
                            {item.customs.export.system}
                          </span>
                          {item.customs.export.ref
                            ? <code style={{ fontSize: 10, color: 'var(--eac-blue)' }}>{item.customs.export.ref}</code>
                            : <span className="text-xs text-muted">Export pending</span>
                          }
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: item.customs.import.ref ? 'var(--success)' : 'var(--text-muted)', textTransform: 'uppercase', minWidth: 52 }}>
                            {item.customs.import.system}
                          </span>
                          {item.customs.import.ref
                            ? <code style={{ fontSize: 10, color: 'var(--success)' }}>{item.customs.import.ref}</code>
                            : <span className="text-xs text-muted">Import pending</span>
                          }
                        </div>
                      </div>
                    </td>
                    <td>
                      {borderReady
                        ? <span className="status-badge badge-success"><CheckCircle size={11} /> Ready</span>
                        : partialReady
                        ? <span className="status-badge badge-warning">Partial</span>
                        : <span className="status-badge badge-neutral">Not Ready</span>
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${statusMap[item.status]?.cls || 'badge-neutral'}`}>
                        {statusMap[item.status]?.label || item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(21,128,61,0.04), rgba(29,78,216,0.04))' }}>
        <div className="card-body">
          <div className="flex gap-3 items-start">
            <span style={{ fontSize: 24 }}>💡</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-heading)' }}>
                Elimination of Restamping Cost
              </div>
              <p className="text-sm text-muted" style={{ marginTop: 4, lineHeight: 1.6 }}>
                Under the traditional model, importers had to hold stock, unpack products, apply paper stamps,
                and repack before market release — incurring significant labor and time costs.
                With EAC Integration, all products arrive pre-marked and pre-registered.
                Border inspection time is reduced from hours to minutes, and products can be
                released to market immediately upon customs clearance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
