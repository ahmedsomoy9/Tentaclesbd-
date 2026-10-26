import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { BRAND } from '../utils/constants';

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the Minimum Order Quantity (MOQ) at Ten Tacles BD?',
      a: 'Our strict wholesale MOQ is 24 pieces per product line. This allows us to offer factory-direct wholesale pricing to retailers while maintaining consistent production run quality.',
    },
    {
      q: 'What is the "Standard 2-2-2-2 Pack Ratio"?',
      a: 'The 2-2-2-2 ratio is our industry-standard sizing breakdown designed for optimal retail sell-through. For each wash/color, you receive 2 pieces of size 30, 2 pieces of size 32, 2 pieces of size 34, and 2 pieces of size 36 (8 pieces per color). Across our 3 authentic washes (Dark Blue, Mid Blue, and Light Blue), this totals exactly 24 pieces.',
    },
    {
      q: 'Can I customize the sizes and colors instead of taking the standard pack?',
      a: 'Yes! In our flexible wholesale ordering matrix, you can specify custom piece counts for each size and wash combination, as long as your total order meets or exceeds the 24-piece MOQ.',
    },
    {
      q: 'How does volume tier wholesale pricing work?',
      a: 'Our wholesale pricing features volume tier discounts for larger orders (e.g. 48+ and 96+ pieces). Contact our WhatsApp desk or submit an order inquiry to receive the current master lot pricing and customized volume tiers.',
    },
    {
      q: 'How do you handle courier delivery across Bangladesh?',
      a: 'Inside Dhaka City, orders are delivered within 24 to 48 hours via local parcel logistics (flat ৳300). For districts outside Dhaka (Chittagong, Sylhet, Rajshahi, Khulna, etc.), cartons are dispatched via Sundarban Courier, SA Paribahan, or Korotoa Courier within 48 to 72 hours (flat ৳650 parcel packaging). You receive a tracked booking slip.',
    },
    {
      q: 'Can I physically inspect the parcel before settling payment?',
      a: 'Yes. With our Cash on Delivery / Inspection option at courier branch counters, you can verify that the sealed cartons match your order reference prior to paying the courier counter officer.',
    },
    {
      q: 'Are samples available before placing a bulk order?',
      a: 'Yes. You are welcome to visit our showroom at HOUSE NO. 35/F/8, Ma Vila Goli, Road No.2, Shyamoli, Sher-e-Bangla Nagar, Dhaka-1207 to inspect physical samples, fabric hand-feel, and wash quality. Alternatively, call our cell at 01329-729205 or contact our WhatsApp desk at +880 1716-032319 to request a single sample piece shipment.',
    },
    {
      q: 'What is your return and exchange policy for defective pieces?',
      a: 'While all export lots undergo 4-point QC inspections, if any factory defect (zipper defect, fabric hole, or miss-matched size tag) is discovered upon unboxing, notify us via WhatsApp within 48 hours for immediate piece replacement or credit note adjustment.',
    },
  ];

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-bold block">
            Wholesale Ordering Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            Everything you need to know about our minimum order quantities, 2-2-2-2 ratio, delivery timelines, and payment options.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-neutral-600">
                    {faq.q}
                  </span>
                  <span className="text-neutral-400 group-hover:text-neutral-900 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pr-8 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Helpline Card */}
        <div className="p-6 bg-neutral-50 border border-neutral-200 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-neutral-700 mx-auto" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
            Have a Specific Question Not Listed Here?
          </h3>
          <p className="text-xs text-neutral-600 max-w-md mx-auto">
            Speak directly with our wholesale representative in Dhaka. We are available Saturday to Thursday via phone and WhatsApp.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${BRAND.cell}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Call Cell: {BRAND.cell}</span>
            </a>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Chat on WhatsApp: {BRAND.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
