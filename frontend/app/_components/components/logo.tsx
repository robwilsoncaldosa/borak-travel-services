'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogoProps } from '../types/header.types';

export const Logo = ({ imageSrc, altText, title }: LogoProps) => {
  return (
    <Link href="/" className="flex items-center space-x-3 group relative">
      <div className="relative overflow-hidden rounded-full p-1.5 bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-500 ease-in-out shadow-lg hover:shadow-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse"></div>
        <Image
          src={imageSrc}
          alt={altText}
          width={48}
          height={48}
          priority
          className="object-contain transform group-hover:scale-110 transition-transform duration-500 ease-in-out relative z-10"
        />
      </div>
      <span className="text-2xl font-bold hidden md:block">
        <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent transition-all duration-500 ease-in-out group-hover:bg-gradient-to-r group-hover:from-primary/90 group-hover:via-primary group-hover:to-primary/90">
          {title}
        </span>
      </span>
    </Link>
  );
};