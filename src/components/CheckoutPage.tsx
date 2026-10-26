import { useState } from 'react';
import { useWholesale } from '../context/WholesaleContext';
import { CustomerDetails, WholesaleOrder } from '../types/wholesale';
import {
  formatBDT,
  BRAND,
  BANGLADESH_DISTRICTS,
  generateWhatsAppOrderMessage,
} from '../utils/constants';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageSquare,
  ArrowLeft,
  Building,
  Printer,
  ShoppingBag,
} from 'lucide-react';

interface CheckoutPageProps {
  onBack: () => void;
  onContinueShopping: () => void;
}

export function CheckoutPage({ onBack, onContinueShopping }: CheckoutPageProps) {
  const { cart, submitOrder, cartTotalAmount, cartTotalPieces } = useWholesale();

  const [form, setForm] = useState<CustomerDetails>({
    shopName: '',
    contactName: '',
    phone: '',
    email: '',
    district: 'Dhaka',
    thana: '',
    deliveryAddress: '',
    tradeLicense: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<WholesaleOrder['paymentMethod']>('cod_inspection');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedOrder, setCompletedOrder] = useState<WholesaleOrder | null>(null);

  // Delivery calculation based on district
  const shippingFee = form.district.toLowerCase() === 'dhaka' ? 300 : 650;
  const grandTotal = cartTotalAmount + shippingFee;

  // Validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.contactName.trim()) errs.contactName = 'Contact Person Name is required';
    if (!form.phone.trim()) {
      errs.phone = 'Mobile / WhatsApp number is required';
    } else if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 11-digit Bangladesh phone number (e.g. 01716-032319)';
    }
    if (!form.deliveryAddress.trim()) errs.deliveryAddress = 'Full Delivery Address is required';
    if (!form.district) errs.district = 'Please select your District';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const order = submitOrder(form, paymentMethod);
    setCompletedOrder(order);
  };

  // Order Confirmed State
  if (completedOrder) {
    // Generate text breakdown for WhatsApp
    let breakdownText = '';
    completedOrder.items.forEach((item) => {
      breakdownText += `\n*${item.product.name}* (${item.totalPieces} pcs${item.unitPrice ? ` @ ৳${item.unitPrice}` : ' - Price on Request'}):\n`;
      item.product.availableColors.forEach((color) => {
        const sizesObj = item.matrix[color.id] || {};
        const count = Object.values(sizesObj).reduce((a, b) => a + (Number(b) || 0), 0);
        if (count > 0) {
          const detail = Object.entries(sizesObj)
            .filter(([_, q]) => Number(q) > 0)
            .map(([sz, q]) => `Sz ${sz}:${q}`)
            .join(', ');
          breakdownText += `  • ${color.name}: ${count} pcs (${detail})\n`;
        }
      });
    });

    const whatsappLink = `https://wa.me/${BRAND.rawPhone}?text=${generateWhatsAppOrderMessage(
      completedOrder.orderNumber,
      completedOrder.customer.contactName,
      completedOrder.customer.shopName,
      completedOrder.totalPieces,
      completedOrder.totalAmount,
      breakdownText
    )}`;

    return (
      <div className="bg-neutral-50 min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 border border-neutral-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-[11px] uppercase tracking-widest text-emerald-800 font-bold block">
              Wholesale Order Submitted Successfully
            </span>
            <h1 className="text-2xl font-black text-neutral-950 uppercase tracking-tight">
              Order #{completedOrder.orderNumber}
            </h1>
            <p className="text-xs text-neutral-600 max-w-md mx-auto">
              Thank you, <strong className="text-neutral-900">{completedOrder.customer.contactName}</strong>. Our wholesale sales team in Dhaka has received your order request and will verify stock packaging before dispatch.
            </p>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-center space-y-2">
            <p className="text-xs font-semibold text-emerald-950">
              For instant dispatch & priority showroom processing, confirm via WhatsApp:
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm on WhatsApp ({BRAND.phone})</span>
            </a>
          </div>

          {/* Order Summary Receipt Box */}
          <div className="border border-neutral-200 bg-neutral-50 p-4 text-xs space-y-3 font-mono">
            <div className="flex justify-between border-b border-neutral-200 pb-2 font-bold text-neutral-900 font-sans">
              <span>Order Reference: {completedOrder.orderNumber}</span>
              <span>{new Date(completedOrder.createdAt).toLocaleDateString('en-GB')}</span>
            </div>

            <div className="space-y-1 font-sans text-neutral-700">
              <div><strong className="text-neutral-900">Shop / Buyer:</strong> {completedOrder.customer.shopName || 'Retail Customer'} ({completedOrder.customer.contactName})</div>
              <div><strong className="text-neutral-900">Phone:</strong> {completedOrder.customer.phone}</div>
              <div><strong className="text-neutral-900">Delivery:</strong> {completedOrder.customer.deliveryAddress}, {completedOrder.customer.district}</div>
              <div><strong className="text-neutral-900">Payment:</strong> {completedOrder.paymentMethod.replace(/_/g, ' ').toUpperCase()}</div>
            </div>

            <div className="border-t border-neutral-200 pt-2 space-y-2 font-sans">
              <span className="font-bold text-neutral-900 uppercase text-[11px] block">Items ({completedOrder.totalPieces} pcs):</span>
              {completedOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between text-neutral-800">
                  <span>{it.product.name} ({it.totalPieces} pcs)</span>
                  <span className="font-bold">{formatBDT(it.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-2 space-y-1 font-sans">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal:</span>
                <span>{formatBDT(completedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Courier Parcel Delivery:</span>
                <span>{formatBDT(completedOrder.shippingEstimate)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-neutral-950 pt-1 border-t border-neutral-200">
                <span>Total Payable:</span>
                <span>{formatBDT(completedOrder.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto px-4 py-2.5 border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Summary</span>
            </button>

            <button
              type="button"
              onClick={onContinueShopping}
              className="w-full sm:w-auto px-6 py-2.5 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
            >
              Return To Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal Checkout Form
  return (
    <div className="bg-neutral-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Back Nav */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">
              Wholesale Order Processing
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
              Wholesale Checkout
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>VAT & Wholesale Verification Ready</span>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-12 text-center border border-neutral-200 space-y-4">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
            <h2 className="text-base font-bold text-neutral-900 uppercase">Your Cart is Empty</h2>
            <p className="text-xs text-neutral-500">
              Please add at least 24 pieces to proceed with a wholesale order.
            </p>
            <button
              onClick={onContinueShopping}
              className="px-6 py-3 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider"
            >
              Browse Collections
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Customer Form & Shipping Info (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-neutral-700" />
                <span>1. Business & Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Shop / Company Name <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.shopName}
                    onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                    placeholder="e.g. Elegance Boutique / Trendz Garments"
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Contact Person Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    placeholder="Full Name"
                    className={`w-full p-2.5 border ${
                      errors.contactName ? 'border-rose-500' : 'border-neutral-300'
                    } focus:outline-none focus:border-neutral-900`}
                  />
                  {errors.contactName && (
                    <span className="text-[11px] text-rose-600">{errors.contactName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Mobile / WhatsApp Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01716-032319"
                    className={`w-full p-2.5 border ${
                      errors.phone ? 'border-rose-500' : 'border-neutral-300'
                    } focus:outline-none focus:border-neutral-900`}
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-rose-600">{errors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Email Address <span className="text-neutral-400 font-normal">(For Invoice Copy)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="owner@domain.com"
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2 pt-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-700" />
                <span>2. Delivery Destination (Bangladesh)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    District <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} {d === 'Dhaka' ? '(Local Delivery ৳300)' : '(Courier Parcel ৳650)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Thana / Upazila
                  </label>
                  <input
                    type="text"
                    value={form.thana}
                    onChange={(e) => setForm({ ...form, thana: e.target.value })}
                    placeholder="e.g. Uttara / Dhanmondi / Panchlaish"
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Full Delivery Address / Shop Location <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.deliveryAddress}
                    onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                    placeholder="House/Plot, Road Number, Market Name, Floor/Shop Number"
                    className={`w-full p-2.5 border ${
                      errors.deliveryAddress ? 'border-rose-500' : 'border-neutral-300'
                    } focus:outline-none focus:border-neutral-900`}
                  />
                  {errors.deliveryAddress && (
                    <span className="text-[11px] text-rose-600">{errors.deliveryAddress}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Order Notes / Courier Preference
                  </label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="e.g. SA Paribahan Kakrail branch pickup / Sundarban Courier"
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2 pt-2">
                3. Wholesale Payment Terms
              </h2>

              <div className="space-y-2.5 text-xs">
                <label className="flex items-start gap-3 p-3 border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-colors bg-white">
                  <input
                    type="radio"
                    name="payment"
                    value="cod_inspection"
                    checked={paymentMethod === 'cod_inspection'}
                    onChange={() => setPaymentMethod('cod_inspection')}
                    className="mt-0.5 text-neutral-950"
                  />
                  <div>
                    <span className="font-bold text-neutral-950 block">
                      Cash on Delivery / Parcel Inspection at Courier Counter
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                      Inspect wholesale carton sealed lot at SA Paribahan or Sundarban branch before settling invoice balance.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-colors bg-white">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-0.5 text-neutral-950"
                  />
                  <div>
                    <span className="font-bold text-neutral-950 block">
                      Direct Corporate Bank Wire (Brac Bank / City Bank / EBL)
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                      We provide our official company account details upon invoice generation.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-colors bg-white">
                  <input
                    type="radio"
                    name="payment"
                    value="bkash_merchant"
                    checked={paymentMethod === 'bkash_merchant'}
                    onChange={() => setPaymentMethod('bkash_merchant')}
                    className="mt-0.5 text-neutral-950"
                  />
                  <div>
                    <span className="font-bold text-neutral-950 block">
                      bKash / Nagad Merchant Account
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                      Instant merchant checkout payment or deposit confirmation.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Wholesale Order Request ({cartTotalPieces} pcs)</span>
              </button>
            </div>

            {/* Right Column: Order Review & Pricing Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 border border-neutral-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2">
                  Order Summary ({cartTotalPieces} Pieces)
                </h3>

                <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-neutral-900">
                        <span className="truncate max-w-[200px]">{item.product.name}</span>
                        <span className="tabular-nums">{formatBDT(item.subtotal)}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {item.totalPieces} pieces @ {formatBDT(item.unitPrice)} / pc
                      </div>

                      {/* Small breakdown */}
                      <div className="text-[10px] text-neutral-600 bg-neutral-50 p-2 border border-neutral-200/60 font-mono">
                        {item.product.availableColors.map((color) => {
                          const sObj = item.matrix[color.id] || {};
                          const pcs = Object.values(sObj).reduce((a, b) => a + (Number(b) || 0), 0);
                          if (pcs === 0) return null;
                          return (
                            <div key={color.id} className="truncate">
                              {color.name} ({pcs} pcs):{' '}
                              {Object.entries(sObj)
                                .filter(([_, q]) => Number(q) > 0)
                                .map(([s, q]) => `Sz ${s}:${q}`)
                                .join(' ')}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Pieces Count:</span>
                    <span className="font-bold text-neutral-900">{cartTotalPieces} pcs</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Wholesale Subtotal:</span>
                    <span className="tabular-nums">{formatBDT(cartTotalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Courier Delivery ({form.district}):</span>
                    <span className="tabular-nums">{formatBDT(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-neutral-950 pt-2 border-t border-neutral-200">
                    <span>Grand Total:</span>
                    <span className="tabular-nums">
                      {cartTotalAmount > 0 ? formatBDT(grandTotal) : 'Price on Request + Courier'}
                    </span>
                  </div>
                </div>

                {/* Assurance box */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                  <span className="font-bold text-neutral-900 uppercase block">Wholesale Guarantee:</span>
                  <p>
                    Orders placed before 2:00 PM are packed the same day. Exact colorway ratios and size specifications are guaranteed matching your digital matrix.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
