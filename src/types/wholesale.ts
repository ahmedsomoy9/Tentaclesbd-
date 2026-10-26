export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  images: string[];
}

export interface PriceTier {
  minQty: number;
  pricePerPiece: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'dark-blue' | 'mid-blue' | 'light-blue' | 'wholesale-packs' | 'denim-jeans';
  categoryLabel: string;
  sku: string;
  description: string;
  fabricDetails?: string;
  wholesalePrice?: number; // Base BDT price per piece (0 or undefined indicates 'Price on Request')
  priceTiers?: PriceTier[];
  availableColors: ColorVariant[];
  availableSizes: number[]; // e.g. [30, 32, 34, 36]
  moq: number; // Minimum Order Quantity (24)
  standardPackRatio: Record<number, number>; // e.g. { 30: 2, 32: 2, 34: 2, 36: 2 }
  orderingMode: 'fixed' | 'flexible';
  inStock?: boolean;
  stockCount?: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  matrix: Record<string, Record<number, number>>; // colorId -> size -> qty
  totalPieces: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface CustomerDetails {
  shopName?: string;
  contactName: string;
  phone: string;
  email?: string;
  district: string;
  thana?: string;
  deliveryAddress: string;
  tradeLicense?: string;
  notes?: string;
}

export interface WholesaleOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending_review' | 'confirmed' | 'processing' | 'shipped';
  customer: CustomerDetails;
  items: CartItem[];
  totalPieces: number;
  subtotal: number;
  shippingEstimate: number;
  totalAmount: number;
  paymentMethod: 'cod_inspection' | 'bank_transfer' | 'bkash_merchant';
}

export interface WholesaleQuoteRequest {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email?: string;
  productsInterested: string;
  estimatedQuantity: number;
  preferredColors?: string;
  preferredSizes?: string;
  notes?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'quoted';
}
