import { products as staticProducts } from '@/data/products';
import { addProduct } from '@/services/productService';
import { Product } from '@/data/products';

// Migration service to move static products to Firestore
export const migrateProductsToFirestore = async (): Promise<void> => {
  try {
    console.log('Starting product migration to Firestore...');
    
    const migrationPromises = staticProducts.map(async (product: Product) => {
      try {
        // Remove the id field since Firestore will generate it
        const { id, ...productData } = product;
        
        // Add product to Firestore
        const newId = await addProduct(productData);
        console.log(`Migrated product: ${product.name} with new ID: ${newId}`);
        
        return { originalId: id, newId, name: product.name };
      } catch (error) {
        console.error(`Failed to migrate product ${product.name}:`, error);
        throw error;
      }
    });

    const results = await Promise.all(migrationPromises);
    
    console.log('Migration completed successfully!');
    console.log('Migration results:', results);
    
    return;
  } catch (error) {
    console.error('Migration failed:', error);
    throw new Error('Failed to migrate products to Firestore');
  }
};

// Check if products exist in Firestore
export const checkFirestoreProducts = async (): Promise<boolean> => {
  try {
    const { getAllProducts } = await import('@/services/productService');
    const products = await getAllProducts();
    return products.length > 0;
  } catch (error) {
    console.error('Error checking Firestore products:', error);
    return false;
  }
};

// Utility function to create a backup of current Firestore data
export const backupFirestoreProducts = async (): Promise<Product[]> => {
  try {
    const { getAllProducts } = await import('@/services/productService');
    const products = await getAllProducts();
    
    // Save to localStorage as backup
    localStorage.setItem('firestore_products_backup', JSON.stringify(products));
    
    console.log(`Backed up ${products.length} products to localStorage`);
    return products;
  } catch (error) {
    console.error('Error backing up Firestore products:', error);
    throw new Error('Failed to backup Firestore products');
  }
};

// Restore products from backup
export const restoreProductsFromBackup = (): Product[] | null => {
  try {
    const backup = localStorage.getItem('firestore_products_backup');
    if (backup) {
      return JSON.parse(backup);
    }
    return null;
  } catch (error) {
    console.error('Error restoring products from backup:', error);
    return null;
  }
};