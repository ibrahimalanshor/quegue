import autobind from 'autobind-decorator';
import { Service } from 'typedi';
import { ResetPasswordService } from './reset-password.service';
import { RouterContext } from '../../../lib/server/response';
import { ForgotPasswordException } from './exceptions/forgot-password.exception';
import { ResetPasswordException } from './exceptions/reset-password.exception';

@Service()
@autobind
export class ResetPasswordController {
  constructor(public resetPasswordService: ResetPasswordService) {}

  async forgotPassword(context: RouterContext): Promise<void> {
    try {
      await this.resetPasswordService.forgotPassword({
        email: context.req.body.email,
      });
    } catch (err) {
      throw new ForgotPasswordException(err);
    }
  }

  async resetPassword(context: RouterContext): Promise<void> {
    try {
      await this.resetPasswordService.resetPassword({
        token: context.req.body.token,
        password: context.req.body.password,
      });
    } catch (err) {
      throw new ResetPasswordException(err);
    }
  }
}
