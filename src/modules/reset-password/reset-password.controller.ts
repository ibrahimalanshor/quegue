import autobind from 'autobind-decorator';
import { Service } from 'typedi';
import { ResetPasswordService } from './reset-password.service';
import { RouterContext } from '../../../lib/server/response';
import { ForgotPasswordException } from './exceptions/forgot-password.exception';

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
}
