import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, Users, TrendingUp, Plus, Pencil, Trash2,
  X, Save, Search, RefreshCw, AlertCircle
} from 'lucide-react';
import API from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', category: 'Electronics', image: '', stock: '' };
const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Accessories', 'Home & Kitchen', 'Sports', 'Books', 'Other'];
const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = { Processing: '#f97316', Confirmed: '#6366f1', Shipped: '#3b82f6', Delivered: '#22c55e', Cancelled: '#ef4444' };

export default function AdminDashboard() {
  const [tab, setTab]           = useState('overview');
  const [stats, setStats]       = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  // Product form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, ordersRes] = await Promise.all([
        API.get('/products?limit=100'),
        API.get('/orders/all?limit=10'),
      ]);
      setProducts(prodRes.data.products);
      setOrders(ordersRes.data.orders);
      setStats({
        products: prodRes.data.total,
        orders: ordersRes.data.total,
        revenue: ordersRes.data.revenue || 0,
      });
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit   = (p)  => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock }); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return toast.error('Fill all required fields');
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/products/${editing._id}`, form);
        toast.success('Product updated!');
      } else {
        await API.post('/products', form);
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: status });
      toast.success('Order status updated');
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = ['overview', 'products', 'orders'];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--surface-2)' }}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your store</p>
          </div>
          <button onClick={fetchData} className="btn-outline flex items-center gap-2">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-2xl mb-8 w-fit" style={{ background: 'var(--surface)' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
              style={{
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-32 flex justify-center"><Loader size="lg" text="Loading…" /></div>
        ) : (
          <>
            {/* ── Overview ── */}
            {tab === 'overview' && (
              <div className="animate-fadeUp">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {[
                    { icon: Package,    label: 'Total Products', value: stats?.products || 0,                             color: '#6366f1' },
                    { icon: ShoppingBag,label: 'Total Orders',   value: stats?.orders   || 0,                             color: '#f97316' },
                    { icon: TrendingUp, label: 'Revenue (Paid)', value: `₹${(stats?.revenue||0).toLocaleString('en-IN')}`, color: '#22c55e' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${color}18` }}>
                          <Icon size={20} style={{ color }} />
                        </div>
                      </div>
                      <p className="text-3xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Recent Orders</h2>
                    <button onClick={() => setTab('orders')} className="text-sm font-semibold hover:opacity-70" style={{ color: 'var(--accent)' }}>View all</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead style={{ background: 'var(--surface-2)' }}>
                        <tr>
                          {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o._id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                            <td className="px-6 py-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>#{o._id.slice(-8).toUpperCase()}</td>
                            <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>{o.user?.name || '—'}</td>
                            <td className="px-6 py-4 font-bold" style={{ color: 'var(--text-primary)' }}>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${STATUS_COLORS[o.orderStatus]}15`, color: STATUS_COLORS[o.orderStatus] }}>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4" style={{ color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Products ── */}
            {tab === 'products' && (
              <div className="animate-fadeUp">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input className="input-field pl-10" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead style={{ background: 'var(--surface-2)' }}>
                        <tr>
                          {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map(p => (
                          <tr key={p._id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" onError={e => { e.target.src='https://via.placeholder.com/40'; }} />
                                <span className="font-medium line-clamp-1" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4"><span className="badge badge-accent">{p.category}</span></td>
                            <td className="px-6 py-4 font-bold" style={{ color: 'var(--text-primary)' }}>₹{p.price.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4">
                              <span style={{ color: p.stock === 0 ? '#ef4444' : p.stock <= 5 ? '#f97316' : '#22c55e' }} className="font-semibold">
                                {p.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)', background: 'rgba(255,107,53,0.1)' }}>
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity disabled:opacity-40" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                                  {deleting === p._id ? <RefreshCw size={14} className="animate-spin-slow" /> : <Trash2 size={14} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                      <div className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
                        <AlertCircle size={32} className="mx-auto mb-2 opacity-30" />
                        <p>No products found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Orders ── */}
            {tab === 'orders' && (
              <div className="animate-fadeUp card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background: 'var(--surface-2)' }}>
                      <tr>
                        {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Update Status'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-5 py-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>#{o._id.slice(-8).toUpperCase()}</td>
                          <td className="px-5 py-4" style={{ color: 'var(--text-primary)' }}>{o.user?.name || '—'}</td>
                          <td className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>{o.items.length}</td>
                          <td className="px-5 py-4 font-bold" style={{ color: 'var(--text-primary)' }}>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-4">
                            <span style={{ color: o.paymentStatus === 'Paid' ? '#22c55e' : 'var(--text-muted)' }} className="font-medium text-xs">{o.paymentStatus}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${STATUS_COLORS[o.orderStatus]}15`, color: STATUS_COLORS[o.orderStatus] }}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={o.orderStatus}
                              onChange={e => updateStatus(o._id, e.target.value)}
                              className="text-xs px-2 py-1.5 rounded-lg border outline-none"
                              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                            >
                              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Product Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg card p-8 max-h-[90vh] overflow-y-auto animate-fadeUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-xl" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {[
                { k: 'name',        label: 'Product Name *',  type: 'text',   placeholder: 'e.g. Premium Headphones' },
                { k: 'image',       label: 'Image URL',       type: 'url',    placeholder: 'https://…' },
                { k: 'price',       label: 'Price (₹) *',     type: 'number', placeholder: '999' },
                { k: 'stock',       label: 'Stock *',         type: 'number', placeholder: '50' },
              ].map(({ k, label, type, placeholder }) => (
                <div key={k}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
                  <input
                    type={type}
                    className="input-field"
                    placeholder={placeholder}
                    value={form[k]}
                    onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    min={type === 'number' ? 0 : undefined}
                    required={label.includes('*')}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Product description…"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 py-3">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 disabled:opacity-60">
                  <Save size={15} /> {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
