import { ArrowRight, MessageSquare } from 'lucide-react';
import { BRAND } from '../utils/constants';

interface WholesaleCtaBannerProps {
  onBrowseProducts: () => void;
  onRequestQuote: () => void;
}

export function WholesaleCtaBanner({
  onBrowseProducts,
  onRequestQuote,
}: WholesaleCtaBannerProps) {
  return (
    <section className="relative bg-[#181716] text-white overflow-hidden py-18 sm:py-24">
      {/* Background with user's authentic denim photography */}
      <img
        src="/assets/aistudio/Gemini_Generated_Image_s3uai5s3uai5s3ua_f690c583.jpg"
        alt="Authentic Denim Wholesale"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-20 mix-blend-luminosity scale-102 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#181716] via-[#181716]/92 to-[#181716]/75" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl space-y-4">
          <span className="text-[11px] uppercase tracking-[0.24em] text-amber-200/90 font-medium block">
            Nationwide Distribution Across Bangladesh
          </span>

          <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase tracking-wide text-stone-100 leading-tight">
            Ready To Stock Your Retail Store?
          </h2>

          <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed max-w-xl font-normal">
            Explore our collections and build your wholesale order. Minimum order 24 pieces per product with custom size matrix or instant standard 2-2-2-2 pack configurations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onBrowseProducts}
              className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-white text-stone-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group rounded-xs"
            >
              <span>BROWSE PRODUCTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
            </button>

            <button
              type="button"
              onClick={onRequestQuote}
              className="px-6 py-3.5 border border-stone-400/50 hover:border-stone-200 text-stone-200 hover:text-white font-medium text-xs uppercase tracking-widest transition-all duration-300 hover:bg-white/10 rounded-xs"
            >
              REQUEST A QUOTE
            </button>

            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 rounded-xs shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WHATSAPP INQUIRY</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
