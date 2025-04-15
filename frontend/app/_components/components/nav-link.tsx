'use client';

import Link from 'next/link';
import { NavLinkProps } from '../types/header.types';

export const NavLink = ({ href, icon: Icon, label }: NavLinkProps) => {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-1 text-sm md:text-base font-medium hover:text-primary transition-all duration-200 hover:scale-105"
    >
      <Icon className="hidden md:inline-block text-primary/80" />
      <span>{label}</span>
    </Link>
  );
};