import { supabase } from '../config/db';

export interface IMessage {
  id?: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string | Date;
  isRead: boolean;
  isAdmin: boolean;
  imageUrls?: string[];
}

// Message operations using Supabase
export const Message = {
  // Create a new message
  create: async (data: Omit<IMessage, 'id' | 'timestamp'>): Promise<IMessage> => {
    // Convert camelCase to snake_case for Supabase
    const insertData = {
      user_id: data.userId,
      username: data.username,
      message: data.message,
      is_read: data.isRead,
      is_admin: data.isAdmin,
      image_urls: data.imageUrls || [],
      timestamp: new Date().toISOString(),
    };

    const { data: messageData, error } = await supabase
      .from('messages')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating message:', error);
      throw error;
    }

    // Convert snake_case back to camelCase for the response
    return {
      id: messageData.id,
      userId: messageData.user_id,
      username: messageData.username,
      message: messageData.message,
      timestamp: messageData.timestamp,
      isRead: messageData.is_read,
      isAdmin: messageData.is_admin,
      imageUrls: messageData.image_urls || [],
    };
  },

  // Find all messages
  find: async (filter?: { userId?: string; isRead?: boolean }): Promise<IMessage[]> => {
    let query = supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true });

    if (filter?.userId) {
      query = query.eq('user_id', filter.userId);
    }
    if (filter?.isRead !== undefined) {
      query = query.eq('is_read', filter.isRead);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase error finding messages:', error);
      throw error;
    }

    // Convert snake_case to camelCase
    return (data || []).map((msg: any) => ({
      id: msg.id,
      userId: msg.user_id,
      username: msg.username,
      message: msg.message,
      timestamp: msg.timestamp,
      isRead: msg.is_read,
      isAdmin: msg.is_admin,
      imageUrls: msg.image_urls || [],
    }));
  },

  // Find message by ID
  findById: async (id: string): Promise<IMessage | null> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Supabase error finding message by ID:', error);
      throw error;
    }

    if (!data) return null;

    // Convert snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      username: data.username,
      message: data.message,
      timestamp: data.timestamp,
      isRead: data.is_read,
      isAdmin: data.is_admin,
      imageUrls: data.image_urls || [],
    };
  },

  // Update message
  findByIdAndUpdate: async (id: string, updateData: Partial<IMessage>): Promise<IMessage | null> => {
    // Convert camelCase to snake_case for update
    const updatePayload: any = {};
    if (updateData.isRead !== undefined) updatePayload.is_read = updateData.isRead;
    if (updateData.isAdmin !== undefined) updatePayload.is_admin = updateData.isAdmin;
    if (updateData.message !== undefined) updatePayload.message = updateData.message;
    if (updateData.username !== undefined) updatePayload.username = updateData.username;
    if (updateData.imageUrls !== undefined) updatePayload.image_urls = updateData.imageUrls;

    const { data, error } = await supabase
      .from('messages')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Supabase error updating message:', error);
      throw error;
    }

    if (!data) return null;

    // Convert snake_case back to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      username: data.username,
      message: data.message,
      timestamp: data.timestamp,
      isRead: data.is_read,
      isAdmin: data.is_admin,
      imageUrls: data.image_urls || [],
    };
  },

  // Update multiple messages (e.g., mark as read)
  updateMany: async (filter: { userId?: string; isRead?: boolean }, updateData: Partial<IMessage>): Promise<IMessage[]> => {
    // Convert camelCase to snake_case for update
    const updatePayload: any = {};
    if (updateData.isRead !== undefined) updatePayload.is_read = updateData.isRead;
    if (updateData.isAdmin !== undefined) updatePayload.is_admin = updateData.isAdmin;
    if (updateData.message !== undefined) updatePayload.message = updateData.message;
    if (updateData.username !== undefined) updatePayload.username = updateData.username;
    if (updateData.imageUrls !== undefined) updatePayload.image_urls = updateData.imageUrls;

    let query = supabase
      .from('messages')
      .update(updatePayload);

    if (filter.userId) {
      query = query.eq('user_id', filter.userId);
    }
    if (filter.isRead !== undefined) {
      query = query.eq('is_read', filter.isRead);
    }

    const { data, error } = await query.select();
    if (error) {
      console.error('Supabase error updating messages:', error);
      throw error;
    }

    // Convert snake_case back to camelCase
    return (data || []).map((msg: any) => ({
      id: msg.id,
      userId: msg.user_id,
      username: msg.username,
      message: msg.message,
      timestamp: msg.timestamp,
      isRead: msg.is_read,
      isAdmin: msg.is_admin,
      imageUrls: msg.image_urls || [],
    }));
  },

  // Delete message
  findByIdAndDelete: async (id: string): Promise<IMessage | null> => {
    const { data, error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Supabase error deleting message:', error);
      throw error;
    }

    if (!data) return null;

    // Convert snake_case back to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      username: data.username,
      message: data.message,
      timestamp: data.timestamp,
      isRead: data.is_read,
      isAdmin: data.is_admin,
      imageUrls: data.image_urls || [],
    };
  },
};

export default Message;
