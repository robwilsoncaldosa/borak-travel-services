'use client';

import Link from 'next/link';
import { NavLinkProps } from '../types/header.types';

export const NavLink = ({ href, label, className }: NavLinkProps) => {
  return (
    <Link 
      href={href} 
      className={`text-white text-md font-bold tracking-wide hover:text-blue-200 transition-colors duration-200 hover:scale-105 transform ${className || ''}`}
    >
      <span>{label}</span>
    </Link>
  );
};