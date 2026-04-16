import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, RefreshCw, Star } from 'lucide-react';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { name: 'Electronics',    emoji: '⚡', color: '#6366f1' },
  { name: 'Clothing',       emoji: '👕', color: '#ec4899' },
  { name: 'Footwear',       emoji: '👟', color: '#f97316' },
  { name: 'Accessories',    emoji: '💼', color: '#14b8a6' },
  { name: 'Home & Kitchen', emoji: '🏠', color: '#84cc16' },
  { name: 'Sports',         emoji: '🏃', color: '#eab308' },
];

const FEATURES = [
  { icon: Truck,     title: 'Free Shipping',      desc: 'On orders above ₹999'     },
  { icon: Shield,    title: 'Secure Payments',    desc: '100% safe transactions'   },
  { icon: RefreshCw, title: 'Easy Returns',       desc: '30-day hassle-free'        },
  { icon: Zap,       title: 'Fast Delivery',      desc: '2-4 business days'         },
];

export default function HomePage() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    API.get('/products?limit=8&sort=-rating')
      .then(r => setFeatured(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--surface)' }}>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: '#6366f1' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {user && (
            <p className="text-sm uppercase tracking-[0.35em] font-semibold mb-4 animate-fadeUp" style={{ color: '#a0a0a0' }}>
              Welcome back, {user.name.split(' ')[0]} — new products are waiting.
            </p>
          )}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fadeUp"
            style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--accent)', border: '1px solid rgba(255,107,53,0.3)' }}
          >
            <Star size={14} className="fill-current" />
            Trending products this season
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-6 leading-none animate-fadeUp"
            style={{ fontFamily: 'Syne, sans-serif', animationDelay: '0.1s' }}
          >
            Shop the
            <span className="block" style={{ color: 'var(--accent)' }}>Future</span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fadeUp"
            style={{ color: '#a0a0a0', animationDelay: '0.2s' }}
          >
            Discover curated products across electronics, fashion, and lifestyle.
            Premium quality, unbeatable prices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
            <Link to="/products" className="btn-primary text-base px-8 py-4">
              {user ? 'Continue Shopping' : 'Explore Shop'} <ArrowRight size={18} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-80"
              style={{ color: '#a0a0a0', border: '1px solid #333' }}
            >
              View Categories
            </Link>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-6 mt-20 pt-10 border-t animate-fadeUp"
            style={{ borderColor: '#2a2a2a', animationDelay: '0.4s' }}
          >
            {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['4.9★', 'Rating']].map(([n, l]) => (
              <div key={l}>
                <p className="text-3xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{n}</p>
                <p className="text-sm mt-1" style={{ color: '#666' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features strip ─────────────────────────────────── */}
      <section className="py-12" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,107,53,0.1)' }}>
                <Icon size={22} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Browse by</p>
            <h2 className="section-title">Categories</h2>
          </div>
          <Link to="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)' }}>
            All products <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger">
          {CATEGORIES.map(({ name, emoji, color }) => (
            <Link
              key={name}
              to={`/products?category=${encodeURIComponent(name)}`}
              className="card flex flex-col items-center gap-3 p-6 text-center group cursor-pointer animate-fadeUp opacity-0"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                style={{ background: `${color}18` }}
              >
                {emoji}
              </div>
              <span className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
                {name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--surface-2)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Hand-picked</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center"><Loader size="lg" text="Loading products…" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 stagger">
              {featured.map(p => (
                <div key={p._id} className="animate-fadeUp opacity-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary px-10 py-4 text-base">
              Shop All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--accent)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Ready to upgrade your lifestyle?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join thousands of happy customers. Free shipping on your first order.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-white transition-all hover:bg-gray-100 hover:shadow-xl active:scale-95"
            style={{ color: 'var(--accent)' }}
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-12" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs" style={{ background: 'var(--accent)' }}>SV</div>
            <span className="font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>ShopVibe</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} ShopVibe. Built with React & Node.js.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
