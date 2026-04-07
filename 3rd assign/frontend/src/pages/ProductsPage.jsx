import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Footwear', 'Accessories', 'Home & Kitchen', 'Sports', 'Books'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price',      label: 'Price: Low to High' },
  { value: '-price',     label: 'Price: High to Low' },
  { value: '-rating',    label: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state
  const [search,   setSearch]   = useState(searchParams.get('search')   || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort,     setSort]     = useState('-createdAt');
  const [page,     setPage]     = useState(1);
  const [searchInput, setSearchInput] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8, sort });
      if (search)   params.set('search',   search);
      if (category && category !== 'All') params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [search, category, minPrice, maxPrice, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearch(''); setSearchInput('');
    setCategory('All'); setMinPrice(''); setMaxPrice('');
    setSort('-createdAt'); setPage(1);
  };

  const hasActiveFilters = search || category !== 'All' || minPrice || maxPrice;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">Shop</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {loading ? '…' : `${total} products found`}
          </p>
        </div>

        {/* Search + Controls bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              className="input-field pl-10 pr-4"
              placeholder="Search products…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </form>

          <select
            className="input-field sm:w-52"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button
            onClick={() => setFiltersOpen(v => !v)}
            className="btn-outline flex items-center gap-2"
          >
            <SlidersHorizontal size={16} /> Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center" style={{ background: 'var(--accent)' }}>!</span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="card p-6 mb-6 animate-fadeUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm flex items-center gap-1 hover:opacity-70" style={{ color: 'var(--accent)' }}>
                  <X size={14} /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: category === c ? 'var(--accent)' : 'var(--surface-2)',
                        color: category === c ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid',
                        borderColor: category === c ? 'var(--accent)' : 'var(--border)',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Min Price (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Max Price (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="99999"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {search && (
              <span className="badge badge-accent flex items-center gap-1.5">
                Search: "{search}" <X size={12} className="cursor-pointer" onClick={() => { setSearch(''); setSearchInput(''); }} />
              </span>
            )}
            {category !== 'All' && (
              <span className="badge badge-accent flex items-center gap-1.5">
                {category} <X size={12} className="cursor-pointer" onClick={() => setCategory('All')} />
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="badge badge-accent flex items-center gap-1.5">
                ₹{minPrice || '0'} – ₹{maxPrice || '∞'}
                <X size={12} className="cursor-pointer" onClick={() => { setMinPrice(''); setMaxPrice(''); }} />
              </span>
            )}
          </div>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="py-32 flex justify-center"><Loader size="lg" text="Loading products…" /></div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-6xl mb-4">🛍️</p>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No products found</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 stagger">
            {products.map(p => (
              <div key={p._id} className="animate-fadeUp opacity-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-10 h-10 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: page === p ? 'var(--accent)' : 'var(--surface-2)',
                  color: page === p ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="btn-outline px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
