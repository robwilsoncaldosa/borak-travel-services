import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-teal-950 text-white p-4 px-16 flex flex-col md:flex-row md:justify-between items-center">
      <nav className="space-x-8 md:space-x-20 mb-4 md:mb-0">
        <Link href="">Twitter</Link>
        <Link href="">Facebook</Link>
        <Link href="">Github</Link>
        <Link href="">Instagram</Link>
      </nav>
      <p className="text-center">&copy; 2025 All rights reserved</p>
    </footer>
  );
}
