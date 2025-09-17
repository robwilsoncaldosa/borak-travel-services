'use client';

import { usePathname } from 'next/navigation';
import Header from "./_components/header";
import Footer from "./_components/footer";
import Chatbot from "@/components/ui/chatbot";
import TermsModal from "@/components/TermsModal";
import { useTermsAcceptance } from "@/hooks/useTermsAcceptance";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminDashboard = pathname.includes('/admin');
  const showCustomerInterface = !isAdminDashboard;
  
  const { hasAcceptedTerms, acceptTerms, isLoading } = useTermsAcceptance();

  return (
    <>
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
    </>
  );
}