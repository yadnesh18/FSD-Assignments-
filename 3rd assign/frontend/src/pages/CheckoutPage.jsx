import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: 'India', phone: '',
  });
  const [payment, setPayment] = useState('COD');

  const setA = (k) => (e) => setAddress(a => ({ ...a, [k]: e.target.value }));

  const shipping = cartSubtotal > 999 ? 0 : 99;
  const total    = cartSubtotal + shipping;

  const validateAddress = () => {
    const { fullName, address: addr, city, postalCode, phone } = address;
    if (!fullName || !addr || !city || !postalCode || !phone) {
      toast.error('Please fill all required fields'); return false;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      toast.error('Enter a valid phone number'); return false;
    }
    return true;
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const items = cart.map(i => ({ product: i.product._id, quantity: i.quantity }));
      const { data } = await API.post('/orders', {
        items,
        shippingAddress: address,
        paymentMethod: payment,
      });
      await clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--surface-2)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="section-title mb-8">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: i <= step ? 'var(--accent)' : 'var(--surface-3)',
                    color: i <= step ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {i < step ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span className="text-xs font-medium" style={{ color: i === step ? 'var(--accent)' : 'var(--text-muted)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-4 rounded" style={{ background: i < step ? 'var(--accent)' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left panel */}
          <div className="lg:col-span-2">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="card p-6 animate-fadeUp">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin size={20} style={{ color: 'var(--accent)' }} />
                  <h2 className="font-black text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Shipping Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { k: 'fullName',   label: 'Full Name',    placeholder: 'John Doe',          col: 2 },
                    { k: 'phone',      label: 'Phone',        placeholder: '+91 98765 43210',   col: 2 },
                    { k: 'address',    label: 'Address',      placeholder: '123, Main Street',  col: 2 },
                    { k: 'city',       label: 'City',         placeholder: 'Mumbai',            col: 1 },
                    { k: 'postalCode', label: 'Postal Code',  placeholder: '400001',            col: 1 },
                    { k: 'country',    label: 'Country',      placeholder: 'India',             col: 2 },
                  ].map(({ k, label, placeholder, col }) => (
                    <div key={k} className={col === 2 ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
                      <input
                        className="input-field"
                        placeholder={placeholder}
                        value={address[k]}
                        onChange={setA(k)}
                        required
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => validateAddress() && setStep(1)}
                  className="btn-primary w-full mt-6 py-4"
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="card p-6 animate-fadeUp">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard size={20} style={{ color: 'var(--accent)' }} />
                  <h2 className="font-black text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Payment Method</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { v: 'COD',  label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: '💵' },
                    { v: 'UPI',  label: 'UPI',              desc: 'Google Pay, PhonePe, Paytm',       icon: '📱' },
                    { v: 'Card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay',       icon: '💳' },
                  ].map(({ v, label, desc, icon }) => (
                    <label
                      key={v}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: payment === v ? 'var(--accent)' : 'var(--border)',
                        background: payment === v ? 'rgba(255,107,53,0.05)' : 'var(--surface)',
                      }}
                    >
                      <input type="radio" name="payment" value={v} checked={payment === v} onChange={() => setPayment(v)} className="hidden" />
                      <span className="text-2xl">{icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                      </div>
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: payment === v ? 'var(--accent)' : 'var(--border)' }}
                      >
                        {payment === v && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} />}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="btn-outline flex-1 py-4">Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 py-4">
                    Review Order <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="card p-6 animate-fadeUp">
                <div className="flex items-center gap-3 mb-6">
                  <Package size={20} style={{ color: 'var(--accent)' }} />
                  <h2 className="font-black text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Review Order</h2>
                </div>

                {/* Shipping summary */}
                <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--surface-2)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Delivering to</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{address.fullName}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{address.address}, {address.city} – {address.postalCode}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{address.phone}</p>
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Items ({cart.length})</p>
                <div className="space-y-3 mb-4">
                  {cart.map(({ product, quantity }) => (
                    <div key={product._id} className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" onError={e => { e.target.src='https://via.placeholder.com/48'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Qty: {quantity} × ₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>₹{(product.price * quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 py-4">Back</button>
                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="btn-primary flex-1 py-4 disabled:opacity-60"
                  >
                    {placing ? 'Placing Order…' : `Place Order – ₹${total.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="card p-6 h-fit sticky top-24">
            <h3 className="font-black mb-4" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Subtotal</span><span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#22c55e' : 'inherit' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
            </div>
            <div className="flex justify-between font-black text-base pt-3 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
              <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
