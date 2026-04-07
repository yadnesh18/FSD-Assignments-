import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode]         = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register' && form.name.trim().length < 2) {
      return toast.error('Name must be at least 2 characters');
    }
    if (!form.email.includes('@')) return toast.error('Enter a valid email');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      } else {
        const user = await register(form.name, form.email, form.password);
        toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ background: 'var(--surface-2)' }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black" style={{ background: 'var(--accent)' }}>SV</div>
            <span className="font-black text-2xl" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>ShopVibe</span>
          </Link>
        </div>

        {/* Card */}
        <div className="card p-8">
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: 'var(--surface-2)' }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize"
                style={{
                  background: mode === m ? 'var(--surface)' : 'transparent',
                  color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: mode === m ? 'var(--shadow)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-black mb-1" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Welcome back' : 'Get started'}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login'
              ? 'Sign in to your ShopVibe account'
              : 'Create your free account today'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  className="input-field pl-10"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={set('name')}
                  required
                  autoFocus
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              <input
                className="input-field pl-10"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={set('email')}
                required
                autoFocus={mode === 'login'}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              <input
                className="input-field pl-10 pr-10"
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={set('password')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Demo credentials */}
          {mode === 'login' && (
            <div
              className="mt-6 p-4 rounded-xl text-xs"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <p className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Demo credentials:</p>
              <div className="space-y-1" style={{ color: 'var(--text-muted)' }}>
                <p>👤 User: <span className="font-mono">john@example.com</span> / <span className="font-mono">user123</span></p>
                <p>🔑 Admin: <span className="font-mono">admin@ecommerce.com</span> / <span className="font-mono">admin123</span></p>
              </div>
              <button
                type="button"
                className="mt-2 text-xs font-semibold hover:opacity-70 transition-opacity"
                style={{ color: 'var(--accent)' }}
                onClick={() => setForm({ name: '', email: 'john@example.com', password: 'user123' })}
              >
                Fill user credentials →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
