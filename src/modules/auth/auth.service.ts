import { generateToken } from '../../../lib/jwt/token';
import { jwtConfig } from '../../config/jwt.config';
import { StoredUser } from '../user/user.entity';
import { AuthResult, LoginValues, RegisterValues } from './auth.entity';
import { AuthRepository } from './auth.repository';

export class AuthService<U> {
  constructor(public authRepository: AuthRepository) {}

  async generateAuthResult(user: StoredUser): Promise<AuthResult> {
    return {
      accessToken: await generateToken(
        { userId: user.id },
        jwtConfig.accessTokenSecret,
        { expiresIn: '15m' }
      ),
      refreshToken: await generateToken(
        { userId: user.id },
        jwtConfig.refreshTokenSecret,
        { expiresIn: '30m' }
      ),
    };
  }

  async register(values: RegisterValues): Promise<AuthResult> {
    const user = await this.authRepository.createUser(values);

    return await this.generateAuthResult(user);
  }

  async login(values: LoginValues): Promise<AuthResult> {
    const user = await this.authRepository.findUser(values);

    return await this.generateAuthResult(user);
  }
}
