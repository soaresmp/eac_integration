import { useState } from 'react';
import { Plus, Users, Link } from 'lucide-react';
import { importers as initialImporters, manufacturers } from '../data/mockData';

export default function Importers({ activeCountry, notify }) {
  const [importers, setImporters] = useState(initialImporters);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', tin: '', country: activeCountry, linkedProducers: [],
  });

  const filtered = importers.filter(i => i.country === activeCountry);
  const foreignMfgs = manufacturers.filter(m => m.country !== activeCountry && m.status === 'active');

  function handleSubmit(e) {
    e.preventDefault();
    const newImp = {
      id: `IMP-${form.country}-${String(Date.now()).slice(-4)}`,
      name: form.name,
      country: form.country,
      tin: form.tin,
      linkedProducers: form.linkedProducers,
      status: 'active',
      registeredDate: new Date().toISOString().slice(0, 10),
    };
    setImporters(prev => [...prev, newImp]);
    setShowModal(false);
    setForm({ name: '', tin: '', country: activeCountry, linkedProducers: [] });
    notify('Importer registered. Producer delegation configured.');
  }

  return (
    <div className="section-gap">
      <div className="flex justify-between items-center page-header">
        <div>
          <div className="page-title">Importer Registry</div>
          <div className="page-desc">
            {activeCountry === 'KE' ? '🇰🇪 Kenya — KRA' : '🇹🇿 Tanzania — TRA'} · {filtered.length} registered importers
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Register Importer
        </button>
      </div>

      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-card-label">Registered</div>
          <div className="stat-card-value">{filtered.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">With Direct Marking</div>
          <div className="stat-card-value" style={{ color: 'var(--eac-blue)' }}>
            {filtered.filter(i => i.linkedProducers.length > 0).length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Foreign Producers Linked</div>
          <div className="stat-card-value">
            {filtered.reduce((s, i) => s + i.linkedProducers.length, 0)}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><Users size={16} /> Importers</span>
          <span className="text-xs text-muted">Delegated direct marking enabled</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Importer Name</th>
                <th>TIN</th>
                <th>Linked Foreign Producers</th>
                <th>Mark Delegation</th>
                <th>Registered</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(imp => {
                const linked = imp.linkedProducers.map(pid => manufacturers.find(m => m.id === pid));
                return (
                  <tr key={imp.id}>
                    <td className="font-mono text-xs">{imp.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 13.5 }}>{imp.name}</div>
                    </td>
                    <td className="font-mono text-xs">{imp.tin}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        {linked.map(m => m && (
                          <div key={m.id} className="flex gap-2 items-center">
                            <span className={`pill pill-${m.country.toLowerCase()}`}>
                              {m.country === 'KE' ? '🇰🇪' : '🇹🇿'} {m.name}
                            </span>
                          </div>
                        ))}
                        {linked.length === 0 && <span className="text-xs text-muted">None</span>}
                      </div>
                    </td>
                    <td>
                      {imp.linkedProducers.length > 0
                        ? <span className="status-badge badge-success"><Link size={11} /> Enabled</span>
                        : <span className="status-badge badge-neutral">Sticker only</span>
                      }
                    </td>
                    <td className="text-xs text-muted">{imp.registeredDate}</td>
                    <td><span className="status-badge badge-success">Active</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--success)' }}>
        <div className="card-body">
          <div className="flex gap-3 items-start">
            <span style={{ fontSize: 22 }}>🔗</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 14 }}>Producer Delegation</div>
              <p className="text-sm text-muted" style={{ marginTop: 4, lineHeight: 1.6 }}>
                An importer in {activeCountry === 'KE' ? 'Kenya' : 'Tanzania'} can delegate secure direct marking to a specific
                foreign producer. When an order is placed and approved, the linked producer can mark products
                on behalf of the importer using codes specifically allocated to that order.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <span className="card-title"><Users size={16} /> Register Importer</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body section-gap" style={{ gap: 14 }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input className="form-input" required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Nairobi Imports Ltd" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <select className="form-select" value={form.country}
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                      <option value="KE">🇰🇪 Kenya</option>
                      <option value="TZ">🇹🇿 Tanzania</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tax Identification Number *</label>
                  <input className="form-input" required value={form.tin}
                    onChange={e => setForm(f => ({ ...f, tin: e.target.value }))}
                    placeholder={`${form.country}-TIN-xxxxxxx`} />
                </div>
                <div className="form-group">
                  <label className="form-label">Link Foreign Producers (for Direct Marking)</label>
                  <div className="section-gap" style={{ gap: 8 }}>
                    {foreignMfgs.map(m => (
                      <label key={m.id} className="flex gap-3 items-center" style={{
                        cursor: 'pointer', padding: 10,
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        background: form.linkedProducers.includes(m.id) ? 'var(--eac-light)' : 'var(--bg)',
                      }}>
                        <input type="checkbox" value={m.id}
                          checked={form.linkedProducers.includes(m.id)}
                          onChange={e => setForm(f => ({
                            ...f,
                            linkedProducers: e.target.checked
                              ? [...f.linkedProducers, m.id]
                              : f.linkedProducers.filter(x => x !== m.id)
                          }))} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                          <div className="text-xs text-muted">{m.id} · {m.products.join(', ')}</div>
                        </div>
                        <span className={`pill pill-${m.country.toLowerCase()}`} style={{ marginLeft: 'auto' }}>
                          {m.country === 'KE' ? '🇰🇪' : '🇹🇿'} {m.country}
                        </span>
                      </label>
                    ))}
                    {foreignMfgs.length === 0 && (
                      <div className="text-sm text-muted" style={{ padding: 10 }}>No active foreign manufacturers registered yet.</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Register Importer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
