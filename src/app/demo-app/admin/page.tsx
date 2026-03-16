'use client';
import { useState, useMemo } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, BackToVassweb, useTheme } from '@/components/DemoTheme';

const font = 'Inter, system-ui, sans-serif';

type View = 'dashboard' | 'products' | 'orders' | 'stock';
type Category = 'Vse' | 'Damske' | 'Panske' | 'Doplnky';
type OrderStatus = 'Vse' | 'Nova' | 'Spracovana' | 'Odoslana' | 'Dorucena';

interface Product {
  id: number; name: string; price: number; stock: number; category: string; status: string; desc: string;
}
interface OrderItem { name: string; qty: number; price: number; }
interface Order {
  id: string; customer: string; email: string; items: OrderItem[]; total: number; status: string; date: string;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Saténové maxi šaty', price: 129, stock: 8, category: 'Damske', status: 'Aktívny', desc: 'Elegantné saténové šaty na spoločenské udalosti.' },
  { id: 2, name: 'Kožená bunda Classic', price: 199, stock: 3, category: 'Panske', status: 'Aktívny', desc: 'Pravá kožená bunda v nadčasovom štýle.' },
  { id: 3, name: 'Kabelka Milano', price: 89, stock: 22, category: 'Doplnky', status: 'Aktívny', desc: 'Talianska kožená kabelka strednej veľkosti.' },
  { id: 4, name: 'Bavlnené tričko Basic', price: 19, stock: 45, category: 'Panske', status: 'Aktívny', desc: 'Pohodlné bavlnené tričko v rôznych farbách.' },
  { id: 5, name: 'Plisovaná sukňa', price: 59, stock: 15, category: 'Damske', status: 'Aktívny', desc: 'Ľahká plisovaná sukňa po kolená.' },
  { id: 6, name: 'Slnečné okuliare Retro', price: 49, stock: 30, category: 'Doplnky', status: 'Aktívny', desc: 'Retro štýlové okuliare s UV ochranou.' },
  { id: 7, name: 'Slim Fit oblek', price: 189, stock: 4, category: 'Panske', status: 'Aktívny', desc: 'Moderný oblek slim fit strihu.' },
  { id: 8, name: 'Šifónová blúzka', price: 45, stock: 18, category: 'Damske', status: 'Aktívny', desc: 'Vzdušná šifónová blúzka s volánikmi.' },
  { id: 9, name: 'Kožený opasok Premium', price: 39, stock: 2, category: 'Doplnky', status: 'Nízky sklad', desc: 'Ručne šitý kožený opasok.' },
  { id: 10, name: 'Ľanové nohavice', price: 69, stock: 12, category: 'Panske', status: 'Aktívny', desc: 'Letné ľanové nohavice voľného strihu.' },
  { id: 11, name: 'Koktejlové šaty Noir', price: 149, stock: 6, category: 'Damske', status: 'Aktívny', desc: 'Čierne koktejlové šaty s čipkou.' },
  { id: 12, name: 'Hodvábna šatka', price: 35, stock: 1, category: 'Doplnky', status: 'Nízky sklad', desc: 'Ručne maľovaná hodvábna šatka.' },
];

