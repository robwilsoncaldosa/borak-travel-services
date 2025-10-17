'use client';

import { usePathname } from 'next/navigation';
import Header from "./_components/header";
import Footer from "./_components/footer";
import Chatbot from "@/components/ui/chatbot";
import TermsModal from "@/components/TermsModal";
import LoadingScreen from "@/components/ui/loading-screen";
import { useTermsAcceptance } from "@/hooks/useTermsAcceptance";
import { useImagePreloader } from "@/hooks/useImagePreloader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminDashboard = pathname.includes('/admin');
  const showCustomerInterface = !isAdminDashboard;

  const { hasAcceptedTerms, acceptTerms, isLoading } = useTermsAcceptance();

  // Preload critical images for the landing page
  const imagesToPreload = [
    '/landing-page.jpg',
    '/cebu-aerial.png',
    '/cebu-beach.png',
    '/cebu-city.png',
    '/tour-package-1.png',
    '/tour-package-2.png',
    '/tour-package-3.png'
  ];

  const { isLoading: isImagesLoading, progress: imageProgress } = useImagePreloader({
    images: imagesToPreload,
    minLoadingTime: 5000 // Show loading for at least 5 seconds
  });

  // Show loading screen if images are loading or if we're on the home page
  const shouldShowLoading = isImagesLoading && (pathname === '/' || pathname === '');

  return (
    <>
      <LoadingScreen 
        isLoading={shouldShowLoading} 
        progress={imageProgress}
      />
      <div className={shouldShowLoading ? 'hidden' : 'block'}>
        {showCustomerInterface && <Header />}
        {children}
        {/* @ts-expect-error I don't know how to fix this */}
        {showCustomerInterface && <Chatbot />}
        {showCustomerInterface && <Footer />}

        {/* Terms Modal - only show for customer interface and when terms haven't been accepted */}
        {showCustomerInterface && !isLoading && (
          <TermsModal
            isOpen={!hasAcceptedTerms}
            onAccept={acceptTerms}
          />
        )}
      </div>
    </>
  );
}