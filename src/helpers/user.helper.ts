import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';

export class UserHelper {
  static async hashPassword(password: string) {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
  }

  static generateUserPayload(user: User) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    return payload;
  }
}
