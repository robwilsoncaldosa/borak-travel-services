'use client';

import { usePathname } from 'next/navigation';
import Header from "./_components/header";
import Footer from "./_components/footer";
import Chatbot from "@/components/ui/chatbot";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminDashboard = pathname.includes('/admin');
  const showCustomerInterface = !isAdminDashboard;

  return (
    <>
      {showCustomerInterface && <Header />}
      {children}
      {showCustomerInterface && <Chatbot />}
      {showCustomerInterface && <Footer />}
    </>
  );
}