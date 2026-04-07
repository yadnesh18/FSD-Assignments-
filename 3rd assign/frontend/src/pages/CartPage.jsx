import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

export default function CartPage() {
  const { cart, loading, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const shipping = cartSubtotal > 999 ? 0 : cartSubtotal > 0 ? 99 : 0;
  const total    = cartSubtotal + shipping;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'var(--surface)' }}>
      <Loader size="lg" text="Loading cart…" />
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4" style={{ background: 'var(--surface)' }}>
      <ShoppingBag size={64} className="mb-6 opacity-20" style={{ color: 'var(--text-primary)' }} />
      <h2 className="text-2xl font-black mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
        Your cart is empty
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Looks like you haven't added anything yet.
      </p>
      <Link to="/products" className="btn-primary">Start Shopping <ArrowRight size={16} /></Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="section-title mb-8">
          Shopping Cart <span className="text-2xl font-normal" style={{ color: 'var(--text-muted)' }}>({cart.length} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="card p-5 flex gap-5 items-center animate-fadeUp"
              >
                <Link to={`/products/${product._id}`} className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl"
                    onError={e => { e.target.src = 'https://via.placeholder.com/80'; }}
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <span className="badge badge-accent text-xs mb-1">{product.category}</span>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-sm leading-snug truncate hover:opacity-70 transition-opacity" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-black mt-1" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}>
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    ₹{product.price.toLocaleString('en-IN')} each
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    className="w-9 h-9 flex items-center justify-center hover:opacity-70 transition-opacity"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-9 h-9 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-30"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl hover:opacity-70 transition-opacity"
                  style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-black text-lg mb-6" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Shipping</span>
                  <span className="font-semibold" style={{ color: shipping === 0 ? '#22c55e' : 'var(--text-primary)' }}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Tag size={11} /> Add ₹{(999 - cartSubtotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}
              </div>

              <div
                className="flex justify-between font-black text-lg mb-6 pt-4 border-t"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
              >
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-4 text-base"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-sm hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-muted)' }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
