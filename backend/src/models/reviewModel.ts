import { supabase } from '../config/db';

export interface IReviews {
  id?: string;
  guest_id: string;
  package_id: string;
  review: string;
  rating: number;
  status: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

// Review operations using Supabase
export const Reviews = {
  // Create a new review
  create: async (data: Omit<IReviews, 'id' | 'created_at' | 'updated_at'>): Promise<IReviews> => {
    const { data: reviewData, error } = await supabase
      .from('reviews')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return reviewData;
  },

  // Find all reviews
  find: async (filter?: { package_id?: string; guest_id?: string; status?: string }): Promise<IReviews[]> => {
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter?.package_id) {
      query = query.eq('package_id', filter.package_id);
    }
    if (filter?.guest_id) {
      query = query.eq('guest_id', filter.guest_id);
    }
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Find review by ID
  findById: async (id: string): Promise<IReviews | null> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Update review
  findByIdAndUpdate: async (id: string, updateData: Partial<IReviews>): Promise<IReviews | null> => {
    const { data, error } = await supabase
      .from('reviews')
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

  // Delete review
  findByIdAndDelete: async (id: string): Promise<IReviews | null> => {
    const { data, error } = await supabase
      .from('reviews')
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

export default Reviews;
