import { supabase } from '../config/db';

export interface IPackage {
  id?: string;
  title: string;
  location: string;
  duration_hours: number;
  about_tour: string;
  highlights: string[];
  activities: string[];
  inclusions: string[];
  images: string[];
  created_at?: string;
  updated_at?: string;
  rating?: number;
  reviews?: number;
  maxGuests?: number;
  itinerary?: Array<{
    time: string;
    activity: string;
  }>;
  longDescription?: string;
}

// Package operations using Supabase
export const Package = {
  // Create a new package
  create: async (data: Omit<IPackage, 'id' | 'created_at' | 'updated_at'>): Promise<IPackage> => {
    const { data: packageData, error } = await supabase
      .from('packages')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return packageData;
  },

  // Find all packages
  find: async (): Promise<IPackage[]> => {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Find package by ID
  findById: async (id: string): Promise<IPackage | null> => {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Update package
  findByIdAndUpdate: async (id: string, updateData: Partial<IPackage>): Promise<IPackage | null> => {
    const { data, error } = await supabase
      .from('packages')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Delete package
  findByIdAndDelete: async (id: string): Promise<IPackage | null> => {
    const { data, error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },
};

export default Package;
