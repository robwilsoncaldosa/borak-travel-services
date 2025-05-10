import { instance } from '../axios';

export interface Package {
    _id: string;
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
} 

export const packageApi = {
    getAllPackages: async () => {
      const response = await instance.get<Package[]>('/api/packages');
      return response.data;
    },

    getPackageById: async (id: string) => {
      const response = await instance.get<Package>(`/api/packages/${id}`);
      return response.data;
    },

    createPackage: async (packageData: Omit<Package, '_id' | 'created_at' | 'updated_at'>) => {
      const response = await instance.post<Package>('/api/packages/create', packageData);
      return response.data;
    },
    
    updatePackage: async (id: string, packageData: Omit<Package, '_id' | 'created_at' | 'updated_at'>) => {
      const response = await instance.put<Package>(`/api/packages/${id}`, packageData);
      return response.data;
    },

    deletePackage: async (id: string) => {
      const response = await instance.delete(`/api/packages/${id}`);
      return response.data;
    }
}