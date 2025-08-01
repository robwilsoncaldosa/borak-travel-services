import { instance } from '../axios';

export interface BookingData {
  user_id: string;
  package_id: string;
  destination: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  return_time: string;
  status: string;
  payment_status: string;
  packs: number;
  price: number; // <-- Add price
  paid_amount: number | null;
}

export const bookingsApi = {
  createBooking: async (bookingData: BookingData) => {
    try {
      const response = await instance.post("/api/bookings", bookingData); 
      return response.data;
    } catch (error) {
      console.error("Failed to create booking:", error);
      throw error;
    }
  },
 
  getAllBookings: async () => {
    try {
      const response = await instance.get("/api/bookings");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      throw error;
    }
  },
 
 updateBooking: async (bookingId: string, bookingData: Partial<BookingData>) => {
   try {
     const response = await instance.put(`/api/bookings/${bookingId}`, bookingData);
     return response.data;
   } catch (error) {
     console.error("Failed to update booking:", error);
     throw error;
   }
 },
};