import { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { AuthResult, AuthToken } from './auth.entity';
import { AuthService } from './auth.service';
import { RegisterException } from '../../exceptions/auth/register.exception';
import { VerifyException } from '../../exceptions/auth/verify.exception';
import appConfig from '../../config/app.config';
import { VerificationService } from '../verification/verification.service';
import { ResendVerificationException } from '../../exceptions/auth/resend-verification.exception';

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

  // catch 401 error
  async login(context: RouterContext): Promise<AuthResult> {
    return await this.authService.login(context.req.body);
  }

  // catch 401 error
  async logout(context: RouterContext): Promise<void> {
    await this.authService.logout(context.req.body);
  }

  // catch 401 error
  async refreshToken(context: RouterContext): Promise<AuthToken> {
    return await this.authService.refreshToken(context.req.body);
  }

  async verify(context: RouterContext): Promise<void> {
    try {
      await this.verificationService.verify({
        token: context.req.params.token,
      });

      return context.res.redirect(appConfig.url);
    } catch (err) {
      throw new VerifyException(err);
    }
  }

  async resendVerification(context: RouterContext): Promise<void> {
    try {
      await this.verificationService.resendVerification({
        email: context.req.body.email,
      });
    } catch (err) {
      throw new ResendVerificationException(err);
    }
  }
}
