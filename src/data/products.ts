export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  features: string[];
  fabric: string;
  care: string[];
  sku: string;
  tags: string[];
  specifications: Record<string, string>;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Pocket Design Panjabi 2025',
    description: 'Experience the perfect blend of traditional elegance and modern sophistication with our Premium Pocket Design Panjabi. Crafted from the finest cotton fabric, this exquisite piece features intricate pocket detailing that adds a contemporary touch to the classic Panjabi silhouette. The premium quality fabric ensures comfort throughout the day while maintaining its shape and color after multiple washes.',
    price: 1690,
    originalPrice: 2250,
    images: [
      '/src/assets/product-1.webp',
      '/src/assets/product-2.webp',
      '/src/assets/banner-1.webp'
    ],
    category: 'Premium Panjabi',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream', 'Light Blue', 'Navy'],
    inStock: true,
    stockQuantity: 25,
    features: [
      'Premium Cotton Fabric',
      'Modern Pocket Design',
      'Traditional Cut',
      'Comfortable Fit',
      'Easy Care'
    ],
    fabric: '100% Premium Cotton',
    care: [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low',
      'Iron on medium heat',
      'Dry clean if needed'
    ],
    sku: 'SKU-00477',
    tags: ['premium', 'cotton', 'traditional', 'modern', 'pocket-design'],
    specifications: {
      'Material': '100% Premium Cotton',
      'Fit': 'Regular Fit',
      'Collar': 'Band Collar',
      'Sleeve': 'Full Sleeve',
      'Pattern': 'Pocket Design',
      'Origin': 'Bangladesh',
      'Care': 'Machine Washable'
    }
  },
  {
    id: '2',
    name: 'Luxury Embroidery Collection Special',
    description: 'Indulge in the artistry of traditional Bengali craftsmanship with our Luxury Embroidery Collection. Each piece is meticulously hand-embroidered by skilled artisans, featuring intricate patterns that tell stories of our rich cultural heritage. The luxurious fabric drapes beautifully, making it perfect for special occasions and festive celebrations.',
    price: 2890,
    originalPrice: 3200,
    images: [
      '/src/assets/product-2.webp',
      '/src/assets/product-1.webp',
      '/src/assets/banner-2.webp'
    ],
    category: 'Embroidery Panjabi',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream', 'Gold', 'Maroon'],
    inStock: true,
    stockQuantity: 18,
    features: [
      'Hand Embroidered',
      'Luxury Fabric',
      'Traditional Patterns',
      'Artisan Crafted',
      'Special Occasion'
    ],
    fabric: 'Premium Cotton Blend with Silk Threading',
    care: [
      'Dry clean recommended',
      'Hand wash with care',
      'Do not wring',
      'Iron on low heat',
      'Store in garment bag'
    ],
    sku: 'SKU-00476',
    tags: ['luxury', 'embroidery', 'handcrafted', 'traditional', 'special-occasion'],
    specifications: {
      'Material': 'Premium Cotton Blend with Silk Threading',
      'Fit': 'Regular Fit',
      'Collar': 'Band Collar',
      'Sleeve': 'Full Sleeve',
      'Pattern': 'Hand Embroidered',
      'Origin': 'Bangladesh',
      'Care': 'Dry Clean Recommended'
    }
  },
  {
    id: '3',
    name: 'Traditional Print Panjabi Classic',
    description: 'Celebrate the timeless beauty of Bengali tradition with our Traditional Print Panjabi Classic. Featuring authentic block prints and traditional motifs, this piece embodies the essence of our cultural heritage. The comfortable cotton fabric and classic fit make it perfect for daily wear and casual occasions.',
    price: 1450,
    originalPrice: 1850,
    images: [
      '/src/assets/product-1.webp',
      '/src/assets/banner-3.webp',
      '/src/assets/product-2.webp'
    ],
    category: 'Print Panjabi',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream', 'Light Green', 'Beige'],
    inStock: true,
    stockQuantity: 32,
    features: [
      'Traditional Block Print',
      'Authentic Motifs',
      'Comfortable Cotton',
      'Classic Fit',
      'Daily Wear'
    ],
    fabric: '100% Cotton',
    care: [
      'Machine wash cold',
      'Gentle cycle',
      'Do not bleach',
      'Line dry preferred',
      'Iron on medium heat'
    ],
    sku: 'SKU-00475',
    tags: ['traditional', 'print', 'classic', 'cotton', 'daily-wear'],
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Classic Fit',
      'Collar': 'Band Collar',
      'Sleeve': 'Full Sleeve',
      'Pattern': 'Traditional Block Print',
      'Origin': 'Bangladesh',
      'Care': 'Machine Washable'
    }
  },
  {
    id: '4',
    name: 'Solid Color Premium Collection',
    description: 'Embrace minimalist elegance with our Solid Color Premium Collection. These sophisticated pieces feature clean lines and premium fabric quality, perfect for the modern gentleman who appreciates understated luxury. The versatile design makes it suitable for both formal and casual settings.',
    price: 1780,
    originalPrice: 2100,
    images: [
      '/src/assets/product-2.webp',
      '/src/assets/banner-4.webp',
      '/src/assets/product-1.webp'
    ],
    category: 'Solid Panjabi',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream', 'Light Blue', 'Gray', 'Navy'],
    inStock: false,
    stockQuantity: 0,
    features: [
      'Premium Solid Colors',
      'Minimalist Design',
      'Versatile Style',
      'High Quality Fabric',
      'Modern Fit'
    ],
    fabric: 'Premium Cotton Blend',
    care: [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low',
      'Iron on medium heat',
      'Professional cleaning recommended'
    ],
    sku: 'SKU-00474',
    tags: ['solid', 'premium', 'minimalist', 'versatile', 'modern'],
    specifications: {
      'Material': 'Premium Cotton Blend',
      'Fit': 'Modern Fit',
      'Collar': 'Band Collar',
      'Sleeve': 'Full Sleeve',
      'Pattern': 'Solid Color',
      'Origin': 'Bangladesh',
      'Care': 'Machine Washable'
    }
  },
  {
    id: '5',
    name: 'Special Edition Combo Package',
    description: 'Get the complete Suraah Fashion experience with our Special Edition Combo Package. This exclusive set includes two premium Panjabis from different collections, offering exceptional value and variety. Perfect for building a sophisticated wardrobe or as a thoughtful gift for someone special.',
    price: 3999,
    originalPrice: 4500,
    images: [
      '/src/assets/product-1.webp',
      '/src/assets/product-2.webp',
      '/src/assets/banner-5.webp'
    ],
    category: 'Combo Package',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Mixed', 'White Set', 'Cream Set'],
    inStock: true,
    stockQuantity: 12,
    features: [
      'Two Premium Panjabis',
      'Mixed Collections',
      'Exceptional Value',
      'Gift Ready Packaging',
      'Size Customization'
    ],
    fabric: 'Premium Cotton (Both Pieces)',
    care: [
      'Follow individual care instructions',
      'Wash separately for first wash',
      'Store in provided garment bags',
      'Professional cleaning recommended',
      'Iron with care'
    ],
    sku: 'SKU-00473',
    tags: ['combo', 'special-edition', 'value', 'gift', 'premium'],
    specifications: {
      'Material': 'Premium Cotton (Both Pieces)',
      'Fit': 'Regular Fit',
      'Collar': 'Band Collar',
      'Sleeve': 'Full Sleeve',
      'Pattern': 'Mixed Collections',
      'Origin': 'Bangladesh',
      'Care': 'Follow Individual Instructions'
    }
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 4); // Return first 4 products as featured
};

export const getInStockProducts = (): Product[] => {
  return products.filter(product => product.inStock);
};