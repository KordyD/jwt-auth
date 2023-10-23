import { Types } from 'mongoose';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { config } from 'dotenv';
import { join } from 'path';
import { Token } from '../models/Token';
import { APIError } from '../errors/api-error';

interface userData {
  userId: Types.ObjectId;
  roles: string[];
  isActivated: boolean;
}

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
      { expiresIn: '15s' }
    );
    const refreshToken = sign(
      { userId: userId, roles: roles, isActivated: isActivated },
      this.refreshSecretKey,
      { expiresIn: '30s' }
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
  async deleteToken(refreshToken: string) {
    const tokenData = await Token.findOneAndRemove({
      refreshToken: refreshToken,
    });
    if (!tokenData) {
      throw APIError.UnauthorizedError();
    }
    return tokenData;
  }

  verifyAccessToken(accessToken: string) {
    try {
      const userData = verify(
        accessToken,
        process.env.JWT_SECRET_ACCESS || 'ACCESS_SECRET'
      );
      return userData;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const userData = verify(
        refreshToken,
        process.env.JWT_SECRET_REFRESH || 'REFRESH_SECRET'
      ) as userData;
      return userData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = await Token.findOne({ refreshToken: refreshToken });
    return tokenData;
  }
}

export default new tokenService();
