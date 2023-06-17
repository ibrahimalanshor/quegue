import { Service } from 'typedi';
import { UpdateMeOptions } from './me.entity';
import { userResource } from '../user/user.resource';

@Service()
export class MeService {
  async updateMe(options: UpdateMeOptions): Promise<void> {
    await userResource.service.update({
      filter: {
        id: {
          operator: '=',
          value: options.user.id,
        },
      },
      values: options.values,
      returnCreated: false,
    });
  }
}
