import { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { VerifyException } from '../../exceptions/auth/verify.exception';
import appConfig from '../../config/app.config';
import { VerificationService } from '../verification/verification.service';
import { ResendVerificationException } from '../../exceptions/auth/resend-verification.exception';

@Service()
@autobind
export class VerificationController {
  constructor(public verificationService: VerificationService) {}

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
