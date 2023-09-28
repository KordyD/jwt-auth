import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  value: { type: String, unique: true, required: true },
});

export const Role = model('Role', roleSchema);
