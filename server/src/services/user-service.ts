import { User } from '../models/User';
import { hash } from 'bcrypt';
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
    // TODO: send email
    await emailService.emailSent();
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
}

export default new userService();
