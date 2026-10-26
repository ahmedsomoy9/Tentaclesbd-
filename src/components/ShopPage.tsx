import { useState, useMemo } from 'react';
import { useWholesale } from '../context/WholesaleContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types/wholesale';
import { formatBDT } from '../utils/constants';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';

interface ShopPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (product: Product) => void;
}

export function ShopPage({
  initialCategory = 'all',
  initialSearch = '',
  onSelectProduct,
}: ShopPageProps) {
  const { products, openQuickView } = useWholesale();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Denim Collections' },
    { id: 'dark-blue', label: 'Dark Blue Collection' },
    { id: 'mid-blue', label: 'Mid Blue Collection' },
    { id: 'light-blue', label: 'Light Blue Collection' },
    { id: 'wholesale-packs', label: '24-PC Wholesale Packs' },
  ];

  const colors = [
    { id: 'all', label: 'All Washes' },
    { id: 'dark-blue', label: 'Dark Blue' },
    { id: 'mid-blue', label: 'Mid Blue' },
    { id: 'light-blue', label: 'Light Blue' },
  ];

  const sizes = [30, 32, 34, 36];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory === 'new-arrivals') {
          if (!p.isNewArrival) return false;
        } else if (selectedCategory === 'wishlist') {
          // Handled elsewhere or via filter
        } else if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.categoryLabel.toLowerCase().includes(q) ||
            p.availableColors.some((c) => c.name.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Color filter
        if (selectedColor !== 'all') {
          const hasColor = p.availableColors.some((c) => c.id === selectedColor);
          if (!hasColor) return false;
        }

        // Size filter
        if (selectedSize !== 'all') {
          if (!p.availableSizes.includes(selectedSize)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.wholesalePrice || 0) - (b.wholesalePrice || 0);
        if (sortBy === 'price-desc') return (b.wholesalePrice || 0) - (a.wholesalePrice || 0);
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, selectedColor, selectedSize, sortBy]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb & Header */}
        <div className="border-b border-stone-200/80 pb-6 mb-8">
          <div className="text-xs text-stone-500 uppercase tracking-[0.2em] font-normal mb-2">
            Ten Tacles BD · Wholesale Apparel Catalog
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-4xl font-normal text-stone-900 uppercase tracking-wide">
                {selectedCategory === 'dark-blue'
                  ? 'DARK BLUE DENIM COLLECTION'
                  : selectedCategory === 'mid-blue'
                  ? 'MID BLUE DENIM COLLECTION'
                  : selectedCategory === 'light-blue'
                  ? 'LIGHT BLUE DENIM COLLECTION'
                  : selectedCategory === 'wholesale-packs'
                  ? '24-PIECE WHOLESALE PACKS'
                  : selectedCategory === 'new-arrivals'
                  ? 'NEW ARRIVALS 2026'
                  : 'ALL DENIM COLLECTIONS'}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Showing {filteredProducts.length} wholesale style{filteredProducts.length === 1 ? '' : 's'} · Minimum Order: 24 Pieces per line
              </p>
            </div>

            {/* Filter Drawer Button on Mobile */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="lg:hidden px-3.5 py-2 border border-neutral-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters ({selectedCategory !== 'all' || selectedColor !== 'all' || selectedSize !== 'all' ? 'Active' : 'All'})</span>
              </button>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-2 border border-neutral-300 bg-white text-neutral-800 text-xs font-semibold focus:outline-none focus:border-neutral-900"
                >
                  <option value="newest">Sort: Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 pr-4 border-r border-neutral-100">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search style or SKU..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-1.5">
                Category
              </h3>
              <div className="space-y-1 text-xs">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                      selectedCategory === c.id
                        ? 'bg-neutral-950 text-white font-bold'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
                    }`}
                  >
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wash / Colour Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-1.5">
                Wash & Shade
              </h3>
              <div className="space-y-1 text-xs">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-full text-left py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                      selectedColor === c.id
                        ? 'bg-neutral-950 text-white font-bold'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-1.5">
                Numeric Waist Size
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSize('all')}
                  className={`py-1.5 text-xs font-semibold border transition-colors ${
                    selectedSize === 'all'
                      ? 'bg-neutral-950 text-white border-neutral-950'
                      : 'border-neutral-300 hover:border-neutral-950'
                  }`}
                >
                  All
                </button>
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-1.5 text-xs font-semibold border transition-colors ${
                      selectedSize === s
                        ? 'bg-neutral-950 text-white border-neutral-950'
                        : 'border-neutral-300 hover:border-neutral-950'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters button */}
            {(selectedCategory !== 'all' || selectedColor !== 'all' || selectedSize !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedColor('all');
                  setSelectedSize('all');
                  setSearchQuery('');
                }}
                className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-950 border border-neutral-200 hover:border-neutral-400 text-center"
              >
                Clear All Filters
              </button>
            )}

            {/* Wholesale MOQ Notice Box */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-neutral-900 block">
                MOQ: 24 Pieces
              </span>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Wholesale prices are available only for orders of 24 pieces or more per product. Orders include the standard 2-2-2-2 ratio or custom size selections.
              </p>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isMobileFiltersOpen && (
            <div className="lg:hidden col-span-12 p-4 bg-neutral-50 border border-neutral-200 space-y-4 mb-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider">Refine Catalog</span>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-neutral-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2.5 py-1 text-xs rounded border ${
                      selectedCategory === c.id
                        ? 'bg-neutral-950 text-white border-neutral-950'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Sizes */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-neutral-700">Size:</span>
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-2 py-1 text-xs border ${
                    selectedSize === 'all' ? 'bg-neutral-950 text-white' : 'bg-white'
                  }`}
                >
                  All
                </button>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2 py-1 text-xs border ${
                      selectedSize === s ? 'bg-neutral-950 text-white' : 'bg-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Grid (9 cols on lg) */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-neutral-300 p-8 space-y-3">
                <SlidersHorizontal className="w-10 h-10 mx-auto text-neutral-300" />
                <h3 className="text-sm font-bold text-neutral-900 uppercase">
                  No Products Match Your Filter
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing your search terms, wash selection, or size filters to view our full wholesale inventory.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedColor('all');
                    setSelectedSize('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-2 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                    onQuickView={openQuickView}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
