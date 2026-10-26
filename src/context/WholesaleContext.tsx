import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  WholesaleOrder,
  WholesaleQuoteRequest,
  CustomerDetails,
} from '../types/wholesale';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

interface WholesaleContextType {
  products: Product[];
  cart: CartItem[];
  orders: WholesaleOrder[];
  quoteRequests: WholesaleQuoteRequest[];
  wishlist: string[];
  cartCount: number;
  cartTotalAmount: number;
  cartTotalPieces: number;
  quickViewProduct: Product | null;
  isCartDrawerOpen: boolean;
  isQuoteModalOpen: boolean;
  quotePresetProduct: string;
  // Actions
  addToCart: (product: Product, matrix: Record<string, Record<number, number>>) => { success: boolean; error?: string };
  updateCartItem: (cartItemId: string, matrix: Record<string, Record<number, number>>) => { success: boolean; error?: string };
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  submitOrder: (customer: CustomerDetails, paymentMethod: WholesaleOrder['paymentMethod']) => WholesaleOrder;
  submitQuoteRequest: (quote: Omit<WholesaleQuoteRequest, 'id' | 'createdAt' | 'status'>) => WholesaleQuoteRequest;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  openQuoteModal: (productName?: string) => void;
  closeQuoteModal: () => void;
  // Admin functions
  updateProduct: (updated: Product) => void;
  updateOrderStatus: (orderId: string, status: WholesaleOrder['status']) => void;
}

const WholesaleContext = createContext<WholesaleContextType | undefined>(undefined);

