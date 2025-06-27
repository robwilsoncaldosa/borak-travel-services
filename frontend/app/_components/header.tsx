'use client';

import { Card, CardContent } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import { FaCompass, FaMapMarkedAlt, FaPhone, FaHome, FaBars, FaTimes } from 'react-icons/fa';
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
    altText: 'Borak Travel Services',
    title: 'Borak Travel',
  },
  navLinks,
};

// Mobile Header Component
function MobileHeader({ 
  logo, 
  navLinks, 
  scrolled 
}: { 
  logo: any; 
  navLinks: NavLinkProps[]; 
  scrolled: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header Bar */}
      <Card 
        className={`md:hidden fixed top-0 rounded-full z-50 w-full max-w-[95%] left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${scrolled 
          ? 'mt-2 px-4 py-2 bg-white/30 backdrop-blur-lg shadow-lg border border-white/20' 
          : 'mt-4 px-6 py-3 bg-white/50 backdrop-blur-md shadow-xl hover:shadow-2xl border border-white/10'}`}
      >
        <CardContent className="flex items-center justify-between p-0">
          <Logo {...logo} />
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            aria-label="Open menu"
          >
            <FaBars className="h-5 w-5 text-gray-700" />
          </button>
        </CardContent>
      </Card>

      {/* Full Screen Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-[60] transition-all duration-500 ease-in-out ${
          isOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }`}
      >
        {/* Background Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md transition-all duration-500 ${
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
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <Logo {...logo} className="brightness-0 invert" />
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Close menu"
            >
              <FaTimes className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center px-6">
            <div className="space-y-2">
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
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                      <link.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                      {link.label}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-white/60 text-sm">
                Discover amazing destinations with us
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <FaPhone className="h-4 w-4 text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <FaMapMarkedAlt className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
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
  logo: any; 
  navLinks: NavLinkProps[]; 
  scrolled: boolean; 
}) {
  return (
    <Card 
      className={`hidden md:block fixed top-0 rounded-full z-50 w-full max-w-[95%] lg:max-w-7xl left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${scrolled 
        ? 'mt-2 px-4 py-2 bg-white/30 backdrop-blur-lg shadow-lg border border-white/20' 
        : 'mt-4 px-6 py-3 bg-white/50 backdrop-blur-md shadow-xl hover:shadow-2xl border border-white/10'}`}
    >
      <CardContent className="flex items-center justify-between p-0">
        <Logo {...logo} />
        
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </CardContent>
    </Card>
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