// Image upload utilities for handling product images
// This solution uses Cloudinary for cloud storage

import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/lib/cloudinary';

export interface ImageUploadResult {
  url: string;
  name: string;
  size: number;
  publicId?: string; // Cloudinary public ID for management
}

// Compress image to reduce file size
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please use JPEG, PNG, or WebP.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }
  
  return { valid: true };
};

// Process multiple images for upload to Cloudinary
export const processImagesForUpload = async (files: File[]): Promise<ImageUploadResult[]> => {
  const results: ImageUploadResult[] = [];
  const validFiles: File[] = [];
  
  // First, validate all files
  for (const file of files) {
    const validation = validateImageFile(file);
    if (validation.valid) {
      validFiles.push(file);
    } else {
      console.error(`Invalid file ${file.name}: ${validation.error}`);
    }
  }
  
  if (validFiles.length === 0) {
    return results;
  }
  
  try {
    console.log(`Uploading ${validFiles.length} images to Cloudinary...`);
    
    // Upload all valid files to Cloudinary
    const cloudinaryResults = await uploadMultipleToCloudinary(validFiles);
    
    // Convert Cloudinary results to our ImageUploadResult format
    for (let i = 0; i < cloudinaryResults.length; i++) {
      const cloudinaryResult = cloudinaryResults[i];
      const originalFile = validFiles[i];
      
      const result: ImageUploadResult = {
        url: cloudinaryResult.secure_url, // Use Cloudinary's secure URL
        name: originalFile.name,
        size: originalFile.size,
        publicId: cloudinaryResult.public_id // Store for potential deletion later
      };
      
      results.push(result);
      console.log(`Uploaded to Cloudinary: ${originalFile.name} -> ${cloudinaryResult.secure_url}`);
    }
    
  } catch (error) {
    console.error('Failed to upload images to Cloudinary:', error);
    throw new Error('Image upload failed. Please try again.');
  }
  
  return results;
};

// Process single image for upload to Cloudinary
export const processSingleImageForUpload = async (file: File): Promise<ImageUploadResult> => {
  // Validate the file first
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file');
  }
  
  try {
    console.log(`Uploading ${file.name} to Cloudinary...`);
    
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file);
    
    const result: ImageUploadResult = {
      url: cloudinaryResult.secure_url,
      name: file.name,
      size: file.size,
      publicId: cloudinaryResult.public_id
    };
    
    console.log(`Uploaded to Cloudinary: ${file.name} -> ${cloudinaryResult.secure_url}`);
    return result;
    
  } catch (error) {
    console.error('Failed to upload image to Cloudinary:', error);
    throw new Error('Image upload failed. Please try again.');
  }
};

// Generate placeholder image URLs for development
export const generatePlaceholderUrls = (count: number): string[] => {
  return Array.from({ length: count }, () => `/placeholder.svg`);
};

// Convert file to base64 (kept for backward compatibility)
export const fileToBase64 = (file: File, maxSizeKB: number = 500): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // First compress the image
      const compressedBlob = await compressImage(file, 800, 0.8);
      const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
      
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result as string;
        const sizeKB = (result.length * 3) / 4 / 1024; // Approximate base64 size
        
        if (sizeKB > maxSizeKB) {
          // Try with lower quality if still too large
          compressImage(file, 600, 0.6).then(lowerQualityBlob => {
            const lowerQualityFile = new File([lowerQualityBlob], file.name, { type: 'image/jpeg' });
            const secondReader = new FileReader();
            secondReader.onload = () => {
              const secondResult = secondReader.result as string;
              const secondSizeKB = (secondResult.length * 3) / 4 / 1024;
              
              if (secondSizeKB > maxSizeKB) {
                reject(new Error(`Image too large even after compression: ${secondSizeKB.toFixed(1)}KB (max: ${maxSizeKB}KB)`));
              } else {
                resolve(secondResult);
              }
            };
            secondReader.onerror = () => reject(new Error('Failed to read compressed file'));
            secondReader.readAsDataURL(lowerQualityFile);
          });
        } else {
          resolve(result);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      reject(new Error('Failed to compress image'));
    }
  });
};