import { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useWholesale } from '../context/WholesaleContext';
import { BRAND, formatBDT } from '../utils/constants';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const { cartCount, cartTotalPieces, cartTotalAmount, wishlist, openCartDrawer } = useWholesale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', searchQuery.trim());
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Dark Blue', view: 'category', param: 'dark-blue' },
    { label: 'Mid Blue', view: 'category', param: 'mid-blue' },
    { label: 'Light Blue', view: 'category', param: 'light-blue' },
    { label: 'Standard 24-PC Pack', view: 'category', param: 'wholesale-packs' },
    { label: 'Wholesale FAQ', view: 'faq' },
    { label: 'About Us', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#1F1E1D] text-stone-300 text-[11px] py-2 px-4 font-normal tracking-widest uppercase border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-stone-300">WHOLESALE ORDERS ONLY | MINIMUM ORDER: 24 PIECES | AUTHENTIC GARMENTS</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-stone-300">
            <a
              href={`tel:${BRAND.cell}`}
              className="flex items-center gap-1.5 hover:text-stone-100 transition-colors duration-200"
            >
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>Cell: {BRAND.cell}</span>
            </a>
            <span className="text-stone-600">|</span>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-stone-100 transition-colors duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {BRAND.phone}</span>
            </a>
            <span className="text-stone-600">|</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-stone-100 transition-colors duration-200 text-[10px] tracking-widest text-stone-400 hover:underline"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Header with soft off-white backdrop */}
      <header
        className={`sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-b border-stone-200' : 'border-b border-stone-200/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
            {/* Left: Mobile hamburger & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-stone-800 hover:text-stone-950 transition-colors"
                aria-label="Open mobile navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-left group flex items-center gap-2.5"
              >
                <img
                  src={BRAND.logoUrl}
                  alt="TEN TACLES BD Logo"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 border border-stone-300 shadow-xs group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-950 uppercase font-sans">
                      TEN TACLES
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-stone-900 text-stone-100 tracking-widest">
                      BD
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-medium">
                    Wholesale Clothing Supply
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Desktop Navigation links with refined typography */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[12px] font-semibold text-stone-600 uppercase tracking-[0.12em]">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate(item.view, item.param)}
                  className={`hover:text-stone-950 transition-colors duration-200 py-1 relative ${
                    currentView === item.view ? 'text-stone-950 font-bold' : ''
                  }`}
                >
                  {item.label}
                  {currentView === item.view && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 transition-all duration-300" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-neutral-700 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => onNavigate('shop', 'wishlist')}
                className="relative p-2 text-neutral-700 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded transition-all duration-300 shadow-xs hover:shadow group"
                title="View Wholesale Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold flex items-center justify-center animate-in zoom-in duration-200">
                      {cartTotalPieces}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-stone-300 font-medium tracking-wide uppercase leading-tight">
                    Cart ({cartTotalPieces} pcs)
                  </span>
                  <span className="text-xs font-semibold leading-tight tabular-nums">
                    {formatBDT(cartTotalAmount)}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="border-t border-stone-200 bg-[#FAF8F5] px-4 py-3 animate-in fade-in duration-200">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Dark Blue, Mid Blue, Light Blue, Jack & Jones, size 32..."
                  autoFocus
                  className="w-full pl-10 pr-24 py-2.5 text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-800 text-stone-900 shadow-xs"
                />
                <Search className="w-4 h-4 absolute left-3.5 text-stone-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3.5 py-1.5 bg-stone-900 text-stone-100 text-xs font-medium hover:bg-stone-800 rounded transition-colors duration-200"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 py-6 shadow-xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4 text-sm font-medium uppercase tracking-wider text-stone-800">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    onNavigate(item.view, item.param);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 border-b border-neutral-100 flex items-center justify-between hover:text-neutral-950"
                >
                  <span>{item.label}</span>
                  <span className="text-neutral-400">→</span>
                </button>
              ))}

              <div className="pt-4 border-t border-neutral-200 space-y-2.5">
                <a
                  href={`tel:${BRAND.cell}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded"
                >
                  <Phone className="w-4 h-4" />
                  Call Cell: {BRAND.cell}
                </a>

                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded"
                >
                  <MessageSquare className="w-4 h-4" />
                  Order on WhatsApp: {BRAND.phone}
                </a>

                <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 pt-2">
                  <a
                    href={BRAND.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900"
                  >
                    Facebook
                  </a>
                  <span>·</span>
                  <a
                    href={BRAND.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900"
                  >
                    Instagram
                  </a>
                  <span>·</span>
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="hover:text-neutral-900"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