export function WholesaleProvider({ children }: { children: React.ReactNode }) {
  // Load products from localStorage or fallback, ensuring invented products are filtered
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      localStorage.removeItem('tentacles_products');
      localStorage.removeItem('tentacles_products_v2');
      localStorage.removeItem('tentacles_products_v3');
      localStorage.removeItem('tentacles_products_v4');
      localStorage.removeItem('tentacles_products_v5');
      localStorage.removeItem('tentacles_products_v6');
      localStorage.removeItem('tentacles_products_v7');
      const saved = localStorage.getItem('tentacles_products_v8');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const validIds = new Set(INITIAL_PRODUCTS.map((p) => p.id));
        const filtered = parsed.filter((p) => validIds.has(p.id));
        if (filtered.length === INITIAL_PRODUCTS.length) return filtered;
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tentacles_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<WholesaleOrder[]>(() => {
    try {
      const saved = localStorage.getItem('tentacles_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Quote Requests
  const [quoteRequests, setQuoteRequests] = useState<WholesaleQuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem('tentacles_quotes');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tentacles_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePresetProduct, setQuotePresetProduct] = useState('');

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('tentacles_products_v8', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tentacles_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tentacles_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tentacles_quotes', JSON.stringify(quoteRequests));
  }, [quoteRequests]);

  useEffect(() => {
    localStorage.setItem('tentacles_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Calculate pricing based on volume tiers
  const calculateUnitPrice = (product: Product, quantity: number): number => {
    const basePrice = product.wholesalePrice || 0;
    if (basePrice === 0 || !product.priceTiers || product.priceTiers.length === 0) {
      return basePrice;
    }
    // Sort descending by minQty
    const sortedTiers = [...product.priceTiers].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sortedTiers) {
      if (quantity >= tier.minQty) {
        return tier.pricePerPiece;
      }
    }
    return basePrice;
  };

  const countMatrixPieces = (matrix: Record<string, Record<number, number>>): number => {
    let count = 0;
    Object.values(matrix).forEach((sizes) => {
      Object.values(sizes).forEach((qty) => {
        count += Number(qty) || 0;
      });
    });
    return count;
  };

  // Add to Cart
  const addToCart = (product: Product, matrix: Record<string, Record<number, number>>) => {
    const totalPieces = countMatrixPieces(matrix);
    if (totalPieces < product.moq) {
      return {
        success: false,
        error: `Minimum order for this product is ${product.moq} pieces. You have selected ${totalPieces} pieces.`,
      };
    }

    const unitPrice = calculateUnitPrice(product, totalPieces);
    const subtotal = totalPieces * unitPrice;

    // Check if an existing line item for this product exists
    const existingIndex = cart.findIndex((item) => item.productId === product.id);

    if (existingIndex > -1) {
      // Merge matrices or replace with updated selection
      const updated = [...cart];
      const existing = updated[existingIndex];
      const mergedMatrix: Record<string, Record<number, number>> = JSON.parse(JSON.stringify(existing.matrix));

      Object.entries(matrix).forEach(([colorId, sizes]) => {
        if (!mergedMatrix[colorId]) mergedMatrix[colorId] = {};
        Object.entries(sizes).forEach(([size, qty]) => {
          const s = Number(size);
          mergedMatrix[colorId][s] = (mergedMatrix[colorId][s] || 0) + Number(qty);
        });
      });

      const newPieces = countMatrixPieces(mergedMatrix);
      const newUnitPrice = calculateUnitPrice(product, newPieces);

      updated[existingIndex] = {
        ...existing,
        matrix: mergedMatrix,
        totalPieces: newPieces,
        unitPrice: newUnitPrice,
        subtotal: newPieces * newUnitPrice,
      };
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        product,
        matrix,
        totalPieces,
        unitPrice,
        subtotal,
      };
      setCart((prev) => [newItem, ...prev]);
    }

    setIsCartDrawerOpen(true);
    return { success: true };
  };

  // Update Cart Item
  const updateCartItem = (cartItemId: string, matrix: Record<string, Record<number, number>>) => {
    const existing = cart.find((item) => item.id === cartItemId);
    if (!existing) return { success: false, error: 'Item not found in cart' };

    const totalPieces = countMatrixPieces(matrix);
    if (totalPieces < existing.product.moq) {
      return {
        success: false,
        error: `Minimum order for ${existing.product.name} is ${existing.product.moq} pieces. You have ${totalPieces} selected.`,
      };
    }

    const unitPrice = calculateUnitPrice(existing.product, totalPieces);
    const subtotal = totalPieces * unitPrice;

    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? { ...item, matrix, totalPieces, unitPrice, subtotal }
          : item
      )
    );
    return { success: true };
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Submit wholesale order
  const submitOrder = (
    customer: CustomerDetails,
    paymentMethod: WholesaleOrder['paymentMethod']
  ): WholesaleOrder => {
    const orderNumber = `TT-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalPieces = cart.reduce((sum, item) => sum + item.totalPieces, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const shippingEstimate = customer.district.toLowerCase() === 'dhaka' ? 300 : 650;
    const totalAmount = subtotal + shippingEstimate;

    const newOrder: WholesaleOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
      customer,
      items: [...cart],
      totalPieces,
      subtotal,
      shippingEstimate,
      totalAmount,
      paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Submit quote request
  const submitQuoteRequest = (
    quoteData: Omit<WholesaleQuoteRequest, 'id' | 'createdAt' | 'status'>
  ): WholesaleQuoteRequest => {
    const newQuote: WholesaleQuoteRequest = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setQuoteRequests((prev) => [newQuote, ...prev]);
    return newQuote;
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Quick view handlers
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Cart drawer handlers
  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  // Quote modal handlers
  const openQuoteModal = (productName = '') => {
    setQuotePresetProduct(productName);
    setIsQuoteModalOpen(true);
  };
  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setQuotePresetProduct('');
  };

  // Admin handlers
  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const updateOrderStatus = (orderId: string, status: WholesaleOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const cartCount = cart.length;
  const cartTotalAmount = cart.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const cartTotalPieces = cart.reduce((sum, item) => sum + item.totalPieces, 0);

  return (
    <WholesaleContext.Provider
      value={{
        products,
        cart,
        orders,
        quoteRequests,
        wishlist,
        cartCount,
        cartTotalAmount,
        cartTotalPieces,
        quickViewProduct,
        isCartDrawerOpen,
        isQuoteModalOpen,
        quotePresetProduct,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        submitOrder,
        submitQuoteRequest,
        toggleWishlist,
        isWishlisted,
        openQuickView,
        closeQuickView,
        openCartDrawer,
        closeCartDrawer,
        openQuoteModal,
        closeQuoteModal,
        updateProduct,
        updateOrderStatus,
      }}
    >
      {children}
    </WholesaleContext.Provider>
  );
}

export function useWholesale() {
  const context = useContext(WholesaleContext);
  if (!context) {
    throw new Error('useWholesale must be used within a WholesaleProvider');
  }
  return context;
}
