import { Schema, model } from 'mongoose';

const tokenSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
});

export const Token = model('Token', tokenSchema);
