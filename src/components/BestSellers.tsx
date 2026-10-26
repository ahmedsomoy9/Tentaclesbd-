import { useWholesale } from '../context/WholesaleContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types/wholesale';

interface BestSellersProps {
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export function BestSellers({ onSelectProduct, onViewAll }: BestSellersProps) {
  const { products, openQuickView } = useWholesale();

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="h-[1px] bg-stone-300/80 flex-1 max-w-[120px]" />
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-stone-900 uppercase">
              BEST SELLERS
            </h2>
            <span className="h-[1px] bg-stone-300/80 flex-1 max-w-[120px]" />
          </div>
          <p className="text-[11px] text-stone-500 uppercase tracking-[0.2em] font-normal">
            Fast-Moving Inventory For Retailers & Boutiques
          </p>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-block mt-3 text-xs font-medium uppercase tracking-widest text-stone-700 hover:text-stone-950 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-950 transition-colors duration-200"
          >
            Explore Best Sellers
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
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
