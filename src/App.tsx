import { useState, useEffect } from 'react';
import { WholesaleProvider, useWholesale } from './context/WholesaleContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryTiles } from './components/CategoryTiles';
import { NewArrivals } from './components/NewArrivals';
import { BestSellers } from './components/BestSellers';
import { WholesaleBenefits } from './components/WholesaleBenefits';
import { WholesaleCtaBanner } from './components/WholesaleCtaBanner';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ShopPage } from './components/ShopPage';
import { CheckoutPage } from './components/CheckoutPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FaqPage } from './components/FaqPage';
import { PolicyPage } from './components/PolicyPages';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { CartDrawer } from './components/CartDrawer';
import { Product } from './types/wholesale';
import { BRAND } from './utils/constants';
import { MessageSquare } from 'lucide-react';

function MainApp() {
  const { products, openQuoteModal, openCartDrawer } = useWholesale();

  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'checkout' | 'about' | 'contact' | 'faq' | 'shipping' | 'terms' | 'privacy' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [shopSearch, setShopSearch] = useState<string>('');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'category') {
      setShopCategory(param || 'all');
      setShopSearch('');
      setCurrentView('shop');
    } else if (view === 'shop') {
      if (param === 'new-arrivals') {
        setShopCategory('new-arrivals');
      } else if (param === 'wishlist') {
        setShopCategory('wishlist');
      } else if (param === 'dark-blue' || param === 'mid-blue' || param === 'light-blue' || param === 'wholesale-packs' || param === 'denim-jeans') {
        setShopCategory(param);
        setShopSearch('');
      } else if (param && param !== 'all') {
        setShopSearch(param);
        setShopCategory('all');
      } else {
        setShopCategory('all');
        setShopSearch('');
      }
      setCurrentView('shop');
    } else {
      setCurrentView(view as any);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const flagshipProduct = products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 selection:bg-stone-900 selection:text-stone-100">
      {/* Global Header */}
      {currentView !== 'admin' && (
        <Header currentView={currentView} onNavigate={handleNavigate} />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroBanner
              onShopWholesale={() => handleNavigate('shop', 'all')}
              onExploreCollections={() => handleNavigate('shop', 'all')}
              onViewDenimPack={() => handleSelectProduct(flagshipProduct)}
            />

            <CategoryTiles
              onSelectCategory={(catId) => handleNavigate('category', catId)}
            />

            <NewArrivals
              onSelectProduct={handleSelectProduct}
              onViewAll={() => handleNavigate('shop', 'new-arrivals')}
            />

            <WholesaleBenefits />

            <BestSellers
              onSelectProduct={handleSelectProduct}
              onViewAll={() => handleNavigate('shop', 'all')}
            />

            <WholesaleCtaBanner
              onBrowseProducts={() => handleNavigate('shop', 'all')}
              onRequestQuote={() => openQuoteModal('Jack & Jones Denim Jeans (3-Wash Pack)')}
            />
          </>
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialCategory={shopCategory}
            initialSearch={shopSearch}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentView('shop')}
            onSelectProduct={handleSelectProduct}
            onProceedToCheckout={() => setCurrentView('checkout')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBack={() => setCurrentView('shop')}
            onContinueShopping={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onExploreCollections={() => handleNavigate('shop', 'all')}
            onRequestQuote={() => openQuoteModal()}
          />
        )}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'faq' && <FaqPage />}

        {currentView === 'shipping' && <PolicyPage type="shipping" />}
        {currentView === 'terms' && <PolicyPage type="terms" />}
        {currentView === 'privacy' && <PolicyPage type="privacy" />}

        {currentView === 'admin' && (
          <AdminDashboard
            onBackToStore={() => setCurrentView('home')}
            onViewProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <QuickViewModal />
      <QuoteRequestModal />
      <CartDrawer
        onCheckout={() => setCurrentView('checkout')}
        onContinueShopping={() => setCurrentView('shop')}
      />

      {/* Floating WhatsApp Contact Button */}
      {currentView !== 'admin' && (
        <a
          href={BRAND.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all hover:scale-105"
          title={`Order on WhatsApp: ${BRAND.phone}`}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="hidden sm:inline-block max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap pl-1">
            WhatsApp Hotline
          </span>
        </a>
      )}

      {/* Global Footer */}
      {currentView !== 'admin' && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <WholesaleProvider>
      <MainApp />
    </WholesaleProvider>
  );
}
