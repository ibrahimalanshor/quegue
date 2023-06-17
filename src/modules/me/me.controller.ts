import { Service } from 'typedi';
import autobind from 'autobind-decorator';
import { RouterContext } from '../../../lib/server/response';
import { AuthToken } from '../auth/auth.entity';

@Service()
@autobind
export class MeController {
  me(context: RouterContext): Promise<AuthToken> {
    return context.req.user;
  }
}
