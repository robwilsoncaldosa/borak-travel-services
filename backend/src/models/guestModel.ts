import { supabase } from '../config/db';

export interface IGuestUser {
  id?: string;
  username: string;
  email: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  mobile?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

// Guest User operations using Supabase
export const GuestUser = {
  // Create a new guest user
  create: async (data: Omit<IGuestUser, 'id' | 'created_at' | 'updated_at'>): Promise<IGuestUser> => {
    const { data: guestData, error } = await supabase
      .from('guest_users')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return guestData;
  },

  // Find all guest users
  find: async (): Promise<IGuestUser[]> => {
    const { data, error } = await supabase
      .from('guest_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Find guest user by ID
  findById: async (id: string): Promise<IGuestUser | null> => {
    const { data, error } = await supabase
      .from('guest_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Find guest user by email
  findOne: async (filter: { email?: string; id?: string }): Promise<IGuestUser | null> => {
    let query = supabase
      .from('guest_users')
      .select('*')
      .limit(1);

    if (filter.email) {
      query = query.eq('email', filter.email);
    }
    if (filter.id) {
      query = query.eq('id', filter.id);
    }

    const { data, error } = await query;
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data && data.length > 0 ? data[0] : null;
  },

  // Update guest user
  findByIdAndUpdate: async (id: string, updateData: Partial<IGuestUser>): Promise<IGuestUser | null> => {
    const { data, error } = await supabase
      .from('guest_users')
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

  // Delete guest user
  findByIdAndDelete: async (id: string): Promise<IGuestUser | null> => {
    const { data, error } = await supabase
      .from('guest_users')
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

export default GuestUser;
