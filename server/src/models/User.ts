import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  activationLink: { type: String },
  isActivated: { type: Boolean, default: false },
  roles: [{ type: String, ref: 'Role' }],
});

export const User = model('User', userSchema);
