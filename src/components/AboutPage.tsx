import { BRAND } from '../utils/constants';
import { ShieldCheck, Award, Factory, Users, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onExploreCollections: () => void;
  onRequestQuote: () => void;
}

export function AboutPage({ onExploreCollections, onRequestQuote }: AboutPageProps) {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-bold block">
            Quality Apparel · Wholesale Value
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 uppercase tracking-tight">
            ABOUT TEN TACLES BD
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Leading Bangladesh-based apparel manufacturer, importer, and bulk wholesale supplier catering to fashion retailers, boutiques, and apparel distributors across all 64 districts.
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-neutral-200 bg-neutral-900">
          <img
            src="/assets/aistudio/Gemini_Generated_Image_h67kj2h67kj2h67k_d0104502.jpg"
            alt="Ten Tacles BD Authentic Apparel"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white flex items-center gap-4">
              <img
                src={BRAND.logoUrl}
                alt="TEN TACLES BD Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/80 object-cover shadow-md shrink-0"
              />
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Authentic Garment Manufacturing
                </span>
                <h2 className="text-lg sm:text-2xl font-black uppercase">
                  TEN TACLES BD Wholesale Supply
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2">
              Our Wholesale Mission
            </h3>
            <p>
              Founded in Dhaka, <strong>TEN TACLES BD</strong> bridges the gap between high-grade garment export manufacturing and local retail shop owners. We eliminate multiple middlemen markups, delivering export-standard denim jeans directly to retailers at genuine wholesale rates.
            </p>
            <p>
              We understand retail business dynamics: shop owners need reliable sizing ratios, color variety, and consistent fabric weight without tying up excessive capital. That is why we instituted our standard <strong>2-2-2-2 size ratio</strong> and an accessible <strong>24-piece minimum order quantity</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2">
              Quality & Sourcing Rigor
            </h3>
            <p>
              Every garment in our catalog, such as our signature <strong>Jack & Jones Slim Glenn Stretch Denim line</strong>, is produced from 11.5 oz ring-spun combed cotton with 2% elastane for lasting recovery.
            </p>
            <p>
              Our production facilities in Dhaka and Gazipur utilize computerized enzyme washing, automated bar-tacking, and rigorous 4-point fabric inspection. When our cartons arrive at your boutique or shop counter, every piece is polybagged, tagged, and barcode-ready.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-200">
          <div className="p-5 bg-neutral-50 border border-neutral-200 space-y-2">
            <Factory className="w-6 h-6 text-neutral-900" />
            <h4 className="font-bold text-neutral-950 uppercase text-xs">Direct Factory Invoicing</h4>
            <p className="text-xs text-neutral-600">
              Clear, transparent pricing in BDT with volume tier discounts on orders exceeding 48 and 96 pieces.
            </p>
          </div>

          <div className="p-5 bg-neutral-50 border border-neutral-200 space-y-2">
            <Award className="w-6 h-6 text-neutral-900" />
            <h4 className="font-bold text-neutral-950 uppercase text-xs">Standard 2-2-2-2 Ratios</h4>
            <p className="text-xs text-neutral-600">
              Evenly distributed size batches across sizes 30, 32, 34, 36 to ensure balanced sales velocity in retail stores.
            </p>
          </div>

          <div className="p-5 bg-neutral-50 border border-neutral-200 space-y-2">
            <Users className="w-6 h-6 text-neutral-900" />
            <h4 className="font-bold text-neutral-950 uppercase text-xs">Retail Partner Support</h4>
            <p className="text-xs text-neutral-600">
              Direct access to our Dhaka sales team via WhatsApp for instant stock reservations and re-orders.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-8 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreCollections}
            className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Explore Wholesale Collections
          </button>
          <button
            onClick={onRequestQuote}
            className="px-6 py-3.5 border border-neutral-300 hover:border-neutral-950 text-neutral-900 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Request Custom Quote
          </button>
        </div>
      </div>
    </div>
  );
}
