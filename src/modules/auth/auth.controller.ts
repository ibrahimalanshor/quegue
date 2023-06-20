import { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { AuthResult, AuthToken } from './auth.entity';
import { AuthService } from './auth.service';
import { VerificationService } from '../verification/verification.service';
import { LoginException } from './exceptions/login.exception';
import { LogoutException } from './exceptions/logout.exception';
import { RefreshTokenException } from './exceptions/refresh-token.exception';
import { RegisterException } from './exceptions/register.exception';
import { GoogleAuthException } from './exceptions/google-auth.exception';

@Service()
@autobind
export class AuthController {
  constructor(
    public authService: AuthService,
    public verificationService: VerificationService
  ) {}

  async register(context: RouterContext): Promise<AuthResult> {
    try {
      return await this.authService.register({
        values: context.req.body,
      });
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

  async googleAuth(context: RouterContext): Promise<AuthResult> {
    try {
      return await this.authService.googleAuth(context.req.body);
    } catch (err) {
      throw new GoogleAuthException(err);
    }
  }
}