const initialOrders: Order[] = [
  { id: 'OBJ-1024', customer: 'Mária Kováčová', email: 'maria@email.sk', items: [{ name: 'Saténové maxi šaty', qty: 1, price: 129 }, { name: 'Kabelka Milano', qty: 1, price: 89 }], total: 218, status: 'Nova', date: '16.03.2026' },
  { id: 'OBJ-1023', customer: 'Peter Novák', email: 'peter@email.sk', items: [{ name: 'Kožená bunda Classic', qty: 1, price: 199 }], total: 199, status: 'Spracovana', date: '15.03.2026' },
  { id: 'OBJ-1022', customer: 'Jana Horváthová', email: 'jana@email.sk', items: [{ name: 'Plisovaná sukňa', qty: 1, price: 59 }, { name: 'Šifónová blúzka', qty: 2, price: 90 }], total: 149, status: 'Odoslana', date: '15.03.2026' },
  { id: 'OBJ-1021', customer: 'Tomáš Balog', email: 'tomas@email.sk', items: [{ name: 'Slim Fit oblek', qty: 1, price: 189 }, { name: 'Kožený opasok Premium', qty: 1, price: 39 }], total: 228, status: 'Dorucena', date: '14.03.2026' },
  { id: 'OBJ-1020', customer: 'Eva Szabová', email: 'eva@email.sk', items: [{ name: 'Koktejlové šaty Noir', qty: 1, price: 149 }], total: 149, status: 'Nova', date: '14.03.2026' },
  { id: 'OBJ-1019', customer: 'Lukáš Tóth', email: 'lukas@email.sk', items: [{ name: 'Bavlnené tričko Basic', qty: 3, price: 57 }, { name: 'Ľanové nohavice', qty: 1, price: 69 }], total: 126, status: 'Spracovana', date: '13.03.2026' },
  { id: 'OBJ-1018', customer: 'Zuzana Molnárová', email: 'zuzana@email.sk', items: [{ name: 'Hodvábna šatka', qty: 2, price: 70 }, { name: 'Slnečné okuliare Retro', qty: 1, price: 49 }], total: 119, status: 'Odoslana', date: '13.03.2026' },
  { id: 'OBJ-1017', customer: 'Martin Varga', email: 'martin@email.sk', items: [{ name: 'Kožená bunda Classic', qty: 1, price: 199 }, { name: 'Bavlnené tričko Basic', qty: 2, price: 38 }], total: 237, status: 'Dorucena', date: '12.03.2026' },
  { id: 'OBJ-1016', customer: 'Lenka Krajčová', email: 'lenka@email.sk', items: [{ name: 'Saténové maxi šaty', qty: 1, price: 129 }], total: 129, status: 'Nova', date: '12.03.2026' },
  { id: 'OBJ-1015', customer: 'Andrej Kučera', email: 'andrej@email.sk', items: [{ name: 'Slnečné okuliare Retro', qty: 1, price: 49 }, { name: 'Kožený opasok Premium', qty: 1, price: 39 }], total: 88, status: 'Dorucena', date: '11.03.2026' },
];

const weekSales = [
  { day: 'Po', val: 1420 }, { day: 'Ut', val: 980 }, { day: 'St', val: 1890 },
  { day: 'Št', val: 1560 }, { day: 'Pi', val: 2340 }, { day: 'So', val: 1750 }, { day: 'Ne', val: 890 },
];

