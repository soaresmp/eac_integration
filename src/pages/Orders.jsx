import { useState } from 'react';
import { Plus, ShoppingCart, ArrowRight, CheckCircle, Clock, Loader, XCircle } from 'lucide-react';
import { orders as initialOrders, manufacturers, importers } from '../data/mockData';

const statusFlow = ['pending', 'approved', 'codes_generated', 'synchronised', 'marking', 'completed'];
const statusLabels = {
  pending: 'Submitted',
  approved: 'Approved',
  codes_generated: 'Codes Generated',
  synchronised: 'Synchronised',
  marking: 'Marks Applied',
  completed: 'Exported',
};
const statusBadge = {
  pending: 'badge-warning',
  approved: 'badge-info',
  codes_generated: 'badge-info',
  synchronised: 'badge-info',
  marking: 'badge-warning',
  completed: 'badge-success',
};

function OrderTimeline({ order }) {
  const steps = [
    { key: 'pending', label: 'Submitted', detail: `By ${order.importerName}`, date: order.orderDate },
    { key: 'approved', label: 'Approved', detail: `${order.importerCountry === 'KE' ? 'KRA' : 'TRA'} approval`, date: order.approvedDate },
    { key: 'codes_generated', label: 'Codes Generated', detail: `${order.quantity.toLocaleString()} codes`, date: order.approvedDate },
    { key: 'synchronised', label: 'Synchronised', detail: `Codes pushed to ${order.producerCountry === 'KE' ? 'ETSMS' : 'EGMS'}`, date: order.paymentDate },
    { key: 'marking', label: 'Marks Applied', detail: `${order.markedCount.toLocaleString()} / ${order.quantity.toLocaleString()} codes`, date: order.markedCount > 0 ? 'In progress' : null },
    { key: 'completed', label: 'Exported', detail: 'Products dispatched', date: order.status === 'completed' ? order.paymentDate : null },
  ];

  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <div style={{ padding: '16px 0' }}>
      {steps.map((step, i) => {
        const isDone = i <= currentIdx;
        const isActive = i === currentIdx;
        return (
          <div key={step.key} className="flex gap-3 items-start" style={{ marginBottom: i < steps.length - 1 ? 0 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: isDone ? (isActive ? 'var(--eac-blue)' : 'var(--success)') : 'var(--bg)',
                border: `2px solid ${isDone ? (isActive ? 'var(--eac-blue)' : 'var(--success)') : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: isDone ? '#fff' : 'var(--text-muted)',
              }}>
                {isDone && !isActive ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, height: 28, background: i < currentIdx ? 'var(--success)' : 'var(--border)', marginTop: 2 }} />
              )}
            </div>
            <div style={{ paddingTop: 4, paddingBottom: 12, flex: 1 }}>
              <div style={{ fontWeight: isActive ? 600 : 500, fontSize: 13, color: isDone ? 'var(--text-heading)' : 'var(--text-muted)' }}>
                {step.label}
              </div>
              <div className="text-xs text-muted">{step.detail}</div>
              {step.date && <div className="text-xs" style={{ color: 'var(--success)', marginTop: 2 }}>{step.date}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Orders({ activeCountry, notify }) {
  const [orders, setOrders] = useState(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState({
    importerId: '',
    producerId: '',
    product: '',
    quantity: '',
    marksType: 'direct',
  });

  const countryOrders = orders.filter(
    o => o.importerCountry === activeCountry || o.producerCountry === activeCountry
  );

  const myImporters = importers.filter(i => i.country === activeCountry);
  const selectedImporter = myImporters.find(i => i.id === form.importerId);
  const availableProducers = selectedImporter
    ? manufacturers.filter(m => selectedImporter.linkedProducers.includes(m.id))
    : [];

  function handleApprove(orderId) {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'approved', approvedDate: new Date().toISOString().slice(0, 10) } : o
    ));
    notify('Order approved. Awaiting payment confirmation.');
  }

  function handlePayment(orderId) {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'codes_generated', paymentDate: new Date().toISOString().slice(0, 10) } : o
    ));
    notify('Payment confirmed. Codes generated and synchronizing to producer system.');
    setTimeout(() => {
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: 'synchronised' } : o
      ));
      notify('✓ Codes synchronized to foreign producer SCL system.');
    }, 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const imp = importers.find(i => i.id === form.importerId);
    const prod = manufacturers.find(m => m.id === form.producerId);
    if (!imp || !prod) return;
    const destCountry = imp.country;
    const prefix = destCountry;
    const newOrder = {
      id: `ORD-${destCountry}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      importerId: imp.id,
      importerName: imp.name,
      importerCountry: imp.country,
      producerId: prod.id,
      producerName: prod.name,
      producerCountry: prod.country,
      product: form.product,
      quantity: Number(form.quantity),
      marksType: form.marksType,
      prefix,
      status: 'pending',
      orderDate: new Date().toISOString().slice(0, 10),
      approvedDate: null,
      paymentDate: null,
      markedCount: 0,
      taxAmount: Math.floor(Number(form.quantity) * 25),
      currency: imp.country === 'KE' ? 'KES' : 'TZS',
    };
    setOrders(prev => [...prev, newOrder]);
    setShowModal(false);
    setForm({ importerId: '', producerId: '', product: '', quantity: '', marksType: 'direct' });
    notify(`Order ${newOrder.id} placed. Pending ${destCountry === 'KE' ? 'KRA' : 'TRA'} approval.`);
  }

  return (
    <div className="section-gap">
      <div className="flex justify-between items-center page-header">
        <div>
          <div className="page-title">Order Management</div>
          <div className="page-desc">Manage secure mark orders — direct marking and sticker requests</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Place New Order
        </button>
      </div>

      {/* KPIs */}
      <div className="grid-4">
        {['pending', 'approved', 'marking', 'completed'].map(s => (
          <div key={s} className="stat-card">
            <div className="stat-card-label">{statusLabels[s] || s}</div>
            <div className="stat-card-value">{countryOrders.filter(o => o.status === s).length}</div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title"><ShoppingCart size={16} /> All Orders</span>
          <span className="status-badge badge-neutral">{countryOrders.length} orders</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Importer</th>
                <th>Producer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Prefix</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countryOrders.map(o => (
                <tr key={o.id}>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ fontFamily: 'monospace', fontSize: 12 }}
                      onClick={() => setSelectedOrder(o)}>
                      {o.id}
                    </button>
                  </td>
                  <td>
                    <div>
                      <span className={`pill pill-${o.importerCountry.toLowerCase()}`}>{o.importerName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`pill pill-${o.producerCountry.toLowerCase()}`}>{o.producerName}</span>
                  </td>
                  <td className="text-sm">{o.product}</td>
                  <td className="text-sm font-bold">{o.quantity.toLocaleString()}</td>
                  <td>
                    <code style={{
                      fontSize: 12, fontWeight: 700, padding: '2px 7px',
                      background: o.prefix === 'KE' ? 'rgba(0,102,0,0.1)' : 'rgba(30,58,138,0.1)',
                      color: o.prefix === 'KE' ? 'var(--ke-green)' : 'var(--tz-blue)',
                    }}>{o.prefix}</code>
                  </td>
                  <td>
                    <span className={`status-badge ${o.marksType === 'direct' ? 'badge-info' : 'badge-neutral'}`}>
                      {o.marksType === 'direct' ? 'Direct Mark' : 'Sticker'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${statusBadge[o.status] || 'badge-neutral'}`}>
                      {statusLabels[o.status] || o.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {o.status === 'pending' && o.importerCountry === activeCountry && (
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(o.id)}>
                          Approve
                        </button>
                      )}
                      {o.status === 'approved' && o.importerCountry === activeCountry && (
                        <button className="btn btn-warning btn-sm" onClick={() => handlePayment(o.id)}>
                          Confirm Payment
                        </button>
                      )}
                      {!['pending', 'approved'].includes(o.status) && (
                        <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(o)}>
                          View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelectedOrder(null); }}>
          <div className="modal-box" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <span className="card-title">Order Details — {selectedOrder.id}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
                <div>
                  <div className="text-xs text-muted mb-1">Importer</div>
                  <span className={`pill pill-${selectedOrder.importerCountry.toLowerCase()}`}>
                    {selectedOrder.importerCountry === 'KE' ? '🇰🇪' : '🇹🇿'} {selectedOrder.importerName}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Producer</div>
                  <span className={`pill pill-${selectedOrder.producerCountry.toLowerCase()}`}>
                    {selectedOrder.producerCountry === 'KE' ? '🇰🇪' : '🇹🇿'} {selectedOrder.producerName}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Product</div>
                  <strong className="text-sm">{selectedOrder.product}</strong>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Quantity</div>
                  <strong className="text-sm">{selectedOrder.quantity.toLocaleString()} codes</strong>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Prefix</div>
                  <code style={{
                    fontSize: 13, fontWeight: 700, padding: '2px 8px',
                    background: selectedOrder.prefix === 'KE' ? 'rgba(0,102,0,0.1)' : 'rgba(30,58,138,0.1)',
                    color: selectedOrder.prefix === 'KE' ? 'var(--ke-green)' : 'var(--tz-blue)',
                  }}>{selectedOrder.prefix}</code>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Excise Tax</div>
                  <strong className="text-sm">{selectedOrder.currency} {selectedOrder.taxAmount.toLocaleString()}</strong>
                </div>
              </div>
              <div className="divider" />
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Order Progress</div>
              <OrderTimeline order={selectedOrder} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* New order modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <span className="card-title"><ShoppingCart size={16} /> Place New Order</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body section-gap" style={{ gap: 14 }}>
                <div style={{ padding: 10, background: 'var(--eac-light)', borderRadius: 6, fontSize: 13, color: 'var(--eac-blue)' }}>
                  Placing order as <strong>{activeCountry === 'KE' ? 'Kenyan' : 'Tanzanian'} importer</strong>.
                  Select a linked foreign producer to enable secure direct marking.
                </div>
                <div className="form-group">
                  <label className="form-label">Importer *</label>
                  <select className="form-select" required value={form.importerId}
                    onChange={e => setForm(f => ({ ...f, importerId: e.target.value, producerId: '' }))}>
                    <option value="">Select importer...</option>
                    {myImporters.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mark Type *</label>
                  <div className="flex gap-3">
                    {[
                      { val: 'direct', label: 'Secure Direct Mark', desc: 'Applied at foreign producer SCL line (new)' },
                      { val: 'sticker', label: 'Secure Sticker', desc: 'Traditional paper-based stamp (existing)' },
                    ].map(opt => (
                      <label key={opt.val} style={{
                        flex: 1, cursor: 'pointer', padding: 12, border: '2px solid',
                        borderColor: form.marksType === opt.val ? 'var(--eac-blue)' : 'var(--border)',
                        borderRadius: 8,
                        background: form.marksType === opt.val ? 'var(--eac-light)' : 'var(--bg)',
                      }}>
                        <input type="radio" value={opt.val} checked={form.marksType === opt.val}
                          onChange={e => setForm(f => ({ ...f, marksType: e.target.value }))}
                          style={{ marginRight: 6 }} />
                        <strong style={{ fontSize: 12 }}>{opt.label}</strong>
                        <div className="text-xs text-muted" style={{ marginTop: 3 }}>{opt.desc}</div>
                      </label>
                    ))}
                  </div>
                </div>
                {form.marksType === 'direct' && (
                  <div className="form-group">
                    <label className="form-label">Foreign Producer *</label>
                    <select className="form-select" required value={form.producerId}
                      onChange={e => setForm(f => ({ ...f, producerId: e.target.value }))}>
                      <option value="">Select producer...</option>
                      {availableProducers.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.country})</option>
                      ))}
                    </select>
                    {form.importerId && availableProducers.length === 0 && (
                      <div className="text-xs text-muted mt-2">No producers linked to this importer yet.</div>
                    )}
                  </div>
                )}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Product *</label>
                    <input className="form-input" required value={form.product}
                      onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                      placeholder="e.g. Beer (500ml)" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity (units) *</label>
                    <input className="form-input" type="number" required min="100" value={form.quantity}
                      onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                      placeholder="e.g. 50000" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
