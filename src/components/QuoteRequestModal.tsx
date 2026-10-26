import { useState } from 'react';
import { useWholesale } from '../context/WholesaleContext';
import { BRAND } from '../utils/constants';
import { X, MessageSquare, CheckCircle2, ShieldCheck } from 'lucide-react';

export function QuoteRequestModal() {
  const { isQuoteModalOpen, closeQuoteModal, quotePresetProduct, submitQuoteRequest } = useWholesale();

  const [form, setForm] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    productsInterested: quotePresetProduct || 'Jack & Jones Denim Jeans (3-Wash)',
    estimatedQuantity: 48,
    preferredColors: 'Dark Blue, Mid Blue, Light Blue',
    preferredSizes: '30, 32, 34, 36 (2-2-2-2 Ratio)',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isQuoteModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError('Name and Phone / WhatsApp number are required.');
      return;
    }

    submitQuoteRequest(form);
    setSubmitted(true);
  };

  const directWhatsAppQuote = () => {
    const text = `Assalamu Alaikum Ten Tacles BD Team,

I would like to request a custom wholesale quotation:
*Buyer:* ${form.name}${form.businessName ? ` (${form.businessName})` : ''}
*Phone:* ${form.phone}
*Product of Interest:* ${form.productsInterested}
*Est. Quantity:* ${form.estimatedQuantity} pieces
*Preferred Washes:* ${form.preferredColors}
*Preferred Sizes:* ${form.preferredSizes}
*Notes:* ${form.notes || 'N/A'}

Please provide tier discount rates and delivery timeline.`;

    window.open(`https://wa.me/${BRAND.rawPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] p-6 sm:p-8 border border-stone-200 rounded-xs shadow-2xl animate-in zoom-in-95 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <button
          type="button"
          onClick={closeQuoteModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-normal text-stone-900">
              Quote Request Received
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Thank you, {form.name}. Our wholesale department in Shyamoli (Sher-e-Bangla Nagar), Dhaka has received your inquiry. We will contact you via WhatsApp/Phone within 2 hours with an official quotation.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={directWhatsAppQuote}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Quote Discussion on WhatsApp</span>
              </button>
            </div>
            <button
              type="button"
              onClick={closeQuoteModal}
              className="text-xs text-stone-500 hover:text-stone-900 underline block mx-auto pt-2"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium block mb-1">
                Custom Volume & Enterprise Supply
              </span>
              <h2 className="font-serif-luxury text-2xl font-normal text-stone-900 tracking-wide">
                Request Wholesale Quote
              </h2>
              <p className="text-stone-500 text-[11px] mt-0.5 font-normal">
                Have specific volume requirements, custom ratio distributions, or recurring store shipments?
              </p>
            </div>

            {error && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-[11px]">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Your Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  placeholder="e.g. Dhaka Denim Hub"
                  className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Phone / WhatsApp <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01716-032319"
                  className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Estimated Quantity (Pcs)
                </label>
                <input
                  type="number"
                  min="24"
                  step="24"
                  value={form.estimatedQuantity}
                  onChange={(e) => setForm({ ...form, estimatedQuantity: parseInt(e.target.value) || 24 })}
                  className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-semibold mb-1">
                  Product(s) of Interest
                </label>
                <input
                  type="text"
                  value={form.productsInterested}
                  onChange={(e) => setForm({ ...form, productsInterested: e.target.value })}
                  placeholder="Jack & Jones Dark Blue / Mid Blue / Light Blue"
                  className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-semibold mb-1">
                  Special Instructions or Delivery District
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Need delivery to Sylhet Sadar within 4 days, require custom size 34 & 36 majority."
                  className="w-full p-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Submit Quote Request
              </button>

              <button
                type="button"
                onClick={directWhatsAppQuote}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
