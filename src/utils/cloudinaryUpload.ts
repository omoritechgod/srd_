export interface CloudinaryUploadOptions {
  cloudName: string;
  uploadPreset: string;
  folder: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  [key: string]: any;
}

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Cloudinary
 * @param file - The file to upload
 * @param options - Cloudinary configuration options
 * @returns Promise with upload result
 */
export const uploadToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions
): Promise<CloudinaryUploadResult> => {
  try {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 10MB'
      };
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'File type not supported. Please upload PDF, DOC, DOCX, TXT, JPG, or PNG files only.'
      };
    }

    // Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', options.uploadPreset);
    formData.append('folder', options.folder);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${options.cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error?.message || `Upload failed with status ${response.status}`
      };
    }

    const data: CloudinaryUploadResponse = await response.json();

    return {
      success: true,
      url: data.secure_url
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed. Please try again.'
    };
  }
};

/**
 * Default Cloudinary configuration for SRD Consulting
 */
export const SRD_CLOUDINARY_CONFIG: CloudinaryUploadOptions = {
  cloudName: 'dlkxd6utm',
  uploadPreset: 'booking',
  folder: 'booking'
};