import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package_id: { type: String, required: true },
  destination: { type: String, required: true },
  pickup_location: { type: String, required: true },
  pickup_date: { type: Date, required: true },
  return_date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  payment_status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);