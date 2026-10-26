import { useState } from 'react';
import { BRAND } from '../utils/constants';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Facebook,
  Instagram,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid business email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterSubscribed(true);
    // In production, would submit to mailer backend
  };

  return (
    <footer className="bg-[#181716] text-stone-200 border-t border-stone-800/80">
      {/* Newsletter Strip */}
      <div className="border-b border-stone-800/80 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="font-serif-luxury text-lg sm:text-xl font-normal tracking-wide uppercase text-stone-100">
              WHOLESALE INVENTORY ALERTS
            </h3>
            <p className="text-xs text-stone-400 mt-1 font-normal">
              Be the first to receive notifications on new denim wash drops, export excess lots, and seasonal pricing tiers.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium bg-emerald-950/40 border border-emerald-800/80 px-4 py-2.5 rounded-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you. You have been subscribed for wholesale catalog updates.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter shop owner / business email"
                  className="px-4 py-2.5 bg-[#23211F] border border-stone-700/80 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-stone-400 flex-1 rounded-xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-white text-stone-900 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 rounded-xs shadow-xs"
                >
                  Subscribe
                </button>
              </form>
            )}
            {newsletterError && (
              <p className="text-[11px] text-rose-400 mt-1">{newsletterError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={BRAND.logoUrl}
                alt="TEN TACLES BD Logo"
                className="w-12 h-12 rounded-full border border-neutral-700 object-cover shadow-sm shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-100 uppercase font-sans">
                    TEN TACLES
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#FAF8F5] text-stone-900 tracking-widest rounded-xs">
                    BD
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium">
                  Wholesale Clothing Supply
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm font-normal">
              TEN TACLES BD is a premier Bangladesh wholesale apparel distributor. We specialize in export-grade denim jeans and curated apparel packs designed specifically for clothing retailers, boutiques, and bulk distributors.
            </p>

            <div className="pt-2 space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span className="leading-snug text-stone-300">{BRAND.showroomAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span>
                  Hotline: <a href={BRAND.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">{BRAND.phone}</a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span>
                  Cell: <a href={`tel:${BRAND.cell}`} className="hover:text-emerald-400 font-semibold transition-colors">{BRAND.cell}</a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span>Email: {BRAND.email}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-3 flex items-center gap-3">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xs bg-[#23211F] hover:bg-emerald-600 text-stone-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs"
                title="WhatsApp Direct"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={BRAND.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xs bg-[#23211F] hover:bg-blue-600 text-stone-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xs bg-[#23211F] hover:bg-pink-600 text-stone-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs"
                title="Instagram @tentaclesbd"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-normal uppercase tracking-widest text-stone-200 border-b border-stone-800/80 pb-2">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'all')}
                  className="hover:text-white transition-colors"
                >
                  All Denim Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'dark-blue')}
                  className="hover:text-white transition-colors"
                >
                  Dark Blue Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'mid-blue')}
                  className="hover:text-white transition-colors"
                >
                  Mid Blue Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'light-blue')}
                  className="hover:text-white transition-colors"
                >
                  Light Blue Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'wholesale-packs')}
                  className="hover:text-white transition-colors"
                >
                  24-PC Wholesale Pack
                </button>
              </li>
            </ul>
          </div>

          {/* Wholesale Info */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-normal uppercase tracking-widest text-stone-200 border-b border-stone-800/80 pb-2">
              Wholesale Terms
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-stone-100 transition-colors duration-200"
                >
                  Wholesale FAQ & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quote')}
                  className="hover:text-stone-100 transition-colors duration-200"
                >
                  Request Bulk Quote
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shipping')}
                  className="hover:text-stone-100 transition-colors duration-200"
                >
                  Shipping & Courier Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-stone-100 transition-colors duration-200"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-stone-100 transition-colors duration-200"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Wholesale Support & Quick Order */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-normal uppercase tracking-widest text-stone-200 border-b border-stone-800/80 pb-2">
              Quick Contact
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <p>
                <strong className="text-white block">WhatsApp Hotline:</strong>
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {BRAND.phone}
                </a>
              </p>
              <p>
                <strong className="text-white block">Cell Phone:</strong>
                <a
                  href={`tel:${BRAND.cell}`}
                  className="text-white hover:text-emerald-400 hover:underline font-semibold"
                >
                  {BRAND.cell}
                </a>
              </p>
              <p>
                <strong className="text-white block">Business Hours:</strong>
                Saturday – Thursday
                <br />
                10:00 AM – 8:00 PM (BST)
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline underline-offset-4"
                >
                  <span>Submit Inquiry</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved. Dhaka, Bangladesh.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Minimum Order: 24 Pieces</span>
            <span>·</span>
            <span>Standard 2-2-2-2 Pack Ratio</span>
            <span>·</span>
            <span>Nationwide Courier</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
