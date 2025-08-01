
import { instance } from '../axios';

export interface GuestCreateDto {
  username: string;
  email: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  mobile?: string;
}

interface Guest {
  id: string;
  username: string;
  email: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  mobile?: string;
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
  },

  updateGuest: async (id: string, guestData: Partial<GuestCreateDto>): Promise<Guest> => {
    const res = await instance.put(`/api/guests/${id}`, guestData);
    return res.data;
  }
};