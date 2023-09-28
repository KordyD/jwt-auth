import { Types } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { join } from 'path';
import { Token } from '../models/Token';

class tokenService {
  private accessSecretKey;
  private refreshSecretKey;
  constructor() {
    config({ path: join(__dirname, '..', '..', 'src', '.env') });
    this.accessSecretKey = process.env.JWT_SECRET_ACCESS || 'ACCESS_SECRET';
    this.refreshSecretKey = process.env.JWT_SECRET_REFRESH || 'REFRESH_SECRET';
  }
  generateToken(userId: Types.ObjectId, roles: string[], isActivated: boolean) {
    const accessToken = sign(
      { userId: userId, roles: roles, isActivated: isActivated },
      this.accessSecretKey,
      { expiresIn: '15m' }
    );
    const refreshToken = sign(
      { userId: userId, roles: roles, isActivated: isActivated },
      this.refreshSecretKey,
      { expiresIn: '30d' }
    );
    return { accessToken, refreshToken };
  }
  async saveToken(userId: Types.ObjectId, refreshToken: string) {
    const tokenData = await Token.findOne({ userId: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }
    const token = await Token.create({
      userId: userId,
      refreshToken: refreshToken,
    });
    return token;
  }
}

export default new tokenService();
