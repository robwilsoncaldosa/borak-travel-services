'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogoProps } from '../types/header.types';

export const Logo = ({ imageSrc, altText, className }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className || ''}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src={imageSrc}
            alt={altText}
            width={60}
            height={60}
            priority
            className="object-contain brightness-0 invert transform group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="text-white">
          <div className="text-2xl font-bold tracking-wide">
            BORAK<span className="text-blue-200">TRAVEL</span>
          </div>
        </div>
      </div>
    </Link>
  );
};