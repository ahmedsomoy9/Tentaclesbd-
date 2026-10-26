import { useState } from 'react';
import { Product } from '../types/wholesale';
import { formatBDT } from '../utils/constants';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useWholesale } from '../context/WholesaleContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onQuickView }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useWholesale();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const activeColor = product.availableColors[selectedColorIndex] || product.availableColors[0];
  const primaryImage = activeColor?.images?.[0] || '/assets/aistudio/Gemini_Generated_Image_h67kj2h67kj2h67k_d0104502.jpg';
  const secondaryImage = activeColor?.images?.[1] || primaryImage;

  const wishlisted = isWishlisted(product.id);

  return (
    <div
      className="group relative flex flex-col bg-white border border-stone-200/80 hover:border-stone-400/80 rounded-xs hover:shadow-[0_16px_36px_-10px_rgba(28,25,23,0.08)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 4:5 or 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100/60 cursor-pointer" onClick={() => onSelect(product)}>
        {/* Main Product Image with silky smooth zoom */}
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="text-[10px] uppercase font-medium tracking-widest text-stone-100 bg-[#1F1E1D]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-xs">
            MOQ: {product.moq} PCS
          </span>
          {product.isNewArrival && (
            <span className="text-[9px] uppercase font-semibold tracking-wider text-[#5C4212] bg-[#F4E1BD] px-2 py-0.5 rounded-xs">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            wishlisted
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white/90 text-stone-700 hover:text-stone-950 hover:bg-white backdrop-blur-xs shadow-2xs'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Strip */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#181716]/85 via-[#181716]/40 to-transparent flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-[#FAF8F5] hover:bg-white text-stone-900 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors duration-200 shadow-xs rounded-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-100 transition-colors duration-200 rounded-xs"
            title="Configure Wholesale Pack"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-normal mb-1">
            <span>{product.categoryLabel}</span>
            <span className="font-mono text-stone-400">{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-xs sm:text-sm font-medium text-stone-900 hover:text-stone-600 cursor-pointer line-clamp-2 leading-relaxed transition-colors duration-200"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Colour Swatches */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              {product.wholesalePrice && product.wholesalePrice > 0 ? (
                <>
                  <span className="font-serif-luxury text-base sm:text-lg font-semibold text-stone-900 tabular-nums">
                    {formatBDT(product.wholesalePrice)}
                  </span>
                  <span className="text-[11px] text-neutral-700 font-medium ml-1">/ piece</span>
                </>
              ) : (
                <span className="text-xs font-bold text-neutral-950 uppercase tracking-tight">
                  Price on Request
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-700 font-medium bg-neutral-100 px-1.5 py-0.5 border border-neutral-200">
              MOQ: {product.moq} PCS
            </span>
          </div>

          {/* Colour Swatches */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {product.availableColors.map((color, idx) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColorIndex === idx
                      ? 'ring-2 ring-neutral-950 ring-offset-1 border-white scale-110'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>

            <span className="text-[10px] text-neutral-700 font-medium">
              Sizes: {product.availableSizes.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
