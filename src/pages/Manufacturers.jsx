import { useState } from 'react';
import { Plus, Building2, CheckCircle, Clock } from 'lucide-react';
import { manufacturers as initialManufacturers, importers } from '../data/mockData';

export default function Manufacturers({ activeCountry, notify }) {
  const [manufacturers, setManufacturers] = useState(initialManufacturers);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', tin: '', country: activeCountry,
    products: '', sclLines: 1, contact: '', exportDestinations: [],
  });

  const filtered = manufacturers.filter(m => m.country === activeCountry);

  function handleSubmit(e) {
    e.preventDefault();
    const newMfg = {
      id: `MFG-${form.country}-${String(Date.now()).slice(-4)}`,
      name: form.name,
      country: form.country,
      tin: form.tin,
      products: form.products.split(',').map(p => p.trim()),
      sclLines: Number(form.sclLines),
      status: 'pending',
      exportDestinations: form.exportDestinations,
      linkedImporters: [],
      registeredDate: new Date().toISOString().slice(0, 10),
      contact: form.contact,
    };
    setManufacturers(prev => [...prev, newMfg]);
    setShowModal(false);
    setForm({ name: '', tin: '', country: activeCountry, products: '', sclLines: 1, contact: '', exportDestinations: [] });
    notify('Manufacturer registered and pending synchronization to partner system');
  }

  function getLinkedImporterNames(ids) {
    return ids.map(id => importers.find(i => i.id === id)?.name || id).join(', ');
  }

  return (
    <div className="section-gap">
      <div className="flex justify-between items-center page-header">
        <div>
          <div className="page-title">Manufacturer Registry</div>
          <div className="page-desc">
            {activeCountry === 'KE' ? '🇰🇪 Kenya — ETSMS' : '🇹🇿 Tanzania — EGMS'} · {filtered.length} registered manufacturers
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Register Manufacturer
        </button>
      </div>

      {/* Stats row */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-card-label">Registered</div>
          <div className="stat-card-value">{filtered.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Active</div>
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>
            {filtered.filter(m => m.status === 'active').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">SCL Lines</div>
          <div className="stat-card-value">
            {filtered.reduce((s, m) => s + m.sclLines, 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <Building2 size={16} />
            {activeCountry === 'KE' ? 'Kenyan' : 'Tanzanian'} Manufacturers
          </span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Manufacturer</th>
                <th>TIN</th>
                <th>Products</th>
                <th>SCL Lines</th>
                <th>Exports To</th>
                <th>Linked Importers</th>
                <th>Registered</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td className="font-mono text-xs">{m.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 13.5 }}>{m.name}</div>
                    <div className="text-xs text-muted">{m.contact}</div>
                  </td>
                  <td className="font-mono text-xs">{m.tin}</td>
                  <td>
                    <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                      {m.products.map(p => (
                        <span key={p} className="pill" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>{p}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{m.sclLines}</td>
                  <td>
                    {m.exportDestinations.map(d => (
                      <span key={d} className={`pill pill-${d.toLowerCase()}`}>{d === 'KE' ? '🇰🇪' : '🇹🇿'} {d}</span>
                    ))}
                  </td>
                  <td className="text-xs text-muted">
                    {m.linkedImporters.length > 0
                      ? getLinkedImporterNames(m.linkedImporters)
                      : <span style={{ color: 'var(--border)' }}>—</span>
                    }
                  </td>
                  <td className="text-xs text-muted">{m.registeredDate}</td>
                  <td>
                    <span className={`status-badge ${m.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {m.status === 'active' ? <><CheckCircle size={11} /> Active</> : <><Clock size={11} /> Pending</>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync info */}
      <div className="card" style={{ borderLeft: '3px solid var(--eac-blue)' }}>
        <div className="card-body">
          <div className="flex gap-3 items-start">
            <span style={{ fontSize: 22 }}>🔄</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 14 }}>Automatic Synchronisation</div>
              <p className="text-sm text-muted" style={{ marginTop: 4, lineHeight: 1.6 }}>
                When a manufacturer is registered and activated in {activeCountry === 'KE' ? 'ETSMS (Kenya)' : 'EGMS (Tanzania)'},
                their details are automatically synchronized to the partner system ({activeCountry === 'KE' ? 'EGMS (Tanzania)' : 'ETSMS (Kenya)'}).
                This enables foreign importers to link to this manufacturer for export ordering.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <span className="card-title"><Building2 size={16} /> Register Manufacturer</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body section-gap" style={{ gap: 14 }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input className="form-input" required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Acme Beverages Ltd" />
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
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tax Identification Number *</label>
                    <input className="form-input" required value={form.tin}
                      onChange={e => setForm(f => ({ ...f, tin: e.target.value }))}
                      placeholder={`${form.country}-TIN-xxxxxxx`} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SCL Lines</label>
                    <input className="form-input" type="number" min="1" max="10"
                      value={form.sclLines}
                      onChange={e => setForm(f => ({ ...f, sclLines: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Products (comma-separated) *</label>
                  <input className="form-input" required value={form.products}
                    onChange={e => setForm(f => ({ ...f, products: e.target.value }))}
                    placeholder="Beer, Juices, Water" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input className="form-input" type="email" value={form.contact}
                    onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    placeholder="excise@company.co.ke" />
                </div>
                <div className="form-group">
                  <label className="form-label">Export Destinations</label>
                  <div className="flex gap-3">
                    {['KE', 'TZ'].map(c => (
                      <label key={c} className="flex gap-2 items-center" style={{ cursor: 'pointer' }}>
                        <input type="checkbox" value={c}
                          checked={form.exportDestinations.includes(c)}
                          onChange={e => setForm(f => ({
                            ...f,
                            exportDestinations: e.target.checked
                              ? [...f.exportDestinations, c]
                              : f.exportDestinations.filter(x => x !== c)
                          }))} />
                        <span className={`pill pill-${c.toLowerCase()}`}>{c === 'KE' ? '🇰🇪' : '🇹🇿'} {c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Register & Sync</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
