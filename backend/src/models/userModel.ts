import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    default: () => uuidv4(),
    unique: true
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  nationality: { type: String, required: true },
  status: { type: String, default: 'active' },
  role: { type: String, default: 'user' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);