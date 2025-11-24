/**
 * Image matching utility
 * Matches product names to image folder names using the same safeName logic
 * as product-images-fetcher/index.js
 */

/**
 * Converts a product name to a safe folder name format
 * Matches the logic from product-images-fetcher/index.js
 */
export function safeName(name) {
  return name ? name.replace(/[\/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_').slice(0, 200) : 'unknown';
}

/**
 * Finds the first image in a product's folder
 * @param {string} productName - The corrected description from CSV
 * @returns {string|null} - Path to the first image or null if not found
 */
export function findProductImage(productName) {
  const folderName = safeName(productName);
  const imagePath = `/kashmira-shah/images/${folderName}`;
  
  // In a real scenario, we'd need to check if files exist
  // For now, we'll return the expected path and let the component handle missing images
  // The actual image file will be determined at runtime by checking available files
  return imagePath;
}

/**
 * Gets the image path for a product
 * Returns the path to the first image in the folder (sorted alphabetically)
 * @param {string} productName - The corrected description from CSV
 * @param {string[]} availableImages - List of available image files (optional)
 * @returns {string|null} - Full path to the image or null
 */
export function getProductImagePath(productName, availableImages = []) {
  const folderName = safeName(productName);
  
  // If we have a list of available images, find the first one for this product
  if (availableImages.length > 0) {
    const productImages = availableImages.filter(img => 
      img.includes(folderName)
    ).sort();
    
    if (productImages.length > 0) {
      return `/kashmira-shah/images/${productImages[0]}`;
    }
  }
  
  // Fallback: return expected path (component will handle 404)
  return `/kashmira-shah/images/${folderName}/${folderName}_1.jpg`;
}

