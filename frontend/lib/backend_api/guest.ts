
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
    const res = await instance.post("/create/guests", guest);
    return res.data;
  }
};