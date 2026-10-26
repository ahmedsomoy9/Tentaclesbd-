import { useMemo } from 'react';
import { Product } from '../types/wholesale';
import { formatBDT } from '../utils/constants';
import { CheckCircle2, AlertCircle, Sparkles, Plus, Minus, RotateCcw } from 'lucide-react';

interface WholesaleMatrixProps {
  product: Product;
  matrix: Record<string, Record<number, number>>;
  onChange: (updatedMatrix: Record<string, Record<number, number>>) => void;
  onColorSelect?: (colorId: string) => void;
  activeColorId?: string;
}

export function WholesaleMatrix({
  product,
  matrix,
  onChange,
  onColorSelect,
  activeColorId,
}: WholesaleMatrixProps) {
  const sizes = product.availableSizes;
  const colors = product.availableColors;

  // Calculate totals
  const { totalPieces, colorTotals, sizeTotals } = useMemo(() => {
    let pieces = 0;
    const cTotals: Record<string, number> = {};
    const sTotals: Record<number, number> = {};

    sizes.forEach((s) => (sTotals[s] = 0));

    colors.forEach((c) => {
      let rowSum = 0;
      sizes.forEach((s) => {
        const val = matrix[c.id]?.[s] || 0;
        rowSum += val;
        sTotals[s] = (sTotals[s] || 0) + val;
      });
      cTotals[c.id] = rowSum;
      pieces += rowSum;
    });

    return { totalPieces: pieces, colorTotals: cTotals, sizeTotals: sTotals };
  }, [matrix, sizes, colors]);

  // Current Unit Price from Tiers
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

  const currentTotalAmount = totalPieces * (currentUnitPrice || 0);
  const isMoqMet = totalPieces >= product.moq;
  const neededPieces = Math.max(0, product.moq - totalPieces);

  // Update a single cell
  const handleCellChange = (colorId: string, size: number, nextVal: number) => {
    const val = Math.max(0, Math.floor(nextVal) || 0);
    const updated = {
      ...matrix,
      [colorId]: {
        ...(matrix[colorId] || {}),
        [size]: val,
      },
    };
    onChange(updated);
  };

  // Preset: Standard 24-piece pack (meets MOQ: 24)
  const applyStandardPack = (multiplier = 1) => {
    const nextMatrix: Record<string, Record<number, number>> = {};
    const baseMultiplier = colors.length === 1 ? 3 : 1;
    colors.forEach((c) => {
      nextMatrix[c.id] = {};
      sizes.forEach((s) => {
        const ratio = product.standardPackRatio[s] || 2;
        nextMatrix[c.id][s] = ratio * baseMultiplier * multiplier;
      });
    });
    onChange(nextMatrix);
  };

  // Reset to 0
  const resetMatrix = () => {
    const nextMatrix: Record<string, Record<number, number>> = {};
    colors.forEach((c) => {
      nextMatrix[c.id] = {};
      sizes.forEach((s) => {
        nextMatrix[c.id][s] = 0;
      });
    });
    onChange(nextMatrix);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Standard Pack Button & Quick Ratio Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-stone-200/60">
        <button
          type="button"
          onClick={() => applyStandardPack(1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium tracking-wider uppercase transition-all duration-200 rounded-xs shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Select Standard Pack — 24 Pcs
        </button>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-stone-500 font-normal mr-1 hidden sm:inline">Packs:</span>
          <button
            type="button"
            onClick={() => applyStandardPack(2)}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xs transition-colors duration-200"
          >
            2× Pack (48 pcs)
          </button>
          <button
            type="button"
            onClick={() => applyStandardPack(4)}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xs transition-colors duration-200"
          >
            4× Pack (96 pcs)
          </button>
          <button
            type="button"
            onClick={resetMatrix}
            title="Reset quantities"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xs transition-colors duration-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Standard Ratio Tag explanation */}
      <div className="flex items-center justify-between text-xs text-stone-600 bg-[#FAF8F5] p-2.5 border border-stone-200/80 rounded-xs">
        <div>
          <span className="font-semibold text-stone-800">Standard Ratio: 2-2-2-2</span>
          <span className="mx-2 text-stone-300">|</span>
          <span>Sizes: 30 (2), 32 (2), 34 (2), 36 (2) per selected wash</span>
        </div>
        <span className="text-[11px] text-stone-600 font-medium">MOQ: 24 PCS</span>
      </div>

      {/* Interactive Matrix Table */}
      <div className="overflow-x-auto border border-stone-200 bg-white rounded-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1F1E1D] text-stone-200 uppercase tracking-widest text-[11px]">
              <th className="py-2.5 px-3 font-medium">Colour / Wash</th>
              {sizes.map((s) => (
                <th key={s} className="py-2.5 px-2 text-center font-medium w-20">
                  Size {s}
                </th>
              ))}
              <th className="py-2.5 px-3 text-right font-medium w-24">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {colors.map((color) => {
              const isCurrent = activeColorId === color.id;
              return (
                <tr
                  key={color.id}
                  className={`transition-colors ${
                    isCurrent ? 'bg-blue-50/40' : 'hover:bg-neutral-50/60'
                  }`}
                >
                  {/* Colour Cell */}
                  <td className="py-2.5 px-3">
                    <button
                      type="button"
                      onClick={() => onColorSelect?.(color.id)}
                      className="flex items-center gap-2 group text-left"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-neutral-300 shrink-0 shadow-2xs"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-medium text-neutral-800 group-hover:text-neutral-950 transition-colors">
                        {color.name}
                      </span>
                    </button>
                  </td>

                  {/* Size Inputs */}
                  {sizes.map((size) => {
                    const currentVal = matrix[color.id]?.[size] || 0;
                    return (
                      <td key={size} className="py-2 px-1 text-center">
                        <div className="inline-flex items-center border border-neutral-200 bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() =>
                              handleCellChange(color.id, size, currentVal - 1)
                            }
                            className="p-1 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 transition-colors"
                            disabled={currentVal <= 0}
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={currentVal === 0 ? '' : currentVal}
                            placeholder="0"
                            onChange={(e) =>
                              handleCellChange(
                                color.id,
                                size,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-8 text-center text-xs font-semibold text-neutral-900 focus:outline-none focus:bg-amber-50/60 py-0.5 tabular-nums"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleCellChange(color.id, size, currentVal + 1)
                            }
                            className="p-1 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </td>
                    );
                  })}

                  {/* Row Total */}
                  <td className="py-2.5 px-3 text-right font-semibold text-neutral-900 tabular-nums">
                    {colorTotals[color.id] || 0} pcs
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-neutral-100/80 font-bold border-t border-neutral-200 text-neutral-900">
              <td className="py-2.5 px-3">Total by Size</td>
              {sizes.map((size) => (
                <td key={size} className="py-2.5 px-2 text-center tabular-nums">
                  {sizeTotals[size] || 0}
                </td>
              ))}
              <td className="py-2.5 px-3 text-right tabular-nums text-sm">
                {totalPieces} pcs
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* MOQ Status & Real-Time Recalculation Bar */}
      <div
        className={`p-3.5 border transition-all ${
          isMoqMet
            ? 'bg-emerald-50/60 border-emerald-200'
            : 'bg-amber-50/70 border-amber-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            {isMoqMet ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {totalPieces} / {product.moq} Pieces Selected
                </span>
                {isMoqMet ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5">
                    MOQ Met
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5">
                    MOQ Incomplete
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                {isMoqMet
                  ? 'Ready to add to wholesale order. Quantity exceeds minimum requirement.'
                  : `Please add ${neededPieces} more piece${
                      neededPieces > 1 ? 's' : ''
                    } to satisfy the wholesale minimum (24 pcs).`}
              </p>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-200/60">
            <div className="text-[11px] text-neutral-500 uppercase tracking-wide">
              Rate:{' '}
              <span className="font-semibold text-neutral-900">
                {currentUnitPrice ? `${formatBDT(currentUnitPrice)} / pc` : 'Price on Request'}
              </span>
            </div>
            <div className="font-serif-luxury text-lg font-semibold text-stone-900 tabular-nums">
              Total: {currentTotalAmount > 0 ? formatBDT(currentTotalAmount) : 'Price on Request'}
            </div>
          </div>
        </div>

        {/* Volume Tier Indicators */}
        {product.priceTiers && product.priceTiers.length > 1 && (
          <div className="mt-3 pt-2.5 border-t border-neutral-200/50 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-700">Volume Discounts:</span>
            {product.priceTiers.map((tier) => {
              const active = totalPieces >= tier.minQty;
              return (
                <span
                  key={tier.minQty}
                  className={`inline-flex items-center gap-1 ${
                    active ? 'font-bold text-emerald-700' : 'text-neutral-500'
                  }`}
                >
                  {tier.minQty}+ pcs: {formatBDT(tier.pricePerPiece)}
                  {active && ' ✓'}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
