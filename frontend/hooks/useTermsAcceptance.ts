'use client';

import { useState, useEffect } from 'react';

const TERMS_ACCEPTANCE_KEY = 'borak-terms-accepted';
const TERMS_VERSION = '1.0'; // Update this when terms change to show modal again

export function useTermsAcceptance() {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(true); // Default to true to prevent flash
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(TERMS_ACCEPTANCE_KEY);
        const hasAccepted = stored === TERMS_VERSION;
        setHasAcceptedTerms(hasAccepted);
      } catch (error) {
        console.warn('Failed to read terms acceptance from localStorage:', error);
        setHasAcceptedTerms(false);
      }
      setIsLoading(false);
    }
  }, []);

  const acceptTerms = () => {
    try {
      localStorage.setItem(TERMS_ACCEPTANCE_KEY, TERMS_VERSION);
      setHasAcceptedTerms(true);
    } catch (error) {
      console.warn('Failed to save terms acceptance to localStorage:', error);
      // Still allow the user to continue even if localStorage fails
      setHasAcceptedTerms(true);
    }
  };

  const resetTermsAcceptance = () => {
    try {
      localStorage.removeItem(TERMS_ACCEPTANCE_KEY);
      setHasAcceptedTerms(false);
    } catch (error) {
      console.warn('Failed to remove terms acceptance from localStorage:', error);
    }
  };

  return {
    hasAcceptedTerms,
    acceptTerms,
    resetTermsAcceptance,
    isLoading,
  };
}