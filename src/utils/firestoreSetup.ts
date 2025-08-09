// Firestore setup and initialization utility
import { migrateProductsToFirestore, checkFirestoreProducts } from '@/services/migrationService';

export const initializeFirestore = async (): Promise<boolean> => {
  try {
    console.log('Checking Firestore initialization...');
    
    // Check if products already exist in Firestore
    const hasProducts = await checkFirestoreProducts();
    
    if (!hasProducts) {
      console.log('No products found in Firestore. Starting migration...');
      await migrateProductsToFirestore();
      console.log('Migration completed successfully!');
      return true;
    } else {
      console.log('Products already exist in Firestore.');
      return true;
    }
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    return false;
  }
};

// Call this function when the app starts to ensure Firestore is set up
export const setupFirestoreOnAppStart = () => {
  // Only run in development or when explicitly needed
  if (import.meta.env.DEV) {
    initializeFirestore().then((success) => {
      if (success) {
        console.log('✅ Firestore is ready!');
      } else {
        console.log('❌ Firestore setup failed. Using fallback data.');
      }
    });
  }
};