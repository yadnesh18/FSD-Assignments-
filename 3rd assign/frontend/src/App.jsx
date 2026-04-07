import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider }  from './context/AuthContext';
import { CartProvider }  from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import HomePage         from './pages/HomePage';
import ProductsPage     from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AuthPage         from './pages/AuthPage';
import CartPage         from './pages/CartPage';
import CheckoutPage     from './pages/CheckoutPage';
import { OrdersPage, OrderDetailPage } from './pages/OrdersPage';
import AdminDashboard   from './pages/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              {/* Public */}
              <Route path="/"            element={<HomePage />} />
              <Route path="/products"    element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/login"       element={<AuthPage />} />

              {/* Protected */}
              <Route path="/cart"      element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/checkout"  element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/orders"    element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--surface)' }}>
                  <p className="text-8xl font-black mb-4" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>404</p>
                  <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>Page not found</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              } />
            </Routes>

            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow: 'var(--shadow-lg)',
                },
                success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
