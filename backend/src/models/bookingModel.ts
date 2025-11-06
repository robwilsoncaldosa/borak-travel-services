import { supabase } from '../config/db';

export interface IBooking {
  id?: string;
  user_id: string;
  package_id: string;
  destination: string;
  pickup_location: string;
  pickup_date: string | Date;
  return_date: string | Date;
  pickup_time?: string;
  return_time?: string;
  status: 'PENDING' | 'VERIFIED' | 'INPROGRESS' | 'RENDERED';
  payment_status: 'FULL' | 'PARTIAL' | 'PENDING' | 'REFUNDED';
  created_at?: string | Date;
  updated_at?: string | Date;
  packs: number;
  price: number | null;
  paid_amount: number | null;
}

// Booking operations using Supabase
export const Booking = {
  // Create a new booking
  create: async (data: Omit<IBooking, 'id' | 'created_at' | 'updated_at'>): Promise<IBooking> => {
    const { data: bookingData, error } = await supabase
      .from('bookings')
      .insert([{
        ...data,
        pickup_date: data.pickup_date instanceof Date ? data.pickup_date.toISOString() : data.pickup_date,
        return_date: data.return_date instanceof Date ? data.return_date.toISOString() : data.return_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return bookingData;
  },

  // Find all bookings
  find: async (filter?: { user_id?: string; status?: string; payment_status?: string }): Promise<IBooking[]> => {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter?.user_id) {
      query = query.eq('user_id', filter.user_id);
    }
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }
    if (filter?.payment_status) {
      query = query.eq('payment_status', filter.payment_status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Find booking by ID
  findById: async (id: string): Promise<IBooking | null> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Update booking
  findByIdAndUpdate: async (id: string, updateData: Partial<IBooking>): Promise<IBooking | null> => {
    const updatePayload: any = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    if (updateData.pickup_date) {
      updatePayload.pickup_date = updateData.pickup_date instanceof Date 
        ? updateData.pickup_date.toISOString() 
        : updateData.pickup_date;
    }
    if (updateData.return_date) {
      updatePayload.return_date = updateData.return_date instanceof Date 
        ? updateData.return_date.toISOString() 
        : updateData.return_date;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Delete booking
  findByIdAndDelete: async (id: string): Promise<IBooking | null> => {
    const { data, error } = await supabase
      .from('bookings')
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

export default Booking;
