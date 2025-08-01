
import { instance } from '../axios';

export interface GuestCreateDto {
  username: string;
  email: string;
}

interface Guest {
  id: string;
  username: string;
  email: string;
  message?: string;
}

export const guestApi = {
  createGuest: async (guest: GuestCreateDto): Promise<Guest> => {
    const res = await instance.post("/api/guests", guest);
    return res.data;
  },
 
  getGuestById: async (id: string): Promise<Guest> => {
    const res = await instance.get(`/api/guests/${id}`);
    return res.data;
  },
 
  getAllGuests: async (): Promise<Guest[]> => {
    const res = await instance.get("/api/guests");
    return res.data;
  }
};