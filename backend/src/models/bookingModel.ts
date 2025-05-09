import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user_id: number;
  package_id: number;
  destination: string;
  pickup_location: string;
  pickup_date: Date;
  return_date: Date;
  status: 'PENDING' | 'VERIFIED' | 'INPROGRESS' | 'RENDERED';
  payment_status: 'FULL' | 'PARTIAL' | 'PENDING' | 'REFUNDED';
  created_at: Date;
  updated_at: Date;
  packs: number; 
}

const BookingSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  package_id: { type: Number, required: true },
  destination: { type: String, required: true },
  pickup_location: { type: String, required: true },
  pickup_date: { type: Date, required: true },
  return_date: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'INPROGRESS', 'RENDERED'], default: 'PENDING' },
  payment_status: { type: String, enum: ['FULL', 'PARTIAL', 'PENDING', 'REFUNDED'], default: 'PENDING' },
  packs: { type: Number, required: true } ,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
 
});

export default mongoose.model<IBooking>('Booking', BookingSchema);