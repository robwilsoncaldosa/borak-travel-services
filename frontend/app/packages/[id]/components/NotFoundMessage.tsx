import React from 'react';
import Link from 'next/link';

export const NotFoundMessage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Package not found</h1>
        <Link href="/packages" className="text-blue-600 hover:underline">Return to packages</Link>
    </div>
);