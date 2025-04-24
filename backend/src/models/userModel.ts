import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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