import { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { AuthResult, AuthToken } from './auth.entity';
import { AuthService } from './auth.service';
import { RegisterException } from '../../exceptions/auth/register.exception';
import { VerificationService } from '../verification/verification.service';
import { LoginException } from '../../exceptions/auth/login.exception';
import { LogoutException } from '../../exceptions/auth/logout.exception';
import { RefreshTokenException } from '../../exceptions/auth/refresh-token.exception';

@Service()
@autobind
export class AuthController {
  constructor(
    public authService: AuthService,
    public verificationService: VerificationService
  ) {}

  async register(context: RouterContext): Promise<AuthResult> {
    try {
      return await this.authService.register(context.req.body);
    } catch (err) {
      throw new RegisterException(err);
    }
  }

  async login(context: RouterContext): Promise<AuthResult> {
    try {
      return await this.authService.login(context.req.body);
    } catch (err) {
      throw new LoginException(err);
    }
  }

  async logout(context: RouterContext): Promise<void> {
    try {
      await this.authService.logout(context.req.body);
    } catch (err) {
      throw new LogoutException(err);
    }
  }

  async refreshToken(context: RouterContext): Promise<AuthToken> {
    try {
      return await this.authService.refreshToken(context.req.body);
    } catch (err) {
      throw new RefreshTokenException(err);
    }
  }
}
