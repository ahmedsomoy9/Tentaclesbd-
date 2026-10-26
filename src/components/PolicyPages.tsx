import { BRAND } from '../utils/constants';

interface PolicyPageProps {
  type: 'shipping' | 'terms' | 'privacy';
}

export function PolicyPage({ type }: PolicyPageProps) {
  if (type === 'shipping') {
    return (
      <div className="bg-white min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div className="border-b border-neutral-200 pb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">
              Wholesale Logistics Policy
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
              Shipping & Courier Delivery Policy
            </h1>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase text-neutral-950">1. Dispatch Locations & Delivery Timeframes</h2>
            <p>
              All wholesale lots are dispatched directly from our central warehouse and packaging facility in Dhaka (Shyamoli / Tongi). Orders received and confirmed before 2:00 PM (Saturday – Thursday) enter standard same-day carton packing.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>Inside Dhaka Metro:</strong> 24 to 48 hours delivery via our local logistics team (Flat ৳300 per wholesale carton).</li>
              <li><strong>Outside Dhaka (All 64 Districts):</strong> 48 to 72 hours delivery via Sundarban Courier, SA Paribahan, or Korotoa Courier (Flat ৳650 packaging and courier booking fee).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase text-neutral-950">2. Tracking & Booking Receipts</h2>
            <p>
              Once your shipment has been booked at the courier counter, an official booking CN (Consignment Number) receipt photo will be transmitted to your registered mobile and WhatsApp number.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase text-neutral-950">3. Physical Inspection & Defect Claims</h2>
            <p>
              Wholesale customers are entitled to verify package seals upon courier receipt. If any structural fabric defect or mispack is found within 48 hours of unboxing, please contact our cell at {BRAND.cell} or send unboxing photos/video to our WhatsApp desk at {BRAND.phone} for immediate exchange.
            </p>
          </section>
        </div>
      </div>
    );
  }

  if (type === 'terms') {
    return (
      <div className="bg-white min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div className="border-b border-neutral-200 pb-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">
              Business Agreements
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
              Wholesale Terms & Conditions
            </h1>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase text-neutral-950">1. Minimum Order Requirement</h2>
            <p>
              TEN TACLES BD operates strictly on a wholesale B2B basis. The Minimum Order Quantity (MOQ) for all products is 24 pieces per SKU, unless explicitly agreed in writing via an enterprise quotation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase text-neutral-950">2. Pricing & Currency</h2>
            <p>
              All prices displayed on the website are in Bangladeshi Taka (BDT / ৳) and reflect wholesale per-piece rates. Volume tier pricing applies strictly when the respective minimum piece count (24, 48, or 96 pieces) is reached.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase text-neutral-950">3. Cancellation Policy</h2>
            <p>
              Orders may be cancelled or modified prior to courier counter dispatch. Once a shipment is consigned to SA Paribahan or Sundarban Courier, courier handling fees are non-refundable.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
        <div className="border-b border-neutral-200 pb-4">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">
            Data Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
            Privacy Policy
          </h1>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase text-neutral-950">1. Information Collection</h2>
          <p>
            TEN TACLES BD collects business contact details (contact name, store/shop name, phone number, delivery address, and email) solely to generate invoices, process wholesale orders, and arrange courier delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase text-neutral-950">2. Third-Party Confidentiality</h2>
          <p>
            We do not sell, rent, or trade wholesale customer data to third-party marketing brokers. Contact data is shared only with certified courier partners (e.g. Sundarban, SA Paribahan) strictly for shipping execution.
          </p>
        </section>
      </div>
    </div>
  );
}
