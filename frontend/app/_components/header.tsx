'use client';

import { Card, CardContent } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import { FaCompass, FaMapMarkedAlt, FaPhone, FaHome } from 'react-icons/fa';
import { NavLink } from './components/nav-link';
import { Logo } from './components/logo';
import { HeaderProps, NavLinkProps } from './types/header.types';

const navLinks: NavLinkProps[] = [
  { href: '/', icon: FaHome, label: 'Home' },
  // { href: '/van-rentals', icon: FaShuttleVan, label: 'Van Rentals' },
  { href: '/packages', icon: FaCompass, label: 'Packages' },
  { href: '/locations', icon: FaMapMarkedAlt, label: 'Destinations' },
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
    <Card 
      className={`fixed top-0 z-50 w-full max-w-[95%] md:max-w-7xl left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${scrolled 
        ? 'mt-2 px-4 py-2 rounded-2xl bg-white/30 backdrop-blur-lg shadow-lg border border-white/20' 
        : 'mt-4 px-6 py-3 rounded-3xl bg-white/50 backdrop-blur-md shadow-xl hover:shadow-2xl border border-white/10'}`}
    >
      <CardContent className="flex items-center justify-between p-0">
        <Logo {...headerProps.logo} />
        <nav className="flex items-center gap-2 md:gap-6">
          {headerProps.navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}

export default Header;