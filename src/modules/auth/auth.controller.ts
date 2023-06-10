import Container, { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { AuthResult, AuthToken } from './auth.entity';
import { AuthService } from './auth.service';

@Service()
@autobind
export class AuthController {
  constructor(public authService: AuthService) {}

  // catch 401 error
  async register(context: RouterContext): Promise<AuthResult> {
    return await this.authService.register(context.req.body);
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
}
