'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Share2, Heart, User, Phone } from 'lucide-react';
import Reviews from '@/components/ui/reviews';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Package, packageApi } from '@/lib/backend_api/package';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper function to validate and format image URL
const getValidImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return '/Landing.jpg';

    try {
        new URL(imageUrl);
        return imageUrl;
    } catch {
        if (imageUrl.startsWith('/')) {
            return imageUrl;
        }
        return `/uploads/${imageUrl}`;
    }
};

// Form schema for booking
const bookingFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    contact: z.string().min(6, { message: "Please enter a valid contact number" }),
    dateRange: z.object({
        from: z.date(),
        to: z.date().optional(),
    }).optional(),
    guests: z.string().min(1, { message: "Please select number of guests" }),
});

export default function PackageDetail() {
    const params = useParams();
    const router = useRouter();
    const [packageData, setPackageData] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Initialize form
    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            name: "",
            contact: "",
            dateRange: { from: new Date() },
            guests: "",
        },
    });

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                if (!params.id || typeof params.id !== 'string') {
                    throw new Error('Invalid package ID');
                }
                const data = await packageApi.getPackageById(params.id);
                setPackageData(data);
            } catch (error) {
                console.error('Error fetching package:', error);
                toast.error('Failed to load package details');
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [params.id]);

    const handleBookNow = (values: z.infer<typeof bookingFormSchema>) => {
        try {
            if (packageData) {
                // Generate a unique booking ID (in a real app, this would come from the backend)
                const bookingId = `BKG-${Date.now().toString().slice(-6)}`;
                
                // Store booking details in localStorage for retrieval on confirmation page
                localStorage.setItem("bookingName", values.name);
                localStorage.setItem("bookingContact", values.contact);
                localStorage.setItem("bookingDateFrom", values.dateRange?.from ? values.dateRange.from.toISOString() : "");
                localStorage.setItem("bookingDateTo", values.dateRange?.to ? values.dateRange.to.toISOString() : "");
                localStorage.setItem("bookingGuests", values.guests);
                localStorage.setItem("bookingTour", packageData.title);
                
                // Navigate to confirmation page with booking details
                router.push(`/confirmation/${bookingId}?tour=${packageData.title.toLowerCase().replace(/ /g, '_')}&guests=${values.guests}`);
            }
        } catch (error) {
            console.error("Booking submission error", error);
            toast.error("Failed to submit the booking. Please try again.");
        }
    };

    const nextImage = () => {
        if (packageData?.images) {
            setCurrentImageIndex((prev) => 
                prev === packageData.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const previousImage = () => {
        if (packageData?.images) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? packageData.images.length - 1 : prev - 1
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!packageData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Package not found</h1>
                <Link href="/packages" className="text-blue-600 hover:underline">Return to packages</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Image Carousel */}
            <div className="relative h-[600px] w-full">
                <Image
                    src={getValidImageUrl(packageData.images[currentImageIndex])}
                    alt={packageData.title}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                        // @ts-ignore
                        e.currentTarget.src = '/Landing.jpg';
                    }}
                />
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Navigation Arrows */}
                {packageData.images.length > 1 && (
                    <>
                        <button
                            onClick={previousImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{packageData.title}</h1>
                        <p className="text-xl text-white/90">{packageData.location}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Duration */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Duration</h2>
                        <p className="text-lg text-gray-700">{packageData.duration_hours} Hours</p>
                    </div>

                    {/* About Tour */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
                        <p className="text-gray-700 whitespace-pre-line">{packageData.about_tour}</p>
                    </div>

                    {/* Highlights */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
                        <ul className="space-y-3">
                            {packageData.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Activities */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Activities</h2>
                        <ul className="space-y-3">
                            {packageData.activities.map((activity, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-700">{activity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Inclusions */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Inclusions</h2>
                        <ul className="space-y-3">
                            {packageData.inclusions.map((inclusion, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{inclusion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in this package?</h2>
                        <p className="text-gray-700 mb-4">Contact us for pricing and availability.</p>
                        <Link
                            href="/contact"
                            className="inline-block bg-[#2E2E2E] text-white px-8 py-3 rounded-md font-semibold tracking-wide transition-all duration-300 hover:bg-gray-700"
                        >
                            Contact Us Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}