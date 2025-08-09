import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  onSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FirestoreProduct } from '@/types/firestore';
import { Product } from '@/data/products';

const COLLECTION_NAME = 'products';

// Convert Firestore document to Product interface
export const convertFirestoreToProduct = (doc: any): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    originalPrice: data.originalPrice,
    images: data.images,
    category: data.category,
    sizes: data.sizes,
    colors: data.colors,
    inStock: data.inStock,
    stockQuantity: data.stockQuantity,
    features: data.features,
    fabric: data.fabric,
    care: data.care,
    sku: data.sku,
    tags: data.tags,
    specifications: data.specifications
  };
};

// Convert Product to Firestore document
export const convertProductToFirestore = (product: Omit<Product, 'id'>): Omit<FirestoreProduct, 'id'> => {
  return {
    ...product,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(convertFirestoreToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertFirestoreToProduct(docSnap);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreToProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
};

// Search products
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - for better search, consider using Algolia or similar
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const products = querySnapshot.docs.map(convertFirestoreToProduct);
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};

// Add new product
export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    const firestoreProduct = convertProductToFirestore(product);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), firestoreProduct);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

// Update product
export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

// Update stock quantity
export const updateProductStock = async (id: string, quantity: number): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      stockQuantity: quantity,
      inStock: quantity > 0,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw new Error('Failed to update product stock');
  }
};

// Get products with pagination
export const getProductsPaginated = async (
  pageSize: number = 10,
  lastDoc?: DocumentSnapshot
): Promise<{ products: Product[]; lastDoc: DocumentSnapshot | null }> => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(convertFirestoreToProduct);
    const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { products, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    throw new Error('Failed to fetch paginated products');
  }
};

// Real-time products listener
export const subscribeToProducts = (callback: (products: Product[]) => void): (() => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const products = querySnapshot.docs.map(convertFirestoreToProduct);
    callback(products);
  }, (error) => {
    console.error('Error in products subscription:', error);
  });
};

// Get featured products (first few products)
export const getFeaturedProducts = async (limitCount: number = 8): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreToProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
};