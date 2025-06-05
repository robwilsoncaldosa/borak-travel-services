//backend/src/models/messageModel.ts:

import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isAdmin: boolean;
  imageUrls?: string[];
}

const messageSchema = new Schema({
  userId: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true // Add index for better query performance
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  imageUrls: {
    type: [String],
    default: []
  }
});

// Add a pre-find middleware to ensure proper query execution
messageSchema.pre('find', function(next) {
  this.lean(); // Convert documents to plain JavaScript objects
  next();
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;