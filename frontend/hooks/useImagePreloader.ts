'use client';

import { useState, useEffect } from 'react';

interface UseImagePreloaderProps {
  images: string[];
  minLoadingTime?: number; // Minimum time to show loading screen (in ms)
}

export function useImagePreloader({ images, minLoadingTime = 2000 }: UseImagePreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let loadedCount = 0;

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadedImages(prev => new Set([...prev, src]));
          setProgress((loadedCount / images.length) * 100);
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setProgress((loadedCount / images.length) * 100);
          resolve(); // Still resolve to not block other images
        };
        img.src = src;
      });
    };

    const loadAllImages = async () => {
      try {
        await Promise.all(images.map(preloadImage));
        
        // Ensure minimum loading time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      } catch (error) {
        console.error('Error preloading images:', error);
        // Still hide loading screen even if some images failed
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };

    if (images.length > 0) {
      loadAllImages();
    } else {
      // If no images to load, still respect minimum loading time
      setTimeout(() => {
        setIsLoading(false);
      }, minLoadingTime);
    }
  }, [images, minLoadingTime]);

  return {
    isLoading,
    progress,
    loadedImages: Array.from(loadedImages),
    allImagesLoaded: loadedImages.size === images.length
  };
}