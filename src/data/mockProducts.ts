import { Product } from '../types/wholesale';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'jack-jones-dark-blue',
    name: 'Jack & Jones Slim Glenn Dark Blue Wash Jeans',
    slug: 'jack-jones-slim-glenn-dark-blue',
    category: 'dark-blue',
    categoryLabel: 'Dark Blue Denim',
    sku: 'JJ-GLENN-DB',
    description:
      'Authentic Jack & Jones Slim Glenn stretch denim jeans in Dark Blue wash. Deep indigo tone with authentic whiskering, hand scraping, and premium stretch denim comfort. Configured for wholesale retailers with standard 2-2-2-2 size ratio (sizes 30, 32, 34, 36) in 24-piece master packs.',
    fabricDetails:
      'Jack & Jones Jeans Intelligence · Glenn Slim Fit · Stretch Denim · Dark Blue Whiskered Indigo',
    wholesalePrice: 950,
    availableSizes: [30, 32, 34, 36],
    moq: 24,
    standardPackRatio: { 30: 2, 32: 2, 34: 2, 36: 2 },
    orderingMode: 'flexible',
    isNewArrival: true,
    isBestSeller: true,
    tags: ['Jack & Jones', 'Glenn Slim', 'Dark Blue', 'Stretch Denim', 'Export Quality'],
    availableColors: [
      {
        id: 'dark-blue',
        name: 'Dark Blue Wash',
        hex: '#172B50',
        images: [
          '/assets/aistudio/Gemini_Generated_Image_h67kj2h67kj2h67k_d0104502.jpg', // Full front view
          '/assets/aistudio/Gemini_Generated_Image_exfafrexfafrexfa_c84807af.jpg', // Full back view with SLIM fit pocket tag
          '/assets/aistudio/Gemini_Generated_Image_pyq4m1pyq4m1pyq4_2d2b126b.jpg', // Inner waistband branding & care label detail
          '/assets/aistudio/WhatsApp_Image_2026-10-25_at_5.52.40_PM_a7d19ef7.jpeg', // Jack & Jones branded button & brass zipper macro
        ],
      },
    ],
  },
  {
    id: 'jack-jones-mid-blue',
    name: 'Jack & Jones Slim Glenn Mid Blue Wash Jeans',
    slug: 'jack-jones-slim-glenn-mid-blue',
    category: 'mid-blue',
    categoryLabel: 'Mid Blue Denim',
    sku: 'JJ-GLENN-MB',
    description:
      'Authentic Jack & Jones Slim Glenn stretch denim jeans in Mid Blue wash. Classic medium blue denim with subtle authentic fading and branded leather waistband patch. Configured for wholesale retailers with standard 2-2-2-2 size ratio in 24-piece master packs.',
    fabricDetails:
      'Jack & Jones Jeans Intelligence · Glenn Slim Fit · Stretch Denim · Mid Blue Classic Wash',
    wholesalePrice: 950,
    availableSizes: [30, 32, 34, 36],
    moq: 24,
    standardPackRatio: { 30: 2, 32: 2, 34: 2, 36: 2 },
    orderingMode: 'flexible',
    isNewArrival: true,
    isBestSeller: true,
    tags: ['Jack & Jones', 'Glenn Slim', 'Mid Blue', 'Stretch Denim', 'Export Quality'],
    availableColors: [
      {
        id: 'mid-blue',
        name: 'Mid Blue Wash',
        hex: '#4775A5',
        images: [
          '/assets/aistudio/Gemini_Generated_Image_sluavisluavislua_8cc81a63.jpg', // Full front view
          '/assets/aistudio/Gemini_Generated_Image_zeayz1zeayz1zeay_7848af01.jpg', // Full back view with SLIM fit pocket tag
          '/assets/aistudio/Gemini_Generated_Image_j4d1quj4d1quj4d1_6e6e8eb4.jpg', // Waistband & whiskering detail
          '/assets/aistudio/Gemini_Generated_Image_ve8yfsve8yfsve8y_2855d242.jpg', // Inner waistband branding & care label detail
        ],
      },
    ],
  },
  {
    id: 'jack-jones-light-blue',
    name: 'Jack & Jones Slim Glenn Light Blue Wash Jeans',
    slug: 'jack-jones-slim-glenn-light-blue',
    category: 'light-blue',
    categoryLabel: 'Light Blue Denim',
    sku: 'JJ-GLENN-LB',
    description:
      'Authentic Jack & Jones Slim Glenn stretch denim jeans in Light Blue wash. Stone-washed light indigo with brass zipper fly, red tab coin pocket, and authentic hem finish. Configured for wholesale retailers with standard 2-2-2-2 size ratio in 24-piece master packs.',
    fabricDetails:
      'Jack & Jones Jeans Intelligence · Glenn Slim Fit · Stretch Denim · Light Blue Stone Wash',
    wholesalePrice: 950,
    availableSizes: [30, 32, 34, 36],
    moq: 24,
    standardPackRatio: { 30: 2, 32: 2, 34: 2, 36: 2 },
    orderingMode: 'flexible',
    isNewArrival: true,
    isBestSeller: true,
    tags: ['Jack & Jones', 'Glenn Slim', 'Light Blue', 'Stretch Denim', 'Export Quality'],
    availableColors: [
      {
        id: 'light-blue',
        name: 'Light Blue Wash',
        hex: '#B4CFEB',
        images: [
          '/assets/aistudio/Gemini_Generated_Image_495dxo495dxo495d_64694437.jpg', // Full front view
          '/assets/aistudio/Gemini_Generated_Image_hog0fshog0fshog0_72a3aa2a.jpg', // Full back view with SLIM fit pocket tag
          '/assets/aistudio/Gemini_Generated_Image_ky8wy6ky8wy6ky8w_61d62b83.jpg', // Inner waistband branding & open fly detail
          '/assets/aistudio/Gemini_Generated_Image_5ogs385ogs385ogs_1981ef0e.jpg', // Folded and rolled hem cuffs detail
        ],
      },
    ],
  },
  {
    id: 'jack-jones-3wash-pack',
    name: 'Jack & Jones Slim Glenn 3-Wash Wholesale Pack (24 Pcs)',
    slug: 'jack-jones-slim-glenn-3wash-pack',
    category: 'wholesale-packs',
    categoryLabel: 'Wholesale Packs',
    sku: 'JJ-GLENN-PACK24',
    description:
      'Pre-packed 24-piece wholesale carton featuring all 3 authentic washes: Dark Blue (8 pcs), Mid Blue (8 pcs), and Light Blue (8 pcs). Pre-configured in the standard 2-2-2-2 ratio across sizes 30, 32, 34, 36. High-turnover assortment for fashion retailers across Bangladesh.',
    fabricDetails:
      'Jack & Jones Jeans Intelligence · Glenn Slim Fit · Stretch Denim · All 3 Washes Combined',
    wholesalePrice: 950,
    availableSizes: [30, 32, 34, 36],
    moq: 24,
    standardPackRatio: { 30: 2, 32: 2, 34: 2, 36: 2 },
    orderingMode: 'flexible',
    isNewArrival: true,
    isBestSeller: true,
    tags: ['Jack & Jones', 'Glenn Slim', '3-Wash Assortment', '24 Pcs Pack', 'Export Quality'],
    availableColors: [
      {
        id: 'dark-blue',
        name: 'Dark Blue',
        hex: '#172B50',
        images: [
          '/assets/aistudio/Gemini_Generated_Image_sv6zhsv6zhsv6zhs_f69d987b.jpg', // Full front view
          '/assets/aistudio/Gemini_Generated_Image_s3uai5s3uai5s3ua_f690c583.jpg', // Waistband & whiskering detail
          '/assets/aistudio/Gemini_Generated_Image_vm11uwvm11uwvm11_3b202ed1.jpg', // Rolled hem cuff detail
        ],
      },
      {
        id: 'mid-blue',
        name: 'Mid Blue',
        hex: '#4775A5',
        images: [
          '/assets/aistudio/Gemini_Generated_Image_sluavisluavislua_8cc81a63.jpg', // Full front view
          '/assets/aistudio/Gemini_Generated_Image_zeayz1zeayz1zeay_7848af01.jpg', // Full back view with SLIM tag
          '/assets/aistudio/Gemini_Generated_Image_j4d1quj4d1quj4d1_6e6e8eb4.jpg', // Upper waist & coin pocket
          '/assets/aistudio/Gemini_Generated_Image_65vlc165vlc165vl_884bb8c6.jpg', // Back pockets & leather patch
        ],
      },
      {
        id: 'light-blue',
        name: 'Light Blue',
        hex: '#B4CFEB',
        images: [
          '/assets/aistudio/Gemini_Generated_Image_495dxo495dxo495d_64694437.jpg', // Full front view
          '/assets/aistudio/Gemini_Generated_Image_hog0fshog0fshog0_72a3aa2a.jpg', // Full back view with SLIM tag
          '/assets/aistudio/Gemini_Generated_Image_ky8wy6ky8wy6ky8w_61d62b83.jpg', // Inner waistband & open fly
          '/assets/aistudio/Gemini_Generated_Image_5ogs385ogs385ogs_1981ef0e.jpg', // Rolled and folded cuffs
        ],
      },
    ],
  },
];
