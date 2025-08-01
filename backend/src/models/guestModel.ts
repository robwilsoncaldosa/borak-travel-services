//backend/src/models/guestModel.ts:


import mongoose, { Schema, Document } from 'mongoose';

export interface IGuestUser extends Document {
  username: string;
  email: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  mobile?: string;
}

const guestSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: false
  },
  middlename: {
    type: String,
    required: false
  },
  lastname: {
    type: String,
    required: false
  },
  mobile: {
    type: String,
    required: false
  }
}, {
  timestamps: true // Add timestamps for better tracking
});

export default mongoose.model<IGuestUser>('GuestUser', guestSchema);
