const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const ensureCloudinaryConfig = () => {
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error(
      'Cloudinary credentials are missing. Set CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env'
    );
  }
};

const removeLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, folder = 'shopo') => {
  try {
    ensureCloudinaryConfig();

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
    });

    // Delete local file after upload
    removeLocalFile(filePath);

    return result.secure_url; // Return the secure URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);

    // Also remove the temp file if Cloudinary rejects the upload.
    removeLocalFile(filePath);

    throw new Error(error.message || 'Failed to upload image to Cloudinary');
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    ensureCloudinaryConfig();

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return null;
  }

  const pathAfterUpload = url.slice(uploadIndex + '/upload/'.length);
  const withoutQuery = pathAfterUpload.split('?')[0];
  const withoutVersion = withoutQuery.replace(/^v\d+\//, '');
  const extensionIndex = withoutVersion.lastIndexOf('.');

  if (extensionIndex === -1) {
    return withoutVersion;
  }

  return withoutVersion.slice(0, extensionIndex);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl,
};
