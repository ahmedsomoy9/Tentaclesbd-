import { useState } from 'react';
import { useWholesale } from '../context/WholesaleContext';
import { Product, WholesaleOrder } from '../types/wholesale';
import { formatBDT } from '../utils/constants';
import {
  Package,
  ShoppingBag,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowLeft,
  Edit2,
  Save,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onViewProduct: (product: Product) => void;
}

export function AdminDashboard({ onBackToStore, onViewProduct }: AdminDashboardProps) {
  const { products, orders, quoteRequests, updateOrderStatus, updateProduct } = useWholesale();

  const [activeTab, setActiveTab] = useState<'orders' | 'quotes' | 'inventory'>('orders');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const startEdit = (p: Product) => {
    setEditingProductId(p.id);
    setEditPrice(p.wholesalePrice || 0);
    setEditStock(p.stockCount || 1000);
  };

  const saveEdit = (product: Product) => {
    updateProduct({
      ...product,
      wholesalePrice: editPrice,
      stockCount: editStock,
    });
    setEditingProductId(null);
  };

  const totalWholesaleRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPiecesOrdered = orders.reduce((sum, o) => sum + o.totalPieces, 0);

  return (
    <div className="bg-neutral-100 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                Authorized Staff Operations Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight mt-1">
              TEN TACLES BD — Wholesale Admin
            </h1>
          </div>

          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Customer Storefront</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-neutral-200 space-y-1">
            <span className="text-xs text-neutral-500 font-medium">Total Orders Placed</span>
            <div className="text-2xl font-black text-neutral-950">{orders.length}</div>
          </div>
          <div className="bg-white p-5 border border-neutral-200 space-y-1">
            <span className="text-xs text-neutral-500 font-medium">Wholesale Volume</span>
            <div className="text-2xl font-black text-neutral-950">{totalPiecesOrdered} pcs</div>
          </div>
          <div className="bg-white p-5 border border-neutral-200 space-y-1">
            <span className="text-xs text-neutral-500 font-medium">Gross Wholesale Value</span>
            <div className="text-2xl font-black text-neutral-950">{formatBDT(totalWholesaleRevenue)}</div>
          </div>
          <div className="bg-white p-5 border border-neutral-200 space-y-1">
            <span className="text-xs text-neutral-500 font-medium">Pending Quote Inquiries</span>
            <div className="text-2xl font-black text-neutral-950">{quoteRequests.length}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-300 bg-white px-6 pt-3 gap-6 text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'orders' ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Wholesale Orders ({orders.length})
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'quotes' ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Custom Quote Requests ({quoteRequests.length})
            {activeTab === 'quotes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'inventory' ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Product & Inventory Management ({products.length})
            {activeTab === 'inventory' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-neutral-200 p-6">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                <h3 className="text-sm font-bold uppercase text-neutral-900">
                  Recent Wholesale Submissions
                </h3>
                <span className="text-xs text-neutral-500">Live persistence connected via LocalStorage</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  No wholesale orders placed yet. Add items to cart and complete checkout to see real orders populate here.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-neutral-200 p-4 space-y-3 bg-neutral-50/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                        <div>
                          <span className="text-sm font-black text-neutral-950">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-neutral-500 ml-3">
                            {new Date(order.createdAt).toLocaleString('en-GB')}
                          </span>
                        </div>

                        {/* Status switcher */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500 font-medium">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value as any)
                            }
                            className="text-xs font-bold border border-neutral-300 rounded px-2 py-1 bg-white text-neutral-900"
                          >
                            <option value="pending_review">Pending Review</option>
                            <option value="confirmed">Confirmed / Invoiced</option>
                            <option value="processing">Packing at Warehouse</option>
                            <option value="shipped">Dispatched to Courier</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-700">
                        <div>
                          <strong className="text-neutral-900 block">Buyer / Shop:</strong>
                          <span>{order.customer.shopName || 'Retail Customer'}</span>
                          <span className="block text-neutral-500">{order.customer.contactName}</span>
                          <span className="block text-neutral-900 font-mono mt-0.5">{order.customer.phone}</span>
                        </div>

                        <div>
                          <strong className="text-neutral-900 block">Delivery Destination:</strong>
                          <span>{order.customer.deliveryAddress}</span>
                          <span className="block text-neutral-900 font-semibold">{order.customer.district}</span>
                          {order.customer.notes && (
                            <span className="block text-[11px] text-neutral-500 italic mt-0.5">
                              Note: {order.customer.notes}
                            </span>
                          )}
                        </div>

                        <div>
                          <strong className="text-neutral-900 block">Order Financials:</strong>
                          <span>Pieces: {order.totalPieces} pcs</span>
                          <span className="block">Total: <strong className="text-neutral-950 font-bold">{formatBDT(order.totalAmount)}</strong></span>
                          <span className="block text-[10px] text-neutral-500 uppercase">{order.paymentMethod.replace(/_/g, ' ')}</span>
                        </div>
                      </div>

                      {/* Items breakdown */}
                      <div className="bg-white p-3 border border-neutral-200 text-xs space-y-2">
                        <span className="font-bold text-neutral-900 uppercase text-[10px] block">
                          Ordered Items Breakdown:
                        </span>
                        {order.items.map((it) => (
                          <div key={it.id} className="text-neutral-700 space-y-1">
                            <div className="flex justify-between font-semibold text-neutral-900">
                              <span>{it.product.name} ({it.totalPieces} pcs)</span>
                              <span>{formatBDT(it.subtotal)}</span>
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              {it.product.availableColors.map((c) => {
                                const sizesObj = it.matrix[c.id] || {};
                                const count = Object.values(sizesObj).reduce((a, b) => a + (Number(b) || 0), 0);
                                if (count === 0) return null;
                                return (
                                  <span key={c.id} className="mr-3">
                                    {c.name}: {count} pcs ({Object.entries(sizesObj).filter(([_, q]) => Number(q) > 0).map(([s, q]) => `${s}:${q}`).join(', ')})
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QUOTES TAB */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                <h3 className="text-sm font-bold uppercase text-neutral-900">
                  Custom Quotation Inquiries
                </h3>
              </div>

              {quoteRequests.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  No quote requests submitted yet. Use the "Request a Quote" button on the storefront to test.
                </div>
              ) : (
                <div className="space-y-3">
                  {quoteRequests.map((q) => (
                    <div key={q.id} className="p-4 border border-neutral-200 bg-neutral-50 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-950 text-sm">
                          {q.name} {q.businessName && `(${q.businessName})`}
                        </span>
                        <span className="text-neutral-500">{new Date(q.createdAt).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-neutral-700">
                        <div>Phone: <strong className="text-neutral-900">{q.phone}</strong></div>
                        <div>Est Quantity: <strong className="text-neutral-900">{q.estimatedQuantity} pcs</strong></div>
                        <div>Product: <strong className="text-neutral-900">{q.productsInterested}</strong></div>
                      </div>
                      {q.notes && (
                        <div className="text-neutral-600 italic bg-white p-2 border border-neutral-200">
                          "{q.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                <h3 className="text-sm font-bold uppercase text-neutral-900">
                  Wholesale Catalog & Pricing Controls
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 text-white uppercase text-[11px]">
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3">SKU</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Wholesale Rate</th>
                      <th className="py-2 px-3">Stock Count</th>
                      <th className="py-2 px-3">MOQ</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {products.map((p) => {
                      const isEditing = editingProductId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-neutral-50">
                          <td className="py-2.5 px-3 font-semibold text-neutral-900 max-w-xs truncate">
                            {p.name}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-neutral-600">{p.sku}</td>
                          <td className="py-2.5 px-3 text-neutral-600">{p.categoryLabel}</td>
                          <td className="py-2.5 px-3 font-bold text-neutral-950">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                                className="w-20 p-1 border border-neutral-400 text-xs"
                              />
                            ) : (
                              formatBDT(p.wholesalePrice)
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-neutral-700">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                className="w-20 p-1 border border-neutral-400 text-xs"
                              />
                            ) : (
                              `${p.stockCount?.toLocaleString() || '1,000'} pcs`
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-neutral-600">{p.moq} pcs</td>
                          <td className="py-2.5 px-3 text-right space-x-2">
                            {isEditing ? (
                              <button
                                onClick={() => saveEdit(p)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => startEdit(p)}
                                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-medium text-[11px]"
                              >
                                Edit Rate
                              </button>
                            )}

                            <button
                              onClick={() => {
                                onBackToStore();
                                onViewProduct(p);
                              }}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px]"
                              title="View on Storefront"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
