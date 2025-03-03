import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-teal-950 text-white p-4 px-16 flex justify-between">
      <p>&copy; 2025 All rights reserved</p>
      <nav className="space-x-20">
        <Link href="">Twitter</Link>
        <Link href="">Facebook</Link>
        <Link href="">Github</Link>
        <Link href="">Instagram</Link>
      </nav>
    </footer>
  );
}
