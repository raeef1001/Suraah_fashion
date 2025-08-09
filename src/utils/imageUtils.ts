// Image utility functions for handling different environments

// Import all images statically for Vite
import product1 from '@/assets/product-1.webp';
import product2 from '@/assets/product-2.webp';
import banner1 from '@/assets/banner-1.webp';
import banner2 from '@/assets/banner-2.webp';
import suraahLogo from '@/assets/suraah_logo.png';

// Image mapping for static imports
const imageMap: Record<string, string> = {
  'product-1.webp': product1,
  'product-2.webp': product2,
  'banner-1.webp': banner1,
  'banner-2.webp': banner2,
  'suraah_logo.png': suraahLogo,
};

// Function to resolve image paths
export const resolveImagePath = (imagePath: string): string => {
  console.log('🔍 Resolving image path:', imagePath);
  
  // Handle Cloudinary URLs (uploaded images)
  if (imagePath.includes('cloudinary.com') || imagePath.includes('res.cloudinary.com')) {
    console.log('✅ Using Cloudinary URL:', imagePath);
    return imagePath;
  }
  
  // Legacy: Handle local storage images (for backward compatibility)
  if (imagePath.startsWith('local://')) {
    const filename = imagePath.replace('local://', '');
    const storageKey = `uploaded_image_${filename}`;
    const base64Data = localStorage.getItem(storageKey);
    
    if (base64Data) {
      console.log('✅ Found local storage image:', filename);
      return base64Data;
    } else {
      console.log('⚠️ Local storage image not found:', filename);
      return '/placeholder.svg';
    }
  }
  
  // If it's already a full URL or data URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    console.log('✅ Using external URL:', imagePath);
    return imagePath;
  }
  
  // Extract filename from path
  const filename = imagePath.split('/').pop() || '';
  console.log('📁 Extracted filename:', filename);
  
  // Check if we have a static import for this image
  if (imageMap[filename]) {
    console.log('✅ Found static import for:', filename, '→', imageMap[filename]);
    return imageMap[filename];
  }
  
  // Fallback: try different path formats
  console.log('⚠️ No static import found, trying fallbacks...');
  
  // Try the original path first
  console.log('🔄 Trying original path:', imagePath);
  
  // For development, return the static import if available, otherwise use original
  if (import.meta.env.DEV) {
    return imageMap[filename] || imagePath;
  }
  
  // For production, use relative path from public folder
  const prodPath = `./assets/${filename}`;
  console.log('🏭 Using production path:', prodPath);
  return prodPath;
};

// Function to resolve multiple image paths
export const resolveImagePaths = (imagePaths: string[]): string[] => {
  return imagePaths.map(resolveImagePath);
};

// Debug function to log image resolution
export const debugImagePath = (imagePath: string) => {
  console.group('🖼️ Image Path Debug');
  console.log('Original path:', imagePath);
  console.log('Environment:', import.meta.env.MODE);
  console.log('Is DEV:', import.meta.env.DEV);
  console.log('Resolved path:', resolveImagePath(imagePath));
  console.groupEnd();
};