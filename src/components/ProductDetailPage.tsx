import { useState, useMemo, useEffect } from 'react';
import { Product } from '../types/wholesale';
import { WholesaleMatrix } from './WholesaleMatrix';
import { useWholesale } from '../context/WholesaleContext';
import { formatBDT, BRAND } from '../utils/constants';
import {
  Heart,
  ShoppingBag,
  MessageSquare,
  Truck,
  Check,
  ChevronRight,
  ZoomIn,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  Ruler,
  Layers,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onProceedToCheckout: () => void;
}

export function ProductDetailPage({
  product,
  onBack,
  onSelectProduct,
  onProceedToCheckout,
}: ProductDetailPageProps) {
  const { addToCart, isWishlisted, toggleWishlist, products, openQuoteModal } = useWholesale();

  // Active color & active image
  const [activeColorId, setActiveColorId] = useState(product.availableColors[0]?.id || 'dark-blue');
  const activeColor = product.availableColors.find((c) => c.id === activeColorId) || product.availableColors[0];
  const [selectedGalleryWash, setSelectedGalleryWash] = useState<'all' | string>(() =>
    product.availableColors.length > 1 ? 'all' : (product.availableColors[0]?.id || 'dark-blue')
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'sizechart' | 'wholesale-terms'>('details');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const buildInitialMatrix = (prod: Product) => {
    const init: Record<string, Record<number, number>> = {};
    const baseMultiplier = prod.availableColors.length === 1 ? 3 : 1;
    prod.availableColors.forEach((color) => {
      init[color.id] = {};
      prod.availableSizes.forEach((size) => {
        init[color.id][size] = (prod.standardPackRatio[size] || 2) * baseMultiplier;
      });
    });
    return init;
  };

  // Initialize matrix with standard pack (24 pieces)
  const [matrix, setMatrix] = useState<Record<string, Record<number, number>>>(() => buildInitialMatrix(product));

  // Sync state when selected product changes
  useEffect(() => {
    setActiveColorId(product.availableColors[0]?.id || 'dark-blue');
    setSelectedGalleryWash(product.availableColors.length > 1 ? 'all' : (product.availableColors[0]?.id || 'dark-blue'));
    setActiveImageIndex(0);
    setMatrix(buildInitialMatrix(product));
  }, [product.id]);

  // Calculate current selected pieces
  const totalPieces = useMemo(() => {
    let sum = 0;
    Object.values(matrix).forEach((sizes) => {
      Object.values(sizes).forEach((qty) => {
        sum += Number(qty) || 0;
      });
    });
    return sum;
  }, [matrix]);

  // Current tier unit price
  const currentUnitPrice = useMemo(() => {
    if (!product.priceTiers || product.priceTiers.length === 0) {
      return product.wholesalePrice;
    }
    const sorted = [...product.priceTiers].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sorted) {
      if (totalPieces >= tier.minQty) {
        return tier.pricePerPiece;
      }
    }
    return product.wholesalePrice;
  }, [product, totalPieces]);

  const currentTotalAmount = totalPieces * (currentUnitPrice || 0);
  const isMoqMet = totalPieces >= product.moq;
  const wishlisted = isWishlisted(product.id);

  // When changing color from swatch
  const handleColorChange = (colorId: string) => {
    setActiveColorId(colorId);
    setSelectedGalleryWash(colorId);
    setActiveImageIndex(0);
  };

  // Add to Cart Action
  const handleAddToCart = () => {
    setFeedbackMsg(null);
    if (!isMoqMet) {
      setFeedbackMsg({
        type: 'error',
        text: `Cannot add to cart: Minimum wholesale order is ${product.moq} pieces. You currently have ${totalPieces} selected.`,
      });
      return;
    }

    const res = addToCart(product, matrix);
    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `Successfully added ${totalPieces} pieces (${formatBDT(currentTotalAmount)}) to your wholesale cart!`,
      });
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'Failed to add to cart',
      });
    }
  };

  // Direct WhatsApp Order
  const handleWhatsAppOrder = () => {
    if (!isMoqMet) {
      setFeedbackMsg({
        type: 'error',
        text: `Please select at least ${product.moq} pieces to order via WhatsApp.`,
      });
      return;
    }

    // Build breakdown text
    let breakdown = '';
    product.availableColors.forEach((color) => {
      const sizesObj = matrix[color.id] || {};
      const colorPcs = Object.values(sizesObj).reduce((a, b) => a + (Number(b) || 0), 0);
      if (colorPcs > 0) {
        const sizesStr = Object.entries(sizesObj)
          .filter(([_, qty]) => Number(qty) > 0)
          .map(([sz, qty]) => `Sz ${sz}: ${qty} pcs`)
          .join(', ');
        breakdown += `• ${color.name} (${colorPcs} pcs): [${sizesStr}]\n`;
      }
    });

    const msg = `Assalamu Alaikum Ten Tacles BD Team,

I am interested in ordering:
*Product:* ${product.name} (SKU: ${product.sku})
*Total Pieces:* ${totalPieces} pcs
*Rate:* ৳${currentUnitPrice} / pc
*Total Est. Value:* ৳${currentTotalAmount.toLocaleString('en-US')}

*Variant Breakdown:*
${breakdown}
Please confirm stock and send invoice.`;

    window.open(`https://wa.me/${BRAND.rawPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const allPackImages = useMemo(() => {
    const list: string[] = [];
    product.availableColors.forEach((c) => {
      c.images.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    });
    return list;
  }, [product]);

  const activeImages = useMemo(() => {
    if (product.availableColors.length > 1 && selectedGalleryWash === 'all') {
      return allPackImages;
    }
    const targetColor =
      product.availableColors.find((c) => c.id === (selectedGalleryWash !== 'all' ? selectedGalleryWash : activeColorId)) ||
      activeColor;
    return targetColor?.images?.length ? targetColor.images : product.availableColors[0]?.images || [];
  }, [product, selectedGalleryWash, allPackImages, activeColorId, activeColor]);

  const currentDisplayImage = activeImages[activeImageIndex] || activeImages[0];

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <button onClick={onBack} className="hover:text-stone-900 flex items-center gap-1 font-medium transition-colors duration-200">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span>/</span>
          <span className="capitalize">{product.categoryLabel}</span>
          <span>/</span>
          <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* 2-Column Product Detail Layout matching 3rd Dorjibari Reference Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-neutral-200">
          {/* Left Column: Gallery & Thumbnails (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden border border-neutral-200 group">
              <img
                src={currentDisplayImage}
                alt={`${product.name} - ${activeColor.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                <span className="text-[11px] font-bold tracking-wider uppercase text-white bg-neutral-950 px-2.5 py-1">
                  MOQ: {product.moq} PCS
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-900 bg-amber-400 px-2 py-0.5">
                  {activeColor.name}
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
                  wishlisted
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white/90 text-neutral-700 hover:text-neutral-950 hover:bg-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>

              <div className="absolute bottom-3 right-3 text-[10px] text-white/90 bg-black/60 px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1">
                <ZoomIn className="w-3 h-3" />
                <span>Hover to zoom</span>
              </div>
            </div>

            {/* Multi-Wash Filter Strip for 24-Piece Pack */}
            {product.availableColors.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGalleryWash('all');
                    setActiveImageIndex(0);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    selectedGalleryWash === 'all'
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-neutral-950'
                  }`}
                >
                  All 3 Washes ({allPackImages.length})
                </button>
                {product.availableColors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedGalleryWash(c.id);
                      setActiveColorId(c.id);
                      setActiveImageIndex(0);
                    }}
                    className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                      selectedGalleryWash === c.id
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-neutral-950'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block border border-neutral-400"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name.replace(/\s*\(.*\)/, '')} ({c.images.length})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Clickable Image Thumbnails Carousel */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {activeImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[3/4] bg-neutral-100 border overflow-hidden transition-all ${
                    activeImageIndex === idx
                      ? 'border-neutral-950 ring-2 ring-neutral-950/20'
                      : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`View ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>

            {/* Wholesale Certification note */}
            <div className="p-3 bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-600 space-y-1">
              <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Authentic Factory Batch Inspection</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                All garments undergo factory QC checks for colorfastness, seam strength, and shrink control prior to dispatch.
              </p>
            </div>
          </div>

          {/* Right Column: Purchasing Module & Wholesale Matrix (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & SKU */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium mb-1.5">
                <span className="uppercase tracking-widest">{product.categoryLabel}</span>
                <span className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  In Stock ({product.stockCount?.toLocaleString() || '1,440'} pcs ready)
                </span>
                <span className="text-stone-300">|</span>
                <span className="text-stone-600 font-normal">Standard Pack: 24 Pieces</span>
              </div>
            </div>

            {/* Wholesale Price Display & Tier Breakdown */}
            <div className="p-4 bg-white border border-stone-200/80 rounded-xs shadow-xs">
              <div className="flex items-baseline gap-2">
                <span className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-stone-900 tabular-nums">
                  {formatBDT(currentUnitPrice)}
                </span>
                <span className="text-xs text-stone-500 font-normal uppercase tracking-wider">
                  / piece (Wholesale)
                </span>
              </div>

              {/* Tiers display */}
              {product.priceTiers && product.priceTiers.length > 0 && product.priceTiers[0].pricePerPiece > 0 ? (
                <div className="mt-3 pt-3 border-t border-neutral-200 grid grid-cols-3 gap-2 text-center text-xs">
                  {product.priceTiers.map((tier) => (
                    <div
                      key={tier.minQty}
                      className={`p-2 border rounded ${
                        totalPieces >= tier.minQty
                          ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                          : 'bg-white text-neutral-700 border-neutral-200'
                      }`}
                    >
                      <div className="text-[10px] uppercase text-neutral-400">{tier.minQty}+ pcs</div>
                      <div className="font-extrabold text-sm">{formatBDT(tier.pricePerPiece)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                  <span>Wholesale lot rate confirmed on order invoice</span>
                  <button
                    type="button"
                    onClick={() => openQuoteModal(product.name)}
                    className="font-bold text-neutral-950 underline hover:text-neutral-700"
                  >
                    Request Lot Rate
                  </button>
                </div>
              )}
            </div>

            {/* Colour Switcher */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-900 uppercase tracking-wider">
                  Available Washes / Colours:
                </span>
                <span className="text-neutral-600 font-medium">
                  Active: <strong className="text-neutral-950">{activeColor.name}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                {product.availableColors.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => handleColorChange(col.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 border text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeColorId === col.id
                        ? 'border-neutral-950 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wholesale Matrix Interactive Ordering Tool */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-950">
                  <Layers className="w-4 h-4 text-neutral-700" />
                  <span>Wholesale Order Matrix</span>
                </div>
                <button
                  type="button"
                  onClick={() => openQuoteModal(product.name)}
                  className="text-xs text-neutral-600 hover:text-neutral-950 underline font-medium"
                >
                  Custom Enterprise Quote?
                </button>
              </div>

              <WholesaleMatrix
                product={product}
                matrix={matrix}
                onChange={setMatrix}
                onColorSelect={handleColorChange}
                activeColorId={activeColorId}
              />
            </div>

            {/* Feedback Notifications */}
            {feedbackMsg && (
              <div
                className={`p-3 text-xs font-medium border flex items-center gap-2 animate-in fade-in duration-200 ${
                  feedbackMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}
              >
                {feedbackMsg.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* Action Buttons: Add to Cart, WhatsApp Order */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isMoqMet}
                  className={`py-4 px-6 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                    isMoqMet
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white cursor-pointer'
                      : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Wholesale Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  disabled={!isMoqMet}
                  className={`py-4 px-6 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                    isMoqMet
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order On WhatsApp</span>
                </button>
              </div>

              {isMoqMet && (
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider text-neutral-900 border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  Proceed Directly to Checkout Request →
                </button>
              )}
            </div>

            {/* Quick delivery & support badge */}
            <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>Dhaka (24-48h) · All Districts (48-72h)</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>MOQ strictly 24 pcs per item</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="py-12 border-b border-neutral-200">
          <div className="flex border-b border-neutral-200 gap-8 text-xs font-bold uppercase tracking-wider mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-3 relative transition-colors ${
                activeTab === 'details' ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Description & Craftsmanship
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-3 relative transition-colors ${
                activeTab === 'specs' ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Fabric & Wash Specs
              {activeTab === 'specs' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sizechart')}
              className={`pb-3 relative transition-colors ${
                activeTab === 'sizechart' ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Size Measurement Chart
              {activeTab === 'sizechart' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wholesale-terms')}
              className={`pb-3 relative transition-colors ${
                activeTab === 'wholesale-terms' ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Wholesale Terms & Shipping
              {activeTab === 'wholesale-terms' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl text-neutral-700 text-xs sm:text-sm leading-relaxed">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                  <div className="space-y-2">
                    <h4 className="font-bold text-neutral-950 uppercase text-xs">Standard 2-2-2-2 Ratio:</h4>
                    <p className="text-xs text-neutral-600">
                      Each standard wholesale pack contains 8 pieces per color (2 of size 30, 2 of size 32, 2 of size 34, 2 of size 36). Combined across the 3 washes (Dark Blue, Mid Blue, Light Blue), the pack totals exactly 24 pieces.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-neutral-950 uppercase text-xs">Retail Ready:</h4>
                    <p className="text-xs text-neutral-600">
                      Each pant comes individually polybagged with Jack & Jones waistband tags, size stickers, and barcode card hangers ready for boutique display.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase block">Composition</span>
                    <span className="font-bold text-neutral-950">98% Cotton, 2% Spandex</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase block">Fabric Weight</span>
                    <span className="font-bold text-neutral-950">11.5 oz Stretch Indigo</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase block">Wash Type</span>
                    <span className="font-bold text-neutral-950">Enzyme + Hand Scraped Whiskers</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase block">Hardware</span>
                    <span className="font-bold text-neutral-950">YKK Brass Zip & Copper Rivets</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase block">Stitching</span>
                    <span className="font-bold text-neutral-950">Reinforced Bar-Tack</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase block">Origin</span>
                    <span className="font-bold text-neutral-950">Dhaka, Bangladesh</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 italic">
                  Note: Authentic product images shown on this page accurately reflect the wash, color tones, and whisker distributions of the physical production batch.
                </p>
              </div>
            )}

            {activeTab === 'sizechart' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 font-bold text-neutral-950 uppercase text-xs">
                  <Ruler className="w-4 h-4" />
                  <span>Garment Measurements in Inches</span>
                </div>
                <div className="overflow-x-auto border border-neutral-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-900 text-white uppercase text-[11px]">
                        <th className="py-2.5 px-4 font-semibold">Measurement (Inches)</th>
                        <th className="py-2.5 px-4 text-center font-semibold">Size 30</th>
                        <th className="py-2.5 px-4 text-center font-semibold">Size 32</th>
                        <th className="py-2.5 px-4 text-center font-semibold">Size 34</th>
                        <th className="py-2.5 px-4 text-center font-semibold">Size 36</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr>
                        <td className="py-2.5 px-4 font-medium">Waist Relaxed</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">30.5"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">32.5"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">34.5"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">36.5"</td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="py-2.5 px-4 font-medium">Inseam Length</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">31.0"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">31.5"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">32.0"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">32.5"</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-medium">Thigh Circumference</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">21.5"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">22.5"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">23.5"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">24.5"</td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="py-2.5 px-4 font-medium">Leg Opening (Hem)</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">13.0"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">13.5"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">14.0"</td>
                        <td className="py-2.5 px-4 text-center tabular-nums">14.5"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'wholesale-terms' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-neutral-200 bg-neutral-50 space-y-2">
                    <h5 className="font-bold text-neutral-900 uppercase">Ordering & MOQ Policy</h5>
                    <p className="text-neutral-600">
                      Wholesale orders are strictly subject to 24 pieces MOQ. Orders can be configured via our standard 2-2-2-2 pack ratio or customized across available sizes and washes.
                    </p>
                  </div>
                  <div className="p-4 border border-neutral-200 bg-neutral-50 space-y-2">
                    <h5 className="font-bold text-neutral-900 uppercase">Courier & Dispatch</h5>
                    <p className="text-neutral-600">
                      Deliveries inside Dhaka are handled via local wholesale delivery agents within 24 hours. Outside Dhaka orders are shipped via Sundarban Courier, SA Paribahan, or Korotoa with parcel tracking.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Wholesale Products */}
        <div className="py-14">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-950">
              Related Wholesale Collections
            </h3>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="group cursor-pointer border border-neutral-200/80 p-3 hover:border-neutral-900 transition-all bg-white"
              >
                <div className="aspect-[3/4] bg-neutral-100 overflow-hidden mb-3">
                  <img
                    src={rel.availableColors[0]?.images[0] || '/assets/aistudio/Gemini_Generated_Image_h67kj2h67kj2h67k_d0104502.jpg'}
                    alt={rel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                  />
                </div>
                <div className="text-[10px] text-neutral-500 uppercase">{rel.categoryLabel}</div>
                <div className="text-xs font-bold text-neutral-900 group-hover:text-neutral-600 truncate mt-0.5">
                  {rel.name}
                </div>
                <div className="mt-1 text-xs font-extrabold text-neutral-950">
                  {formatBDT(rel.wholesalePrice)}{' '}
                  <span className="text-[10px] font-normal text-neutral-500">/ pc</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
