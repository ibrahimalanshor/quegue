import { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { MeService } from './me.service';

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
}
