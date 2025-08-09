import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp,
  onSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FirestoreCategory } from '@/types/firestore';

const COLLECTION_NAME = 'categories';

// Convert Firestore document to Category object
const convertFirestoreToCategory = (doc: any): FirestoreCategory => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl,
    isActive: data.isActive,
    sortOrder: data.sortOrder,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

// Convert Category object to Firestore document
const convertCategoryToFirestore = (category: Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Timestamp.now();
  return {
    ...category,
    createdAt: now,
    updatedAt: now,
  };
};

// Get all categories
export const getAllCategories = async (): Promise<FirestoreCategory[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('sortOrder', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreToCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Get active categories only
export const getActiveCategories = async (): Promise<FirestoreCategory[]> => {
  try {
    const categories = await getAllCategories();
    return categories.filter(category => category.isActive);
  } catch (error) {
    console.error('Error fetching active categories:', error);
    throw new Error('Failed to fetch active categories');
  }
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<FirestoreCategory | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertFirestoreToCategory(docSnap);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
};

// Create new category
export const createCategory = async (categoryData: Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const firestoreCategory = convertCategoryToFirestore(categoryData);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), firestoreCategory);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }
};

// Update category
export const updateCategory = async (id: string, updates: Partial<Omit<FirestoreCategory, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};

// Subscribe to categories changes (real-time)
export const subscribeToCategories = (callback: (categories: FirestoreCategory[]) => void): (() => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('sortOrder', 'asc'));
  
  return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const categories = querySnapshot.docs.map(convertFirestoreToCategory);
    callback(categories);
  }, (error) => {
    console.error('Error in categories subscription:', error);
  });
};

// Get category statistics
export const getCategoryStatistics = async () => {
  try {
    const categories = await getAllCategories();
    const activeCategories = categories.filter(cat => cat.isActive);
    
    return {
      total: categories.length,
      active: activeCategories.length,
      inactive: categories.length - activeCategories.length,
    };
  } catch (error) {
    console.error('Error getting category statistics:', error);
    throw new Error('Failed to get category statistics');
  }
};