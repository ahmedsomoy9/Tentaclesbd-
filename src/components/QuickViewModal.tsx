import { useState, useMemo } from 'react';
import { useWholesale } from '../context/WholesaleContext';
import { WholesaleMatrix } from './WholesaleMatrix';
import { formatBDT } from '../utils/constants';
import { Product } from '../types/wholesale';
import { X, ShoppingBag, AlertCircle } from 'lucide-react';

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useWholesale();

  if (!quickViewProduct) return null;

  return <QuickViewModalContent product={quickViewProduct} onClose={closeQuickView} onAdd={addToCart} />;
}

interface ContentProps {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product, matrix: Record<string, Record<number, number>>) => { success: boolean; error?: string };
}

function QuickViewModalContent({ product, onClose, onAdd }: ContentProps) {
  const [activeColorId, setActiveColorId] = useState(product.availableColors[0]?.id || '');
  const activeColor = product.availableColors.find((c) => c.id === activeColorId) || product.availableColors[0];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Matrix
  const [matrix, setMatrix] = useState<Record<string, Record<number, number>>>(() => {
    const init: Record<string, Record<number, number>> = {};
    const baseMultiplier = product.availableColors.length === 1 ? 3 : 1;
    product.availableColors.forEach((color) => {
      init[color.id] = {};
      product.availableSizes.forEach((size) => {
        init[color.id][size] = (product.standardPackRatio[size] || 2) * baseMultiplier;
      });
    });
    return init;
  });

  const totalPieces = useMemo(() => {
    let sum = 0;
    Object.values(matrix).forEach((sizes) => {
      Object.values(sizes).forEach((qty) => {
        sum += Number(qty) || 0;
      });
    });
    return sum;
  }, [matrix]);

  const currentUnitPrice = useMemo(() => {
    if (!product.priceTiers || product.priceTiers.length === 0) {
      return product.wholesalePrice;
    }
    const sorted = [...product.priceTiers].sort((a, b) => b.minQty - a.minQty);
    for (const t of sorted) {
      if (totalPieces >= t.minQty) {
        return t.pricePerPiece;
      }
    }
    return product.wholesalePrice;
  }, [product, totalPieces]);

  const isMoqMet = totalPieces >= product.moq;
  const currentTotalAmount = totalPieces * (currentUnitPrice || 0);

  const handleAdd = () => {
    setErrorMsg('');
    if (!isMoqMet) {
      setErrorMsg(`Minimum order quantity is ${product.moq} pieces.`);
      return;
    }
    const res = onAdd(product, matrix);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to add');
    }
  };

  const allPackImages = useMemo(() => {
    if (product.availableColors.length <= 1) return [];
    const list: string[] = [];
    product.availableColors.forEach((c) => {
      c.images.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    });
    return list;
  }, [product]);

  const images = product.availableColors.length > 1 && allPackImages.length > 0
    ? allPackImages
    : (activeColor?.images?.length ? activeColor.images : product.availableColors[0]?.images || []);
  const currentImg = images[activeImageIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF8F5] shadow-2xl overflow-y-auto border border-stone-200 rounded-xs animate-in zoom-in-95 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-900 hover:text-white flex items-center justify-center transition-colors text-stone-600 shadow-2xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left: Images */}
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-[3/4] bg-neutral-100 overflow-hidden border border-neutral-200">
              <img
                src={currentImg}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[3/4] border overflow-hidden ${
                    activeImageIndex === idx ? 'border-neutral-950 ring-2 ring-neutral-950/30' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info & Matrix */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest block mb-1">
                {product.categoryLabel} · SKU: {product.sku}
              </span>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-normal text-stone-900 tracking-wide">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif-luxury text-2xl font-semibold text-stone-900">
                  {formatBDT(currentUnitPrice)}
                </span>
                <span className="text-xs text-stone-500 font-normal">/ piece</span>
                <span className="text-xs font-semibold text-emerald-700 ml-2">
                  MOQ: {product.moq} pcs
                </span>
              </div>
            </div>

            {/* Matrix */}
            <div className="pt-2">
              <WholesaleMatrix
                product={product}
                matrix={matrix}
                onChange={setMatrix}
                onColorSelect={setActiveColorId}
                activeColorId={activeColorId}
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-neutral-500 block">Total:</span>
                <span className="text-base font-extrabold text-neutral-950">
                  {currentTotalAmount > 0 ? formatBDT(currentTotalAmount) : 'Price on Request'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!isMoqMet}
                className={`py-3 px-6 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                  isMoqMet
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white cursor-pointer'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({totalPieces} pcs)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
