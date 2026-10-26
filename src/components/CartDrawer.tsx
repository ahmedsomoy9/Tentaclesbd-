import { useWholesale } from '../context/WholesaleContext';
import { formatBDT, BRAND } from '../utils/constants';
import { X, Trash2, ShoppingBag, ArrowRight, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export function CartDrawer({ onCheckout, onContinueShopping }: CartDrawerProps) {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    cartTotalAmount,
    cartTotalPieces,
    clearCart,
  } = useWholesale();

  if (!isCartDrawerOpen) return null;

  // Validate if all items meet their MOQ
  const isAllMoqMet = cart.every((item) => item.totalPieces >= item.product.moq);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-serif-luxury text-base font-normal uppercase tracking-wider text-stone-900">
                Wholesale Cart ({cartTotalPieces} pcs)
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCartDrawer}
              className="p-1 text-neutral-500 hover:text-neutral-950 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300" />
                <h3 className="text-sm font-bold text-neutral-900 uppercase">Your Cart is Empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Browse our wholesale apparel collections and select the standard 24-piece pack or configure custom sizes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    onContinueShopping();
                  }}
                  className="mt-4 inline-block px-5 py-2.5 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const isItemMoqMet = item.totalPieces >= item.product.moq;
                const activeColor = item.product.availableColors[0];
                const thumb = activeColor?.images[0] || '/assets/aistudio/Gemini_Generated_Image_h67kj2h67kj2h67k_d0104502.jpg';

                return (
                  <div
                    key={item.id}
                    className="border border-neutral-200 p-4 bg-white space-y-3 relative group"
                  >
                    {/* Item Top Info */}
                    <div className="flex gap-3">
                      <img
                        src={thumb}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-neutral-950 truncate leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          SKU: {item.product.sku}
                        </div>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-xs font-extrabold text-neutral-950">
                            {formatBDT(item.unitPrice)}
                          </span>
                          <span className="text-[10px] text-neutral-500">/ piece</span>
                          <span className="text-[10px] font-bold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded ml-auto">
                            {item.totalPieces} pcs total
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Color and Size Breakdown matching Specification */}
                    <div className="bg-neutral-50 p-2.5 rounded border border-neutral-200/60 text-[11px] space-y-1.5 font-sans">
                      <span className="font-semibold text-neutral-800 uppercase text-[10px] block border-b border-neutral-200 pb-1">
                        Breakdown by Wash & Size:
                      </span>
                      {item.product.availableColors.map((color) => {
                        const sizesObj = item.matrix[color.id] || {};
                        const colorPcs = Object.values(sizesObj).reduce(
                          (a, b) => a + (Number(b) || 0),
                          0
                        );
                        if (colorPcs === 0) return null;

                        const breakdownStr = Object.entries(sizesObj)
                          .filter(([_, qty]) => Number(qty) > 0)
                          .map(([s, qty]) => `Sz ${s}: ${qty}`)
                          .join(' · ');

                        return (
                          <div key={color.id} className="flex justify-between items-center text-neutral-700">
                            <span className="font-medium text-neutral-900 flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                                style={{ backgroundColor: color.hex }}
                              />
                              {color.name} ({colorPcs} pcs):
                            </span>
                            <span className="text-neutral-600 font-mono text-[10px]">
                              {breakdownStr}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Item Subtotal & MOQ status */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-xs">
                      <div>
                        {isItemMoqMet ? (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> MOQ Satisfied ({item.product.moq} pcs)
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Minimum {item.product.moq} pcs required
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 uppercase mr-1">Subtotal:</span>
                        <span className="font-extrabold text-neutral-950 tabular-nums">
                          {formatBDT(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Subtotals & Order Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Total Order Pieces:</span>
                  <span className="font-bold text-neutral-900">{cartTotalPieces} pcs</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Courier (All BD):</span>
                  <span className="font-medium text-neutral-800">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Cart Subtotal:</span>
                  <span className="tabular-nums text-base">{formatBDT(cartTotalAmount)}</span>
                </div>
              </div>

              {!isAllMoqMet && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-800 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>One or more products do not meet the 24-piece MOQ.</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    onCheckout();
                  }}
                  disabled={!isAllMoqMet}
                  className={`w-full py-3.5 px-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAllMoqMet
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white cursor-pointer'
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>Proceed to Wholesale Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    onContinueShopping();
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 text-center"
                >
                  Continue Browsing Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
