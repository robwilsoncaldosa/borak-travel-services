import { instance } from '../axios';

export interface BookingData {
  user_id: string;
  package_id: string;
  destination: string;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
  status: string;
  payment_status: string;
  packs: number;
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
};