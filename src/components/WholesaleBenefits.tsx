import { Tag, Users, Palette, ClipboardCheck } from 'lucide-react';

export function WholesaleBenefits() {
  const benefits = [
    {
      icon: Tag,
      title: 'Wholesale Pricing',
      description:
        'Tiered volume pricing starting from 24 pcs. Up to 12% additional margin discount on 96+ piece orders.',
    },
    {
      icon: Users,
      title: 'Bulk Order Support',
      description:
        'Direct WhatsApp support from our Dhaka headquarters. Fast verification and stock confirmation.',
    },
    {
      icon: Palette,
      title: 'Multiple Colour Options',
      description:
        'Standard 3-wash color assortment (Dark Blue, Mid Blue, Light Blue) pre-packed in uniform 2-2-2-2 ratios.',
    },
    {
      icon: ClipboardCheck,
      title: 'Order Management',
      description:
        'Formal wholesale invoices with VAT compliance, physical inspection option, and tracked courier dispatch.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F5F2EB]/50 border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.24em] text-stone-500 font-medium block mb-1">
            Why Partner With Ten Tacles BD
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-stone-900">
            Wholesale Value Advantage
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-white p-6 border border-stone-200/80 rounded-xs space-y-3 hover:shadow-[0_14px_30px_-8px_rgba(28,25,23,0.08)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <div className="w-10 h-10 rounded-xs bg-[#1F1E1D] text-white flex items-center justify-center shadow-xs">
                  <Icon className="w-5 h-5 text-amber-300" />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                  {b.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
