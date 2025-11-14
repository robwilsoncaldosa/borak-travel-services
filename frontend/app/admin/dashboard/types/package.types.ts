export interface Package {
    id?: string;
    _id?: string; // Keep for backward compatibility during migration
    title: string;
    location: string;
    duration_hours: number;
    about_tour: string;
    highlights: string[];
    activities: string[];
    inclusions: string[];
    images: string[];
    created_at: string;
    updated_at: string;
    rating?: number;
    reviews?: number;
    maxGuests?: number;
    itinerary?: Array<{
      time: string;
      activity: string;
    }>;
    longDescription?: string;
    price?: number;
} 