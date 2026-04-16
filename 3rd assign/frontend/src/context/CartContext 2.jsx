import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart whenever user logs in
  useEffect(() => {
    if (user) fetchCart();
    else setCart([]);
  }, [user]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCart(data.cart || []);
    } catch {
      // silent – user may not be logged in
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    try {
      const { data } = await API.post('/cart/add', { productId, quantity });
      setCart(data.cart);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      const { data } = await API.put('/cart/update', { productId, quantity });
      setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    try {
      const { data } = await API.delete('/cart/remove', { data: { productId } });
      setCart(data.cart);
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await API.delete('/cart/clear');
      setCart([]);
    } catch { /* ignore */ }
  }, []);

  const cartCount    = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, loading, cartCount, cartSubtotal,
      fetchCart, addToCart, updateQuantity, removeFromCart, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
