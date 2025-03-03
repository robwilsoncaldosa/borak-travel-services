import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <Card className="fixed top-8 z-50 w-full max-w-7xl left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full">
      <CardContent className="flex items-center">
        <nav className="flex items-center space-x-8 w-full justify-evenly">
          <Link href="/" className="text-lg font-semibold hover:text-primary">Home</Link>
          <Link href="/fleet" className="text-lg hover:text-primary">Our Fleet & Rates</Link>
          <Link href="/packages" className="text-lg hover:text-primary">Travel Packages</Link>
          <Link href="/locations" className="text-lg hover:text-primary">Destinations</Link>
          <Link href="/contact" className="text-lg hover:text-primary">Contact Us</Link>
        </nav>
      </CardContent>
    </Card>  )
}

export default Header