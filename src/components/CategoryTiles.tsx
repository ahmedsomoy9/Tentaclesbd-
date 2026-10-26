import { ArrowRight } from 'lucide-react';

interface CategoryTilesProps {
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryTiles({ onSelectCategory }: CategoryTilesProps) {
  const categories = [
    {
      id: 'dark-blue',
      title: 'DARK BLUE DENIM',
      subtitle: 'Whiskered Indigo Wash',
      image: '/assets/aistudio/Gemini_Generated_Image_h67kj2h67kj2h67k_d0104502.jpg',
      badge: 'DARK BLUE',
    },
    {
      id: 'mid-blue',
      title: 'MID BLUE DENIM',
      subtitle: 'Classic Medium Indigo',
      image: '/assets/aistudio/Gemini_Generated_Image_sluavisluavislua_8cc81a63.jpg',
      badge: 'MID BLUE',
    },
    {
      id: 'light-blue',
      title: 'LIGHT BLUE DENIM',
      subtitle: 'Stone Washed Indigo',
      image: '/assets/aistudio/Gemini_Generated_Image_495dxo495dxo495d_64694437.jpg',
      badge: 'LIGHT BLUE',
    },
    {
      id: 'wholesale-packs',
      title: '24-PC STANDARD PACK',
      subtitle: '2-2-2-2 Ratio (3 Washes)',
      image: '/assets/aistudio/Gemini_Generated_Image_s3uai5s3uai5s3ua_f690c583.jpg',
      badge: 'MOQ: 24 PCS',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading with stylish typography */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-200/70">
          <div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-stone-500 font-medium block mb-1">
              Curated Wholesale Catalog
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-stone-900">
              Shop by Denim Category
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold uppercase tracking-widest text-stone-800 hover:text-stone-950 flex items-center gap-2 group transition-colors duration-200"
          >
            <span>All Collections</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
          </button>
        </div>

        {/* 4 Category Tiles Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative cursor-pointer overflow-hidden bg-stone-100 aspect-[3/4] flex flex-col justify-end p-5 sm:p-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-12px_rgba(28,25,23,0.12)] border border-stone-200/60 rounded-xs"
            >
              {/* Image with buttery smooth hover zoom */}
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181716]/90 via-[#181716]/40 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

              {/* Tag / Badge */}
              <span className="absolute top-4 left-4 text-[10px] uppercase font-semibold tracking-widest text-stone-900 bg-[#FAF8F5]/95 px-2.5 py-1 z-10 shadow-xs backdrop-blur-xs rounded-xs">
                {cat.badge}
              </span>

              {/* Content */}
              <div className="relative z-10 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-stone-300 font-normal block">
                  {cat.subtitle}
                </span>
                <h3 className="font-serif-luxury text-lg sm:text-xl font-normal text-stone-100 tracking-wide group-hover:text-amber-200 transition-colors duration-300">
                  {cat.title}
                </h3>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-medium text-stone-200 group-hover:translate-x-1.5 transition-transform duration-300 ease-out">
                  <span>Explore Packs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
