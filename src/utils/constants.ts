export const BRAND = {
  name: 'TEN TACLES BD',
  shortName: 'Ten Tacles BD',
  tagline: 'Quality Apparel. Wholesale Value.',
  logoUrl: '/assets/aistudio/WhatsApp_Image_2026-10-17_at_3.07.58_PM_ac23137a.jpeg',
  phone: '+880 1716-032319',
  rawPhone: '8801716032319',
  cell: '01329729205',
  cellDisplay: '01329-729205',
  rawCell: '8801329729205',
  whatsappUrl: 'https://wa.me/8801716032319?text=' + encodeURIComponent('Hello TEN TACLES BD, I would like to enquire about your wholesale clothing collection.'),
  facebookUrl: 'https://www.facebook.com/profile.php?id=61595272391455',
  instagramUrl: 'https://www.instagram.com/tentaclesbd/',
  instagramHandle: '@tentaclesbd',
  email: 'wholesale@tentaclesbd.com',
  showroomAddress: 'HOUSE NO. 35/F/8, Ma Vila Goli, Road No.2, Shyamoli, Sher-e-Bangla Nagar, Dhaka-1207',
  warehouseAddress: 'Tongi Industrial Area, Gazipur, Dhaka Division',
  moqDefault: 24,
  currencySymbol: '৳',
};

export const BANGLADESH_DISTRICTS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Gazipur',
  'Narayanganj',
  'Cumilla',
  'Bogura',
  'Jessore',
  'Cox\'s Bazar',
  'Tangail',
  'Brahmanbaria',
  'Feni',
  'Kushtia',
  'Pabna',
  'Noakhali',
  'Faridpur',
  'Dinajpur',
];

export function formatBDT(amount?: number | null): string {
  if (amount === undefined || amount === null || amount === 0) {
    return 'Price on Request';
  }
  return `৳${Math.round(amount).toLocaleString('en-US')}`;
}

export function generateWhatsAppOrderMessage(
  orderNumber: string,
  customerName: string,
  shopName: string | undefined,
  totalPieces: number,
  totalAmount: number,
  breakdown: string
): string {
  const text = `Assalamu Alaikum Ten Tacles BD Team,

I would like to confirm my wholesale order:
*Order Reference:* ${orderNumber}
*Customer/Shop:* ${customerName}${shopName ? ` (${shopName})` : ''}
*Total Pieces:* ${totalPieces} pcs
*Pricing:* ${totalAmount > 0 ? `৳${totalAmount.toLocaleString('en-US')}` : 'Price on Request (Confirmed on Invoice)'}

*Order Breakdown:*
${breakdown}

Please confirm stock availability, wholesale invoice, and courier delivery schedule. Thank you!`;

  return encodeURIComponent(text);
}
