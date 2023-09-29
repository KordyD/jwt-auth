import { User } from '../models/User';
import { hash, compare } from 'bcrypt';
import { v4 } from 'uuid';
import tokenService from './token-service';
import emailService from './email-service';
import { Role } from '../models/Role';
import { APIError } from '../errors/api-error';

class userService {
  async register(email: string, password: string) {
    const candidate = await User.findOne({ email: email });
    if (candidate) {
      throw APIError.BadRequest(`User with email ${email} already exists`);
    }
    const hashedPassword = await hash(password, 7);
    const activationLink = v4();
    const role = await Role.findOne({ value: 'USER' });
    const user = await User.create({
      email: email,
      password: hashedPassword,
      activationLink: activationLink,
      roles: [role?.value],
    });
    await emailService.emailSent(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );
    const tokens = tokenService.generateToken(
      user._id,
      user.roles,
      user.isActivated
    );
    await tokenService.saveToken(user._id, tokens.refreshToken);
    return {
      ...tokens,
      userId: user._id,
      roles: user.roles,
      isActivated: user.isActivated,
    };
  }
  async activate(activationLink: string) {
    const user = await User.findOne({ activationLink: activationLink });
    if (!user) {
      throw APIError.UnauthorizedError();
    }
    user.isActivated = true;
    return await user.save();
  }
  async login(email: string, password: string) {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw APIError.BadRequest(`User with ${email} doesn't exist`);
    }
    if (user.isActivated === false) {
      throw APIError.BadRequest(`User with ${email} doesn't activated`);
    }
    const isValidPassword = compare(password, user.password);
    if (!isValidPassword) {
      throw APIError.BadRequest('The password is invalid');
    }
    const tokens = tokenService.generateToken(
      user._id,
      user.roles,
      user.isActivated
    );
    await tokenService.saveToken(user._id, tokens.refreshToken);
    return {
      ...tokens,
      userId: user._id,
      roles: user.roles,
      isActivated: user.isActivated,
    };
  }
  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw APIError.UnauthorizedError();
    }
    return await tokenService.deleteToken(refreshToken);
  }
  async refresh(refreshToken: string) {
    const userData = tokenService.verifyRefreshToken(refreshToken);
    const tokenData = await tokenService.findToken(refreshToken);

    if (!userData || !tokenData) {
      throw APIError.UnauthorizedError();
    }

    const tokens = tokenService.generateToken(
      userData.userId,
      userData.roles,
      userData.isActivated
    );

    return tokens.accessToken;
  }
  async getUsers() {
    const users = await User.find();
    return users;
  }
}

export default new userService();
