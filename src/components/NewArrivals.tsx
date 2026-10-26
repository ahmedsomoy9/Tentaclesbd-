import { useWholesale } from '../context/WholesaleContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types/wholesale';

interface NewArrivalsProps {
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export function NewArrivals({ onSelectProduct, onViewAll }: NewArrivalsProps) {
  const { products, openQuickView } = useWholesale();

  // Pick new arrivals or first 4 products
  const displayProducts = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#F5F2EB]/40 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header with Refined Styling */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="h-[1px] bg-stone-300/80 flex-1 max-w-[120px]" />
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-stone-900 uppercase">
              NEW ARRIVALS
            </h2>
            <span className="h-[1px] bg-stone-300/80 flex-1 max-w-[120px]" />
          </div>

          <p className="text-[11px] text-stone-500 uppercase tracking-[0.2em] font-normal">
            Wholesale Batches · 2-2-2-2 Pack Ratios · Export Quality
          </p>

          <button
            type="button"
            onClick={onViewAll}
            className="inline-block mt-3 text-xs font-medium uppercase tracking-widest text-stone-700 hover:text-stone-950 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-950 transition-colors duration-200"
          >
            View All Products
          </button>
        </div>

        {/* 4-column desktop / 2-column mobile grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={openQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
