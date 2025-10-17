'use client';

import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  progress?: number; // Accept external progress from image preloader
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ isLoading, progress: externalProgress, onLoadingComplete }: LoadingScreenProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use external progress if provided, otherwise use internal progress
  const displayProgress = externalProgress !== undefined ? externalProgress : internalProgress;

  useEffect(() => {
    if (!isLoading && !isTransitioning) {
      setIsTransitioning(true);
      // Smooth fade out when loading completes
      const timer = setTimeout(() => {
        setShowContent(false);
        setIsTransitioning(false);
        onLoadingComplete?.();
      }, 600); // Slightly faster transition for better UX
      return () => clearTimeout(timer);
    } else if (isLoading) {
      // Reset states when loading starts
      setInternalProgress(0);
      setIsTransitioning(false);
      setShowContent(true);
    }
  }, [isLoading, onLoadingComplete, isTransitioning]);

  useEffect(() => {
    if (isLoading && externalProgress === undefined) {
      // Only use internal progress simulation if no external progress is provided
      const interval = setInterval(() => {
        setInternalProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 12;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isLoading, externalProgress]);

  if (!showContent) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-600 ${
        isLoading && showContent ? 'opacity-100' : 'opacity-0'
      }`} 
      style={{ 
        zIndex: 99999,
        pointerEvents: (isLoading && showContent) ? 'auto' : 'none'
      }}
    >
      {/* Clean Minimalist Background with Strong Contrast */}
      <div className="absolute inset-0 bg-card dark:bg-background">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-muted/20 dark:from-card/30 dark:via-transparent dark:to-muted/10"></div>
        
        {/* Single subtle accent element */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Centered Loading Content */}
      <div className="relative z-50 text-center px-6 max-w-sm">
        {/* Brand Identity */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Compass className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-0 w-12 h-12 border-2 border-primary/20 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-4xl font-light text-foreground mb-2 tracking-wide">
            Borak Travel
          </h1>
          <p className="text-muted-foreground text-sm font-light tracking-widest uppercase opacity-80">
            Preparing Your Journey
          </p>
        </div>

        {/* Clean Progress Bar */}
        <div className="mb-12">
          <div className="w-64 mx-auto mb-4">
            <div className="bg-border dark:bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${displayProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-xs font-light tracking-wide">
            {Math.round(displayProgress)}%
          </p>
        </div>

        {/* Minimal Loading Dots */}
        <div className="flex justify-center space-x-1.5">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}