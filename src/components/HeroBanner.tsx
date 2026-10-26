import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Truck, Layers } from 'lucide-react';

interface HeroBannerProps {
  onShopWholesale: () => void;
  onExploreCollections: () => void;
  onViewDenimPack: () => void;
}

export function HeroBanner({
  onShopWholesale,
  onExploreCollections,
  onViewDenimPack,
}: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/assets/aistudio/Gemini_Generated_Image_h67kj2h67kj2h67k_d0104502.jpg',
      badge: 'TEN TACLES BD · WHOLESALE DENIM JEANS',
      headline: 'WHOLESALE FASHION. MADE FOR BUSINESS.',
      subtext:
        'Discover quality apparel in bulk for retailers, resellers, and growing businesses. Available in standard 2-2-2-2 size ratios across 3 authentic washes.',
      primaryCta: 'SHOP WHOLESALE',
      secondaryCta: 'EXPLORE COLLECTIONS',
      onPrimary: onShopWholesale,
      onSecondary: onExploreCollections,
    },
    {
      id: 2,
      image: '/assets/aistudio/Gemini_Generated_Image_exfafrexfafrexfa_c84807af.jpg',
      badge: 'Authentic 3-Wash Line · MOQ 24 Pieces',
      headline: 'JACK & JONES SLIM GLENN DENIM JEANS',
      subtext:
        'Authentic 3-wash collection in Dark Blue, Mid Blue, and Light Blue. Engineered for clothing stores with guaranteed 24-piece wholesale packs.',
      primaryCta: 'SELECT 24-PC PACK',
      secondaryCta: 'VIEW DENIM DETAILS',
      onPrimary: onViewDenimPack,
      onSecondary: onViewDenimPack,
    },
  ];

  // Auto advance slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full bg-[#181716] text-white overflow-hidden">
      {/* Edge-to-Edge Hero Slider */}
      <div className="relative h-[480px] sm:h-[560px] lg:h-[640px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Photography with Slow Smooth Ken Burns drift */}
              <div className="w-full h-full overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.headline}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center lg:object-[center_35%] transition-transform duration-[8000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#181716]/90 via-[#181716]/60 to-[#181716]/25 lg:from-[#181716]/92 lg:via-[#181716]/50 lg:to-transparent" />

              {/* Text Overlay with stylish editorial serif & soft off-white elements */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
                  <div className={`max-w-2xl space-y-4 transition-all duration-700 ease-out delay-100 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <span className="inline-block text-xs uppercase tracking-[0.24em] text-amber-200/90 font-medium border-b border-amber-200/30 pb-1">
                      {slide.badge}
                    </span>

                    <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-normal tracking-wide text-stone-100 uppercase leading-[1.08] text-balance">
                      {slide.headline}
                    </h1>

                    <p className="text-sm sm:text-base text-stone-300/90 leading-relaxed max-w-xl font-normal">
                      {slide.subtext}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={slide.onPrimary}
                        className="px-7 py-3.5 bg-[#FAF8F5] hover:bg-white text-stone-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group rounded-xs"
                      >
                        <span>{slide.primaryCta}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
                      </button>

                      <button
                        type="button"
                        onClick={slide.onSecondary}
                        className="px-6 py-3.5 border border-stone-400/50 hover:border-stone-200 text-stone-200 hover:text-white font-medium text-xs uppercase tracking-widest transition-all duration-300 hover:bg-white/10 rounded-xs"
                      >
                        {slide.secondaryCta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows with smooth glassmorphism */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-black/65 text-stone-200 hover:text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/15 hover:scale-105 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-black/65 text-stone-200 hover:text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/15 hover:scale-105 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Dots with smooth springy expansion */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 ease-out rounded-full ${
                i === currentSlide ? 'w-8 bg-[#FAF8F5]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Strip beneath Hero in warm charcoal */}
      <div className="border-t border-stone-800/80 bg-[#141312] py-4 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-amber-300/90 shrink-0" />
            <div>
              <span className="font-semibold text-stone-100 block">Standard 2-2-2-2 Ratio</span>
              <span className="text-stone-400 text-[11px]">Sizes 30, 32, 34, 36</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-stone-100 block">MOQ: 24 Pieces</span>
              <span className="text-stone-400 text-[11px]">Strict wholesale tier pricing</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <span className="font-semibold text-stone-100 block">All-Bangladesh Delivery</span>
              <span className="text-stone-400 text-[11px]">Dhaka & 64 Districts via SA / Sundarban</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full border border-amber-300/80 flex items-center justify-center text-amber-300 font-medium text-xs shrink-0">
              ৳
            </span>
            <div>
              <span className="font-semibold text-stone-100 block">Transparent BDT Pricing</span>
              <span className="text-stone-400 text-[11px]">Wholesale invoices & VAT support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
