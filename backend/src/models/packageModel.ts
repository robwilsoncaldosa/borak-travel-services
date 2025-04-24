import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  title: string;
  location: string;
  duration_hours: number;
  about_tour: string;
  highlights: string[];
  activities: string[];
  inclusions: string[];
  images: string[];
  created_at: Date;
  updated_at: Date;
}

const packageSchema = new Schema<IPackage>({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  duration_hours: {
    type: Number,
    required: true,
  },
  about_tour: {
    type: String,
    required: true,
  },
  highlights: [{
    type: String,
    required: true,
  }],
  activities: [{
    type: String,
    required: true,
  }],
  inclusions: [{
    type: String,
    required: true,
  }],
  images: [{
    type: String,
    required: true,
  }],
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

export default mongoose.model<IPackage>('Package', packageSchema);
