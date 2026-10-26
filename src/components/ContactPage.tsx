import { useState } from 'react';
import { BRAND } from '../utils/constants';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    shopName: '',
    phone: '',
    email: '',
    subject: 'Wholesale Stock Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setError('Please fill in your name, phone number, and inquiry message.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const openWhatsApp = () => {
    const text = `Assalamu Alaikum Ten Tacles BD,
My name is ${form.name || 'Retail Buyer'}${form.shopName ? ` from ${form.shopName}` : ''}.
Phone: ${form.phone || 'N/A'}
Inquiry: ${form.message || 'I would like to inquire about wholesale clothing packs.'}`;
    window.open(`https://wa.me/${BRAND.rawPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-bold block">
            Dhaka Headquarters & Showroom
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight">
            CONTACT TEN TACLES BD
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Reach out directly for wholesale order bookings, sample inspection visits, or custom export lots.
          </p>
        </div>

        {/* 2-Column: Left Contact Cards & Official Links, Right Validated Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Priority Card */}
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                    Instant WhatsApp Hotline
                  </span>
                  <a
                    href={BRAND.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-extrabold text-neutral-950 hover:underline"
                  >
                    {BRAND.phone}
                  </a>
                </div>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Connect directly with our Dhaka sales representative for stock availability checks, catalog PDFs, and invoice confirmations.
              </p>
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Direct Cell Phone Card */}
            <div className="p-6 bg-neutral-900 text-white border border-neutral-800 rounded space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                    Direct Cell Call
                  </span>
                  <a
                    href={`tel:${BRAND.cell}`}
                    className="text-base font-extrabold text-white hover:text-amber-400"
                  >
                    {BRAND.cell}
                  </a>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Call our direct cell line for urgent stock bookings, sample visit confirmations, and pricing queries.
              </p>
              <a
                href={`tel:${BRAND.cell}`}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {BRAND.cell}</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2">
                Official Social Media Channels
              </h3>

              <div className="space-y-3 text-xs">
                <a
                  href={BRAND.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-neutral-200 hover:border-neutral-900 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-bold text-neutral-950 block">Facebook Page</span>
                      <span className="text-[10px] text-neutral-500">Ten Tacles BD Official</span>
                    </div>
                  </div>
                  <span className="text-neutral-400 group-hover:text-neutral-950">→</span>
                </a>

                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-neutral-200 hover:border-neutral-900 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <div>
                      <span className="font-bold text-neutral-950 block">Instagram</span>
                      <span className="text-[10px] text-neutral-500">@tentaclesbd</span>
                    </div>
                  </div>
                  <span className="text-neutral-400 group-hover:text-neutral-950">→</span>
                </a>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="p-6 bg-white border border-neutral-200 space-y-3 text-xs text-neutral-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2">
                Wholesale Office & Showroom
              </h3>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-950 block">Showroom Location:</strong>
                  <span className="leading-snug">{BRAND.showroomAddress}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-950 block">Phone & Cell:</strong>
                  <span>Cell: <a href={`tel:${BRAND.cell}`} className="font-semibold text-neutral-950 hover:underline">{BRAND.cell}</a> | Hotline: {BRAND.phone}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-950 block">Operational Hours:</strong>
                  <span>Saturday – Thursday: 10:00 AM – 8:00 PM (Friday Closed)</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-950 block">Wholesale Email:</strong>
                  <span>{BRAND.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-neutral-200 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">
                Direct Sales Message
              </span>
              <h2 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
                Send an Inquiry
              </h2>
              <p className="text-xs text-neutral-500">
                Submit your query below and our sales manager will reply within 2 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-950 uppercase">Message Dispatched</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Thank you for reaching out. A representative from our Dhaka sales desk has received your request and will call or text your number ({form.phone}).
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700"
                  >
                    Continue Conversation on WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Mahfuzur Rahman"
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Shop / Business Name
                    </label>
                    <input
                      type="text"
                      value={form.shopName}
                      onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                      placeholder="e.g. Dhaka Denim Store"
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Mobile / WhatsApp <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="01716-032319"
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="buyer@domain.com"
                      className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Wholesale Stock Inquiry">Wholesale Stock Inquiry</option>
                    <option value="Jack & Jones Denim Jeans 24-Piece Pack">Jack & Jones Denim Jeans 24-Piece Pack</option>
                    <option value="Custom Ratio / Enterprise Order (100+ pcs)">Custom Ratio / Enterprise Order (100+ pcs)</option>
                    <option value="Showroom Sample Visit">Showroom Sample Visit (Shyamoli, Dhaka)</option>
                    <option value="Courier / Payment Query">Courier / Payment Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Your Message / Requirements <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Specify sizes, washes, quantity, and your delivery district..."
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>

                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Directly</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
