import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Zap } from 'lucide-react';
import { orders, manufacturers, importers } from '../data/mockData';

const QR_PATTERN = [
  1,1,1,1,1,1,1,0,1,0,
  1,0,0,0,0,0,1,0,0,1,
  1,0,1,1,1,0,1,0,1,0,
  1,0,1,1,1,0,1,0,0,1,
  1,0,1,1,1,0,1,0,1,1,
  1,0,0,0,0,0,1,0,0,0,
  1,1,1,1,1,1,1,0,1,0,
  0,0,0,0,0,0,0,0,1,1,
  1,0,1,1,0,1,1,1,0,1,
  0,1,0,0,1,0,0,0,1,0,
];

function QRCode({ prefix, serial }) {
  const pattern = QR_PATTERN.map((c, i) => (c ^ ((serial >> (i % 8)) & 1)) ? 1 : c);
  return (
    <div className="qr-demo">
      <div className="qr-grid">
        {pattern.map((c, i) => (
          <div key={i} className={`qr-cell ${c ? 'dark' : 'light'}`} />
        ))}
      </div>
      <div className="qr-prefix">{prefix} · {String(serial).padStart(8, '0')}</div>
    </div>
  );
}

export default function DirectMarking({ activeCountry, notify }) {
  const producers = manufacturers.filter(m => m.country === activeCountry && m.status === 'active');
  const [selectedProducer, setSelectedProducer] = useState('');
  const [selectedImporter, setSelectedImporter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [running, setRunning] = useState(false);
  const [markedCount, setMarkedCount] = useState(0);
  const [activationLog, setActivationLog] = useState([]);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [sessionComplete, setSessionComplete] = useState(false);
  const intervalRef = useRef(null);
  const logRef = useRef(null);

  const producer = producers.find(m => m.id === selectedProducer);
  const linkedImporterObjs = producer
    ? importers.filter(i => producer.linkedImporters.includes(i.id))
    : [];
  const selectedImporterObj = linkedImporterObjs.find(i => i.id === selectedImporter);
  const availableOrders = orders.filter(
    o => o.producerId === selectedProducer
      && o.importerId === selectedImporter
      && ['synchronised', 'approved', 'marking'].includes(o.status)
  );
  const currentOrder = availableOrders.find(o => o.id === selectedOrder);
  const orderTotal = currentOrder?.quantity || 0;
  const startCount = currentOrder?.markedCount || 0;
  const totalMarked = startCount + markedCount;
  const pct = orderTotal > 0 ? Math.min(100, Math.round((totalMarked / orderTotal) * 100)) : 0;

  function startMarking() {
    if (!selectedOrder) return;
    setRunning(true);
    setSyncStatus('syncing');
    notify('SCL Line activated — marking in progress');
    intervalRef.current = setInterval(() => {
      setMarkedCount(prev => {
        const newCount = prev + Math.floor(Math.random() * 8 + 3);
        const total = startCount + newCount;
        if (total >= orderTotal) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setSyncStatus('synced');
          setSessionComplete(true);
          notify('✓ All codes marked and activated. Synchronized to destination database.');
          return orderTotal - startCount;
        }
        // Add log entry
        const serial = Math.floor(Math.random() * 90000000 + 10000000);
        const prefix = currentOrder?.prefix || 'XX';
        setActivationLog(log => [{
          serial,
          prefix,
          ts: new Date().toLocaleTimeString(),
          status: 'activated',
        }, ...log.slice(0, 19)]);
        return newCount;
      });
    }, 400);
  }

  function pauseMarking() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSyncStatus('paused');
  }

  function resetSession() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setMarkedCount(0);
    setActivationLog([]);
    setSyncStatus('idle');
    setSessionComplete(false);
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [activationLog]);

  return (
    <div className="section-gap">
      <div className="page-header">
        <div className="page-title">Direct Marking — SCL Operator View</div>
        <div className="page-desc">Foreign producer perspective · Apply secure codes on production line</div>
      </div>

      <div className="grid-2">
        {/* Left: Setup */}
        <div className="section-gap" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Production Setup</span>
              <span className={`status-badge ${running ? 'badge-warning' : sessionComplete ? 'badge-success' : 'badge-neutral'}`}>
                {running ? 'Running' : sessionComplete ? 'Complete' : 'Idle'}
              </span>
            </div>
            <div className="card-body section-gap" style={{ gap: 14 }}>
              <div className="form-group">
                <label className="form-label">1. Select SCL Producer ({activeCountry === 'KE' ? '🇰🇪 Kenya' : '🇹🇿 Tanzania'})</label>
                <select className="form-select" value={selectedProducer}
                  onChange={e => { setSelectedProducer(e.target.value); setSelectedImporter(''); setSelectedOrder(''); resetSession(); }}>
                  <option value="">Select producer...</option>
                  {producers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.sclLines} SCL lines)</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">2. Select Importer</label>
                <select className="form-select" value={selectedImporter} disabled={!selectedProducer}
                  onChange={e => { setSelectedImporter(e.target.value); setSelectedOrder(''); resetSession(); }}>
                  <option value="">Select importer...</option>
                  {linkedImporterObjs.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.country})</option>
                  ))}
                </select>
                {selectedProducer && linkedImporterObjs.length === 0 && (
                  <div className="text-xs text-muted mt-2">No importers linked to this producer.</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">3. Select Order</label>
                <select className="form-select" value={selectedOrder} disabled={!selectedImporter}
                  onChange={e => { setSelectedOrder(e.target.value); resetSession(); }}>
                  <option value="">Select order...</option>
                  {availableOrders.map(o => (
                    <option key={o.id} value={o.id}>{o.id} — {o.product} ({o.quantity.toLocaleString()} codes)</option>
                  ))}
                </select>
                {selectedImporter && availableOrders.length === 0 && (
                  <div className="text-xs text-muted mt-2">No synchronized orders available for this importer.</div>
                )}
              </div>
            </div>
          </div>

          {currentOrder && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Order Details</span>
                <code style={{
                  fontSize: 11, padding: '2px 6px',
                  background: currentOrder.prefix === 'KE' ? 'rgba(0,102,0,0.1)' : 'rgba(30,58,138,0.1)',
                  color: currentOrder.prefix === 'KE' ? 'var(--ke-green)' : 'var(--tz-blue)',
                }}>{currentOrder.prefix} prefix</code>
              </div>
              <div className="card-body">
                <div className="grid-2" style={{ gap: 8, marginBottom: 14 }}>
                  {[
                    ['Order ID', currentOrder.id],
                    ['Product', currentOrder.product],
                    ['Total Codes', currentOrder.quantity.toLocaleString()],
                    ['Importer', currentOrder.importerName],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-xs text-muted">{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)' }}>{v}</div>
                    </div>
                  ))}
                </div>

                <div className="marking-progress">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">Progress</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--eac-blue)' }}>{pct}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{
                      width: `${pct}%`,
                      background: pct === 100 ? 'var(--success)' : undefined,
                    }} />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted">{totalMarked.toLocaleString()} marked</span>
                    <span className="text-xs text-muted">{(orderTotal - totalMarked).toLocaleString()} remaining</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  {!running && !sessionComplete && (
                    <button className="btn btn-success flex-1" onClick={startMarking} disabled={!selectedOrder}>
                      <Play size={14} /> Run Production
                    </button>
                  )}
                  {running && (
                    <button className="btn btn-warning flex-1" onClick={pauseMarking}>
                      <Pause size={14} /> Pause
                    </button>
                  )}
                  {(markedCount > 0 || sessionComplete) && (
                    <button className="btn btn-outline" onClick={resetSession}>
                      <RotateCcw size={14} /> Reset
                    </button>
                  )}
                </div>

                {syncStatus !== 'idle' && (
                  <div className="mt-3" style={{
                    padding: 10, borderRadius: 6, fontSize: 13,
                    background: syncStatus === 'synced' ? '#dcfce7' : syncStatus === 'paused' ? '#fef9c3' : 'var(--eac-light)',
                    color: syncStatus === 'synced' ? 'var(--success)' : syncStatus === 'paused' ? 'var(--warning)' : 'var(--eac-blue)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {syncStatus === 'synced' ? <CheckCircle size={14} /> : <Zap size={14} />}
                    {syncStatus === 'syncing' ? `Activating & syncing to ${currentOrder.importerCountry === 'KE' ? 'ETSMS (Kenya)' : 'EGMS (Tanzania)'}...` :
                     syncStatus === 'synced' ? `All codes activated & recorded in destination database` :
                     `Marking paused — ${totalMarked.toLocaleString()} codes synchronized`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live feed */}
        <div className="section-gap" style={{ gap: 14 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <span className="card-title">Live Activation Feed</span>
              <span className={`status-badge ${running ? 'badge-warning' : 'badge-neutral'}`}>
                {running ? '● Live' : 'Stopped'}
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div ref={logRef} style={{ height: 260, overflowY: 'auto', padding: '0 4px' }}>
                {activationLog.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    Start production to see live activation feed
                  </div>
                ) : activationLog.map((entry, i) => (
                  <div key={`${entry.serial}-${i}`} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px',
                    borderBottom: '1px solid var(--border)',
                    background: i === 0 ? 'rgba(29,78,216,0.04)' : 'transparent',
                    animation: i === 0 ? 'slideUp 0.3s ease' : 'none',
                  }}>
                    <CheckCircle size={13} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <code style={{ fontSize: 11, flex: 1 }}>
                      {entry.prefix}-{entry.serial}
                    </code>
                    <span className={`pill pill-${entry.prefix.toLowerCase()}`} style={{ fontSize: 10 }}>
                      {entry.prefix}
                    </span>
                    <span className="text-xs text-muted">{entry.ts}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-xs text-muted">{activationLog.length} codes shown</span>
                <span className="text-xs" style={{ color: 'var(--success)' }}>All activated ✓</span>
              </div>
            </div>
          </div>

          {currentOrder && activationLog.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Sample Code Data</span>
                <span className="text-xs text-muted">Synced to destination DMS</span>
              </div>
              <div className="card-body" style={{ padding: 12 }}>
                <div className="flex gap-4 items-start">
                  <QRCode prefix={currentOrder.prefix} serial={activationLog[0]?.serial || 12345678} />
                  <div className="code-sample" style={{ flex: 1 }}>
                    <div><span className="code-key">"code"</span>: <span className="code-str">"{currentOrder.prefix}-{activationLog[0]?.serial}"</span>,</div>
                    <div><span className="code-key">"prefix"</span>: <span className="code-str">"{currentOrder.prefix}"</span>,</div>
                    <div><span className="code-key">"orderId"</span>: <span className="code-str">"{currentOrder.id}"</span>,</div>
                    <div><span className="code-key">"product"</span>: <span className="code-str">"{currentOrder.product}"</span>,</div>
                    <div><span className="code-key">"producer"</span>: <span className="code-str">"{currentOrder.producerName}"</span>,</div>
                    <div><span className="code-key">"destCountry"</span>: <span className="code-str">"{currentOrder.importerCountry}"</span>,</div>
                    <div><span className="code-key">"activatedAt"</span>: <span className="code-str">"{activationLog[0]?.ts}"</span>,</div>
                    <div><span className="code-key">"status"</span>: <span className="code-val">"ACTIVATED"</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
