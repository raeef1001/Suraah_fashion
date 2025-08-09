// Cloudinary configuration and upload utilities
import { Cloudinary } from 'cloudinary-core';

// Initialize Cloudinary (you'll need to set these environment variables)
const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  secure: true
});

// Cloudinary upload preset (you'll need to create this in your Cloudinary dashboard)
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'suraah_fashion_uploads';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

// Upload image to Cloudinary
export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  // Check if environment variables are set
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set in environment variables');
  }
  
  if (!uploadPreset) {
    throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not set in environment variables');
  }
  
  console.log('Uploading to Cloudinary:', {
    cloudName,
    uploadPreset,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'suraah-fashion/products'); // Organize uploads in folders

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary API Error:', result);
      throw new Error(`Upload failed: ${result.error?.message || response.statusText}`);
    }

    console.log('Cloudinary upload success:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleToCloudinary = async (files: File[]): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  
  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Failed to upload one or more images');
  }
};

// Generate optimized image URL with transformations
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
} = {}) => {
  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality,
    fetch_format: format,
    secure: true
  });
};

// Delete image from Cloudinary (requires backend for security)
// This is a placeholder - actual deletion should be done via backend
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  console.warn('Image deletion should be implemented via backend for security');
  // In a real implementation, you'd call your backend API which would handle the deletion
  // using Cloudinary's admin API with your API secret
  return false;
};

export default cloudinary;