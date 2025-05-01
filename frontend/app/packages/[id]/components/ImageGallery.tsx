import React from 'react';
import Image from 'next/image';
import { Package } from '@/lib/backend_api/package';
import { getValidImageUrl } from './utils';

export interface ImageGalleryProps {
    packageData: Package;
}

export const ImageGallery = ({ packageData }: ImageGalleryProps) => {
    const images = packageData.images || [];
    const imageCount = images.length;

    if (imageCount === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-200 rounded-lg mb-8">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    if (imageCount === 1) {
        return (
            <div className="h-96 md:h-[500px] relative rounded-lg overflow-hidden mb-8">
                <Image
                    src={getValidImageUrl(images[0])}
                    alt={packageData.title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        );
    }

    if (imageCount === 2) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {images.map((image, index) => (
                    <div key={index} className="h-96 relative rounded-lg overflow-hidden">
                        <Image
                            src={getValidImageUrl(image)}
                            alt={`${packageData.title} - image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>
        );
    }

    if (imageCount === 3) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2 h-96 relative rounded-lg overflow-hidden">
                    <Image
                        src={getValidImageUrl(images[0])}
                        alt={packageData.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="grid grid-rows-2 gap-4">
                    {images.slice(1, 3).map((image, index) => (
                        <div key={index} className="h-44 relative rounded-lg overflow-hidden">
                            <Image
                                src={getValidImageUrl(image)}
                                alt={`${packageData.title} - image ${index + 2}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Default layout for 4 or more images (similar to original, showing up to 5)
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 h-96 relative rounded-lg overflow-hidden">
                <Image
                    src={getValidImageUrl(images[0])}
                    alt={packageData.title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((image, index) => (
                    <div key={index} className="h-44 relative rounded-lg overflow-hidden">
                        <Image
                            src={getValidImageUrl(image)}
                            alt={`${packageData.title} - image ${index + 2}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};