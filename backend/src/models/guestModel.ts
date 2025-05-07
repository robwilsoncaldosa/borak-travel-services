//backend/src/models/guestModel.ts:


import mongoose, { Schema, Document } from 'mongoose';

export interface IGuestUser extends Document {
  username: string;
  email: string;
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
  }
}, {
  timestamps: true // Add timestamps for better tracking
});

export default mongoose.model<IGuestUser>('GuestUser', guestSchema);
