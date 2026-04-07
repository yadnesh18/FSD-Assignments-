import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgError, setImgError]   = useState(false);
  const [wishlist, setWishlist]   = useState(false);
  const [adding, setAdding]       = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addToCart(product._id);
    setAdding(false);
  };

  const stars = Math.round(product.rating || 0);

  return (
    <div className="card group overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1', background: 'var(--surface-2)' }}>
        <img
          src={imgError ? 'https://via.placeholder.com/400?text=No+Image' : product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Link
            to={`/products/${product._id}`}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Eye size={16} className="text-gray-700" />
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.stock === 0 && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: '#ef4444' }}>
              Out of Stock
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: '#f97316' }}>
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlist(v => !v); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            className={wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category */}
        <span className="badge badge-accent text-xs">{product.category}</span>

        {/* Name */}
        <Link to={`/products/${product._id}`}>
          <h3
            className="font-semibold text-sm leading-snug line-clamp-2 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  size={12}
                  className={i <= stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ({product.numReviews || 0})
            </span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 gap-2">
          <div>
            <span className="font-black text-lg" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            style={{
              background: product.stock === 0 ? 'var(--text-muted)' : 'var(--accent)',
            }}
          >
            <ShoppingCart size={15} />
            {adding ? '…' : product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
