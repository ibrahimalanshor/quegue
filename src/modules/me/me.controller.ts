import { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { MeService } from './me.service';
import { UpdateEmailException } from './exceptions/update-email.exception';

@Service()
@autobind
export class MeController {
  constructor(public meService: MeService) {}

  me(context: RouterContext) {
    return context.req.user;
  }

  async updateMe(context: RouterContext) {
    await this.meService.updateMe({
      values: context.req.body,
      user: context.req.user,
    });
  }

  async updateEmail(context: RouterContext) {
    try {
      await this.meService.updateEmail({
        values: context.req.body,
        user: context.req.user,
      });
    } catch (err) {
      throw new UpdateEmailException(err);
    }
  }
}
