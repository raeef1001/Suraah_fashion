import { Timestamp } from 'firebase/firestore';

export interface FirestoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[]; // URLs to images hosted on cPanel
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreOrder {
  id: string;
  customerId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderDate: Timestamp;
  deliveryDate?: Timestamp;
  trackingNumber?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: {
    type: 'shipping' | 'billing';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  orderHistory: string[]; // Order IDs
  totalOrders: number;
  totalSpent: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreCategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreSiteSettings {
  id: string;
  siteName: string;
  logo?: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  shippingRates: {
    domestic: number;
    international: number;
    freeShippingThreshold: number;
  };
  taxRates: {
    default: number;
    byState?: Record<string, number>;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  updatedAt: Timestamp;
}