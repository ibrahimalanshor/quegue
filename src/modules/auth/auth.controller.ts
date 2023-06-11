import Container, { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { AuthResult, AuthToken } from './auth.entity';
import { AuthService } from './auth.service';
import { RegisterException } from '../../exceptions/auth/register.exception';
import { VerifyException } from '../../exceptions/auth/verify.exception';
import appConfig from '../../config/app.config';

@Service()
@autobind
export class AuthController {
  constructor(public authService: AuthService) {}

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

  async verifyUser(context: RouterContext): Promise<void> {
    try {
      await this.authService.verifyUser({
        token: context.req.params.token,
      });

      return context.res.redirect(appConfig.url);
    } catch (err) {
      throw new VerifyException(err);
    }
  }
}
