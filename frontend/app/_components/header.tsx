'use client';

import React, { useState, useEffect } from 'react';
import { FaCompass, FaPhone, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from './components/nav-link';
import { Logo } from './components/logo';
import { HeaderProps, NavLinkProps } from './types/header.types';

const navLinks: NavLinkProps[] = [
  { href: '/', icon: FaHome, label: 'Home' },
  { href: '/packages', icon: FaCompass, label: 'Packages' },
  // { href: '/locations', icon: FaMapMarkedAlt, label: 'Destinations' },
  { href: '/contact', icon: FaPhone, label: 'Contact' },
];

const headerProps: HeaderProps = {
  logo: {
    imageSrc: '/Brown_Minimal_Solo_Tour___Travel_Logo__3_-removebg-preview 2.png',
    altText: 'Travel Cebu',
    title: 'Travel Cebu',
  },
  navLinks,
};

// Mobile Header Component
interface LogoProps {
  imageSrc: string;
  altText: string;
  title: string;
}

function MobileHeader({ 
  logo, 
  navLinks, 
  scrolled 
}: { 
  logo: LogoProps;
  navLinks: NavLinkProps[]; 
  scrolled: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-teal-950 shadow-lg' 
          : 'bg-teal-950'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          <Logo {...logo} />
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Open menu"
          >
            <FaBars className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-[60] transition-all duration-500 ease-in-out ${
          isOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }`}
      >
        <div 
          className={`absolute inset-0 bg-teal-950 transition-all duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={`relative h-full flex flex-col transition-all duration-500 ease-out ${
            isOpen 
              ? 'translate-x-0' 
              : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-6 bg-teal-950">
            <Logo {...logo} />
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Close menu"
            >
              <FaTimes className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Navigation Links - Now positioned at the top */}
          <nav className="px-6 pt-4 bg-teal-950">
            <div className="space-y-4">
              {navLinks.map((link, index) => (
                <div
                  key={link.href}
                  className={`transform transition-all duration-500 ease-out ${
                    isOpen 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-8 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: isOpen ? `${index * 100 + 200}ms` : '0ms' 
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-white text-lg font-medium tracking-wide hover:text-blue-200 transition-colors duration-300 py-3 px-4 rounded-lg hover:bg-white/10"
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

// Desktop Header Component
function DesktopHeader({ 
  logo, 
  navLinks, 
  scrolled 
}: { 
  logo: LogoProps;
  navLinks: NavLinkProps[]; 
  scrolled: boolean; 
}) {
  return (
    <div className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      typeof window !== 'undefined' && window.location.pathname.startsWith('/packages/') 
        ? 'bg-teal-950'
        : scrolled 
          ? 'bg-teal-950 shadow-lg' 
          : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Logo {...logo} />
          
          <nav className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

// Main Header Component
function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  return (
    <>
      <DesktopHeader 
        logo={headerProps.logo} 
        navLinks={headerProps.navLinks} 
        scrolled={scrolled} 
      />
      <MobileHeader 
        logo={headerProps.logo} 
        navLinks={headerProps.navLinks} 
        scrolled={scrolled} 
      />
    </>
  );
}

export default Header;