const navItems: { key: View; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { key: 'products', label: 'Produkty', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { key: 'orders', label: 'Objednávky', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { key: 'stock', label: 'Sklad', icon: 'M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7c0-2 1-3 3-3h10c2 0 3 1 3 3M4 7h16M8 11h2m4 0h2M8 15h2m4 0h2' },
];

function statusColor(status: string) {
  switch (status) { case 'Nova': return '#3b82f6'; case 'Spracovana': return '#f59e0b'; case 'Odoslana': return '#8b5cf6'; case 'Dorucena': return '#10b981'; default: return '#6b7280'; }
}
function statusLabel(s: string) {
  switch (s) { case 'Nova': return 'Nová'; case 'Spracovana': return 'Spracovaná'; case 'Odoslana': return 'Odoslaná'; case 'Dorucena': return 'Doručená'; default: return s; }
}
function stockColor(n: number) { return n > 20 ? '#10b981' : n >= 5 ? '#f59e0b' : '#ef4444'; }

function AdminContent() {
  const { t } = useTheme();
  const [view, setView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<Category>('Vse');
  const [orderFilter, setOrderFilter] = useState<OrderStatus>('Vse');
  const [gridView, setGridView] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredProducts = useMemo(() => {
    let p = products;
    if (catFilter !== 'Vse') p = p.filter(x => x.category === catFilter);
    if (search) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
    return p;
  }, [products, catFilter, search]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'Vse') return orders;
    return orders.filter(o => o.status === orderFilter);
  }, [orders, orderFilter]);

  const lowStockProducts = useMemo(() => [...products].filter(p => p.stock < 5).sort((a, b) => a.stock - b.stock), [products]);
  const sortedStock = useMemo(() => [...products].sort((a, b) => a.stock - b.stock), [products]);

  const btn = (active: boolean) => ({
    padding: '8px 16px', fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer',
    background: active ? `${t.accent}22` : 'transparent', color: active ? t.accent : t.textMuted,
    border: `1px solid ${active ? t.accent : t.border}`, borderRadius: 8, transition: 'all 0.2s',
    fontFamily: font,
  } as const);

  const card = {
    background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24,
  } as const;

  const maxSales = Math.max(...weekSales.map(s => s.val));

  function handleSaveProduct(p: Product) {
    setProducts(prev => { const idx = prev.findIndex(x => x.id === p.id); if (idx >= 0) { const n = [...prev]; n[idx] = p; return n; } return [...prev, p]; });
    setEditProduct(null); setShowNewProduct(false);
  }

  function handleRestockItem(id: number) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock + 50 } : p));
  }

  // ---- Modal component ----
  const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 20, padding: 32, maxWidth: 520, width: '90%', maxHeight: '80vh', overflowY: 'auto', animation: 'adminFadeIn 0.25s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: t.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: t.textMuted, fontSize: 22, cursor: 'pointer', padding: 4 }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: 14, borderRadius: 10,
    background: t.bg, color: t.text, border: `1px solid ${t.border}`, fontFamily: font,
    outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14,
  };

  // ---- Product Edit Modal ----
  function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
    const isNew = !product;
    const [form, setForm] = useState<Product>(product || { id: Date.now(), name: '', price: 0, stock: 0, category: 'Damske', status: 'Aktívny', desc: '' });
    return (
      <Modal title={isNew ? 'Pridať produkt' : 'Upraviť produkt'} onClose={onClose}>
        <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>Názov</label>
        <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>Cena (&euro;)</label>
            <input style={inputStyle} type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>Sklad (ks)</label>
            <input style={inputStyle} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} />
          </div>
        </div>
        <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>Kategória</label>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="Damske">Dámske</option><option value="Panske">Pánske</option><option value="Doplnky">Doplnky</option>
        </select>
        <label style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>Popis</label>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
        <button onClick={() => handleSaveProduct(form)} style={{ width: '100%', padding: '12px', fontSize: 14, fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, color: t.isLight ? '#fff' : '#000', fontFamily: font, marginTop: 8 }}>
          {isNew ? 'Pridať' : 'Uložiť zmeny'}
        </button>
      </Modal>
    );
  }

  // ---- Order Detail Modal ----
  function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
    return (
      <Modal title={`Objednávka ${order.id}`} onClose={onClose}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 4 }}>Zákazník</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>{order.customer}</div>
          <div style={{ fontSize: 13, color: t.textMuted }}>{order.email}</div>
        </div>
        <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 8 }}>Položky</div>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${t.border}`, fontSize: 14 }}>
            <span style={{ color: t.text }}>{item.name} x{item.qty}</span>
            <span style={{ color: t.accent, fontWeight: 600 }}>{item.price}&euro;</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 16, fontWeight: 700, color: t.text }}>
          <span>Celkom</span><span style={{ color: t.accent }}>{order.total}&euro;</span>
        </div>
        <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 8, marginTop: 12 }}>Stav</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['Nova', 'Spracovana', 'Odoslana', 'Dorucena'] as const).map(s => (
            <span key={s} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: order.status === s ? `${statusColor(s)}22` : `${t.border}`, color: order.status === s ? statusColor(s) : t.textMuted, border: `1px solid ${order.status === s ? statusColor(s) : t.border}` }}>
              {statusLabel(s)}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 13, color: t.textMuted, marginTop: 16 }}>Dátum: {order.date}</div>
      </Modal>
    );
  }

  // ---- VIEWS ----
  const DashboardView = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[{ label: 'Objednávky dnes', val: '23', color: '#3b82f6' }, { label: 'Tržby dnes', val: '1 890\u20AC', color: '#10b981' }, { label: 'Produkty', val: '156', color: '#a855f7' }, { label: 'Nízky sklad', val: '7', color: '#ef4444' }].map((s, i) => (
          <div key={i} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>
      {/* Bar chart */}
      <div style={{ ...card, marginBottom: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: '0 0 20px' }}>Týždenné tržby</h3>
        <svg viewBox="0 0 420 160" style={{ width: '100%', maxHeight: 200 }}>
          <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.accent} /><stop offset="100%" stopColor={`${t.accent}44`} /></linearGradient></defs>
          {weekSales.map((s, i) => {
            const bh = (s.val / maxSales) * 120;
            const x = i * 58 + 16;
            return (
              <g key={i}>
                <rect x={x} y={130 - bh} width={36} height={bh} rx={6} fill="url(#barGrad)" opacity={0.9} />
                <text x={x + 18} y={148} textAnchor="middle" fill={t.textMuted} fontSize="11" fontFamily={font}>{s.day}</text>
                <text x={x + 18} y={125 - bh} textAnchor="middle" fill={t.accent} fontSize="10" fontWeight="600" fontFamily={font}>{s.val}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Recent orders */}
        <div style={card}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: '0 0 16px' }}>Posledné objednávky</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ color: t.textMuted, textAlign: 'left' }}><th style={{ padding: '8px 6px', fontWeight: 600 }}>#</th><th style={{ padding: '8px 6px', fontWeight: 600 }}>Zákazník</th><th style={{ padding: '8px 6px', fontWeight: 600 }}>Suma</th><th style={{ padding: '8px 6px', fontWeight: 600 }}>Stav</th></tr></thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={{ padding: '10px 6px', color: t.accent, fontWeight: 600 }}>{o.id}</td>
                  <td style={{ padding: '10px 6px', color: t.text }}>{o.customer}</td>
                  <td style={{ padding: '10px 6px', color: t.text, fontWeight: 600 }}>{o.total}&euro;</td>
                  <td style={{ padding: '10px 6px' }}><span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${statusColor(o.status)}22`, color: statusColor(o.status) }}>{statusLabel(o.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Top selling */}
        <div style={card}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: '0 0 16px' }}>Top produkty</h3>
          {[{ name: 'Saténové maxi šaty', count: 34 }, { name: 'Kožená bunda Classic', count: 28 }, { name: 'Bavlnené tričko Basic', count: 45 }].map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: `${t.accent}18`, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>#{i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{p.name}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.accent }}>{p.count} ks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductsView = () => (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <input placeholder="Hľadať produkt..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 260, marginBottom: 0 }} />
        {(['Vse', 'Damske', 'Panske', 'Doplnky'] as Category[]).map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={btn(catFilter === c)}>{c === 'Vse' ? 'Všetky' : c === 'Damske' ? 'Dámske' : c === 'Panske' ? 'Pánske' : 'Doplnky'}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button onClick={() => setGridView(true)} style={{ ...btn(gridView), padding: '8px 10px' }} title="Mriežka">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke={gridView ? t.accent : t.textMuted} strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke={gridView ? t.accent : t.textMuted} strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke={gridView ? t.accent : t.textMuted} strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke={gridView ? t.accent : t.textMuted} strokeWidth="1.5"/></svg>
          </button>
          <button onClick={() => setGridView(false)} style={{ ...btn(!gridView), padding: '8px 10px' }} title="Zoznam">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="1" y1="3" x2="15" y2="3" stroke={!gridView ? t.accent : t.textMuted} strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="8" x2="15" y2="8" stroke={!gridView ? t.accent : t.textMuted} strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="13" x2="15" y2="13" stroke={!gridView ? t.accent : t.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <button onClick={() => { setShowNewProduct(true); }} style={{ ...btn(false), background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, color: t.isLight ? '#fff' : '#000', border: 'none', fontWeight: 700 }}>+ Pridať produkt</button>
        </div>
      </div>
      {gridView ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => setEditProduct(p)} style={{ ...card, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
              <div style={{ height: 100, borderRadius: 10, marginBottom: 12, background: `linear-gradient(135deg, ${t.accent}15, ${t.accent}05)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, marginBottom: 4 }}>{p.category === 'Damske' ? 'Dámske' : p.category === 'Panske' ? 'Pánske' : 'Doplnky'}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 6 }}>{p.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: t.accent }}>{p.price}&euro;</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: stockColor(p.stock), background: `${stockColor(p.stock)}18`, padding: '3px 8px', borderRadius: 6 }}>{p.stock} ks</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ color: t.textMuted, textAlign: 'left' }}><th style={{ padding: '10px 8px', fontWeight: 600 }}>Produkt</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Kategória</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Cena</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Sklad</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Stav</th></tr></thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} onClick={() => setEditProduct(p)} style={{ borderTop: `1px solid ${t.border}`, cursor: 'pointer', transition: 'background 0.15s' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: t.text }}>{p.name}</td>
                  <td style={{ padding: '12px 8px', color: t.textMuted }}>{p.category === 'Damske' ? 'Dámske' : p.category === 'Panske' ? 'Pánske' : 'Doplnky'}</td>
                  <td style={{ padding: '12px 8px', color: t.accent, fontWeight: 700 }}>{p.price}&euro;</td>
                  <td style={{ padding: '12px 8px' }}><span style={{ color: stockColor(p.stock), fontWeight: 600 }}>{p.stock} ks</span></td>
                  <td style={{ padding: '12px 8px' }}><span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: p.stock < 5 ? '#ef444422' : '#10b98122', color: p.stock < 5 ? '#ef4444' : '#10b981' }}>{p.stock < 5 ? 'Nízky sklad' : 'Aktívny'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editProduct && <ProductModal product={editProduct} onClose={() => setEditProduct(null)} />}
      {showNewProduct && <ProductModal product={null} onClose={() => setShowNewProduct(false)} />}
    </div>
  );

  const OrdersView = () => (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['Vse', 'Nova', 'Spracovana', 'Odoslana', 'Dorucena'] as OrderStatus[]).map(s => (
          <button key={s} onClick={() => setOrderFilter(s)} style={btn(orderFilter === s)}>
            {s === 'Vse' ? 'Všetky' : statusLabel(s)}
          </button>
        ))}
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ color: t.textMuted, textAlign: 'left' }}><th style={{ padding: '10px 8px', fontWeight: 600 }}>#</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Zákazník</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Položky</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Suma</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Stav</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Dátum</th></tr></thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id} onClick={() => setSelectedOrder(o)} style={{ borderTop: `1px solid ${t.border}`, cursor: 'pointer', transition: 'background 0.15s' }}>
                <td style={{ padding: '12px 8px', color: t.accent, fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: '12px 8px', color: t.text, fontWeight: 500 }}>{o.customer}</td>
                <td style={{ padding: '12px 8px', color: t.textMuted }}>{o.items.length} ks</td>
                <td style={{ padding: '12px 8px', color: t.text, fontWeight: 700 }}>{o.total}&euro;</td>
                <td style={{ padding: '12px 8px' }}><span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${statusColor(o.status)}22`, color: statusColor(o.status) }}>{statusLabel(o.status)}</span></td>
                <td style={{ padding: '12px 8px', color: t.textMuted }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );

  const StockView = () => (
    <div>
      {lowStockProducts.length > 0 && (
        <div style={{ ...card, marginBottom: 20, borderColor: '#ef444440', background: `${t.bgCard}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'adminPulse 2s infinite' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ef4444' }}>Nízky sklad - {lowStockProducts.length} produktov</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {lowStockProducts.map(p => (
              <span key={p.id} style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, background: '#ef444418', color: '#ef4444', fontWeight: 600 }}>{p.name} ({p.stock})</span>
            ))}
          </div>
        </div>
      )}
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ color: t.textMuted, textAlign: 'left' }}><th style={{ padding: '10px 8px', fontWeight: 600 }}>Produkt</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Sklad</th><th style={{ padding: '10px 8px', fontWeight: 600, width: '30%' }}>Stav</th><th style={{ padding: '10px 8px', fontWeight: 600 }}>Akcia</th></tr></thead>
          <tbody>
            {sortedStock.map(p => {
              const pct = Math.min((p.stock / 60) * 100, 100);
              return (
                <tr key={p.id} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={{ padding: '12px 8px', color: t.text, fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '12px 8px' }}><span style={{ color: stockColor(p.stock), fontWeight: 700 }}>{p.stock} ks</span></td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ height: 8, borderRadius: 4, background: `${t.border}`, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: stockColor(p.stock), transition: 'width 0.5s ease' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button onClick={() => handleRestockItem(p.id)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 700, borderRadius: 8, border: `1px solid ${t.accent}`, background: `${t.accent}11`, color: t.accent, cursor: 'pointer', fontFamily: font, transition: 'all 0.2s' }}>
                      Doplniť +50
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const views: Record<View, React.ReactNode> = { dashboard: <DashboardView />, products: <ProductsView />, orders: <OrdersView />, stock: <StockView /> };
  const viewTitles: Record<View, string> = { dashboard: 'Dashboard', products: 'Produkty', orders: 'Objednávky', stock: 'Sklad' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: t.bg, color: t.text, fontFamily: font }}>
      <style>{`
        @keyframes adminFadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes adminPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 768px) { .admin-sidebar { position: fixed !important; z-index: 900 !important; height: 100vh !important; } .admin-sidebar.closed { transform: translateX(-100%) !important; } }
      `}</style>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? '' : 'closed'}`} style={{
        width: sidebarOpen ? 240 : 0, minHeight: '100vh', background: t.bgCard,
        borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s, transform 0.3s', overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: t.isLight ? '#fff' : '#000', flexShrink: 0 }}>MS</div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>ModaShop</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Admin Panel</div>
          </div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map(n => (
            <button key={n.key} onClick={() => { setView(n.key); if (window.innerWidth < 768) setSidebarOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 14px',
              background: view === n.key ? `${t.accent}18` : 'transparent', border: 'none', borderRadius: 10,
              cursor: 'pointer', color: view === n.key ? t.accent : t.textMuted, fontSize: 14,
              fontWeight: view === n.key ? 700 : 500, transition: 'all 0.2s', fontFamily: font,
              marginBottom: 4, whiteSpace: 'nowrap',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${t.border}` }}>
          <PoweredByVassweb />
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${t.border}`, background: t.bgCard, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>ModaShop Admin</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            </button>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: t.isLight ? '#fff' : '#000' }}>A</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: t.text, margin: '0 0 24px' }}>{viewTitles[view]}</h1>
          {views[view]}
        </main>
      </div>

      <ThemeSwitcher />
    </div>
  );
}

export default function Page() {
  return (
    <DemoProvider>
      <BackToVassweb />
      <AdminContent />
    </DemoProvider>
  );
}
