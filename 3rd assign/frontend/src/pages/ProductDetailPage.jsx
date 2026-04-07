import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Package, Shield, Truck, Minus, Plus } from 'lucide-react';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { PageLoader } from '../components/Loader';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [adding, setAdding]   = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then(r => setProduct(r.data.product))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, qty);
    setAdding(false);
  };

  if (loading) return <PageLoader />;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20" style={{ background: 'var(--surface)' }}>
      <p className="text-5xl mb-4">😕</p>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Product not found</h2>
      <Link to="/products" className="btn-primary mt-4">Back to Shop</Link>
    </div>
  );

  const stars = Math.round(product.rating || 0);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--surface)' }}>
      <div className="max-w-6xl mx-auto px-4">

        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden" style={{ background: 'var(--surface-2)', aspectRatio: '1/1' }}>
            <img
              src={imgError ? 'https://via.placeholder.com/600' : product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="badge badge-accent">{product.category}</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center animate-fadeUp">
            <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={18} className={i <= stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {product.rating} ({product.numReviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: product.stock > 0 ? '#22c55e' : '#ef4444' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Quantity</label>
                <div className="flex items-center rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-70"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-70"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <ShoppingCart size={20} />
              {adding ? 'Adding…' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              {[
                { icon: Truck,   text: 'Free shipping over ₹999' },
                { icon: Shield,  text: 'Secure checkout'          },
                { icon: Package, text: 'Easy 30-day returns'      },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 text-center">
                  <Icon size={20} style={{ color: 'var(--accent)' }} />
                  <span className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
