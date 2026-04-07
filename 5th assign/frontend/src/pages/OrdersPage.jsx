import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package, ArrowLeft, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import API from '../utils/api';
import { PageLoader } from '../components/Loader';

const STATUS_CONFIG = {
  Processing: { color: '#f97316', icon: Clock,        label: 'Processing'  },
  Confirmed:  { color: '#6366f1', icon: CheckCircle,  label: 'Confirmed'   },
  Shipped:    { color: '#3b82f6', icon: Truck,        label: 'Shipped'     },
  Delivered:  { color: '#22c55e', icon: CheckCircle,  label: 'Delivered'   },
  Cancelled:  { color: '#ef4444', icon: XCircle,      label: 'Cancelled'   },
};

// ─── Orders List ────────────────────────────────────────────
export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders')
      .then(r => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--surface)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="section-title mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="py-24 text-center">
            <Package size={64} className="mx-auto mb-6 opacity-20" style={{ color: 'var(--text-primary)' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No orders yet</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>You haven't placed any orders.</p>
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Processing;
              const Icon = cfg.icon;
              return (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  className="card p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{order._id.slice(-8).toUpperCase()}</span>
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: `${cfg.color}15`, color: cfg.color }}
                        >
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs" style={{ color: order.paymentStatus === 'Paid' ? '#22c55e' : 'var(--text-muted)' }}>
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Item thumbnails */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    {order.items.slice(0, 4).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border"
                        style={{ borderColor: 'var(--border)' }}
                        onError={e => { e.target.src='https://via.placeholder.com/48'; }}
                      />
                    ))}
                    {order.items.length > 4 && (
                      <span className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                        +{order.items.length - 4}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Order Detail ────────────────────────────────────────────
export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(r => setOrder(r.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!order) return (
    <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'var(--surface)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Order not found.</p>
    </div>
  );

  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Processing;
  const Icon = cfg.icon;

  // Timeline steps
  const timeline = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
  const currentIdx = timeline.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--surface)' }}>
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Order Details</h1>
            <p className="text-sm mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>#{order._id.slice(-12).toUpperCase()}</p>
          </div>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm"
            style={{ background: `${cfg.color}15`, color: cfg.color }}
          >
            <Icon size={14} /> {cfg.label}
          </span>
        </div>

        {/* Status timeline */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="card p-6 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Order Progress</p>
            <div className="flex items-start">
              {timeline.map((s, i) => {
                const done = i <= currentIdx;
                return (
                  <div key={s} className="flex-1 flex flex-col items-center">
                    <div className="flex items-center w-full">
                      {i > 0 && (
                        <div className="flex-1 h-0.5" style={{ background: i <= currentIdx ? 'var(--accent)' : 'var(--border)' }} />
                      )}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
                        style={{
                          background: done ? 'var(--accent)' : 'var(--surface-3)',
                          color: done ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {done ? '✓' : i + 1}
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="flex-1 h-0.5" style={{ background: i < currentIdx ? 'var(--accent)' : 'var(--border)' }} />
                      )}
                    </div>
                    <p className="text-xs mt-2 text-center" style={{ color: done ? 'var(--accent)' : 'var(--text-muted)', fontWeight: i === currentIdx ? 700 : 400 }}>
                      {s}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="card p-6 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Items Ordered</p>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" onError={e => { e.target.src='https://via.placeholder.com/64'; }} />
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals + Address */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Shipping Address</p>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{order.shippingAddress.fullName}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress.address}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress.city} – {order.shippingAddress.postalCode}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress.phone}</p>
          </div>

          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Payment</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Method</span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Status</span>
                <span className="font-medium" style={{ color: order.paymentStatus === 'Paid' ? '#22c55e' : 'var(--text-primary)' }}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between font-black pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                <span>Total</span><span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
