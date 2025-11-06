import { supabase } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export interface IUser {
  id?: string;
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  mobile: string;
  nationality: string;
  status?: string;
  role?: string;
  created_at?: string | Date;
}

// User operations using Supabase
export const User = {
  // Create a new user
  create: async (data: Omit<IUser, 'id' | 'user_id' | 'created_at'>): Promise<IUser> => {
    const user_id = uuidv4();
    const { data: userData, error } = await supabase
      .from('users')
      .insert([{
        ...data,
        user_id,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return userData;
  },

  // Find all users
  find: async (filter?: { email?: string; user_id?: string; role?: string }): Promise<IUser[]> => {
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter?.email) {
      query = query.eq('email', filter.email);
    }
    if (filter?.user_id) {
      query = query.eq('user_id', filter.user_id);
    }
    if (filter?.role) {
      query = query.eq('role', filter.role);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Find user by ID
  findById: async (id: string): Promise<IUser | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Find user by user_id
  findOne: async (filter: { email?: string; user_id?: string }): Promise<IUser | null> => {
    let query = supabase
      .from('users')
      .select('*')
      .limit(1);

    if (filter.email) {
      query = query.eq('email', filter.email);
    }
    if (filter.user_id) {
      query = query.eq('user_id', filter.user_id);
    }

    const { data, error } = await query;
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data && data.length > 0 ? data[0] : null;
  },

  // Update user
  findByIdAndUpdate: async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Update user by user_id
  findOneAndUpdate: async (filter: { user_id?: string; email?: string }, updateData: Partial<IUser>): Promise<IUser | null> => {
    let query = supabase
      .from('users')
      .update(updateData);

    if (filter.user_id) {
      query = query.eq('user_id', filter.user_id);
    }
    if (filter.email) {
      query = query.eq('email', filter.email);
    }

    const { data, error } = await query
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Delete user
  findByIdAndDelete: async (id: string): Promise<IUser | null> => {
    const { data, error } = await supabase
      .from('users')
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

export default User;
