import { useState, useEffect, useCallback } from 'react';

export default function ImageGallery({ folderName, productName }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Discover all available images for this product
  useEffect(() => {
    const imageExtensions = ['webp', 'jpg', 'jpeg', 'png', 'avif'];
    const discoveredImages = [];
    let imageNumber = 1;
    let failedAttempts = 0;
    const maxFailedAttempts = imageExtensions.length;

    const tryLoadImage = (number, extIndex = 0) => {
      if (extIndex >= imageExtensions.length) {
        // Tried all extensions for this number
        failedAttempts++;
        if (failedAttempts >= maxFailedAttempts || number > 10) {
          // No more images or reached limit
          setImages(discoveredImages);
          setIsLoading(false);
          return;
        }
        // Try next number
        tryLoadImage(number + 1, 0);
        return;
      }

      const ext = imageExtensions[extIndex];
      const path = `/images/${folderName}/${folderName}_${number}.${ext}`;
      
      const img = new Image();
      img.onload = () => {
        discoveredImages.push(path);
        failedAttempts = 0; // Reset on success
        // Try next number
        tryLoadImage(number + 1, 0);
      };
      img.onerror = () => {
        // Try next extension
        tryLoadImage(number, extIndex + 1);
      };
      img.src = path;
    };

    tryLoadImage(1, 0);
  }, [folderName]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const openLightbox = (index = currentIndex) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, goToNext, goToPrev]);

  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setTouchStart(null);
  };

  if (isLoading) {
    return (
      <div className="gallery-loading">
        <div className="gallery-spinner"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="gallery-placeholder">
        <i className="fas fa-image"></i>
        <span>No Image</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery View */}
      <div className="image-gallery">
        <div 
          className="gallery-main"
          onClick={() => openLightbox()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={images[currentIndex]} 
            alt={`${productName} - Image ${currentIndex + 1}`}
            loading="lazy"
          />
          
          {/* Expand Icon */}
          <div className="gallery-expand-hint">
            <i className="fas fa-expand"></i>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="gallery-counter">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              className="gallery-nav gallery-nav-prev"
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              aria-label="Previous image"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="gallery-nav gallery-nav-next"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              aria-label="Next image"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="gallery-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
        >
          <div 
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button 
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Main Image */}
            <div className="lightbox-image-container">
              <img 
                src={images[currentIndex]} 
                alt={`${productName} - Image ${currentIndex + 1}`}
              />
            </div>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button 
                  className="lightbox-nav lightbox-nav-prev"
                  onClick={goToPrev}
                  aria-label="Previous image"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  className="lightbox-nav lightbox-nav-next"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="lightbox-counter">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="lightbox-thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`lightbox-thumb ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

