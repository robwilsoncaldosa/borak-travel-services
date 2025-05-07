import mongoose, { Schema, Document } from 'mongoose';

export interface IReviews extends Document {
  guest_id : string;
  package_id: string;
  review: string; 
  rating: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const reviewsSchema = new Schema<IReviews>({
   guest_id: {
    type: String,
    required: true,
  },
  package_id: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
 }, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

export default mongoose.model<IReviews>('Reviews', reviewsSchema);
