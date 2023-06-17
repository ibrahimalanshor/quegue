import { Service } from 'typedi';
import { UpdateEmailOptions, UpdateMeOptions } from './me.entity';
import { userResource } from '../user/user.resource';
import { VerificationService } from '../verification/verification.service';
import { StoredUser } from '../user/user.entity';

@Service()
export class MeService {
  constructor(public verificationService: VerificationService) {}

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

  async updateEmail(options: UpdateEmailOptions): Promise<void> {
    const user = (await userResource.service.update({
      filter: {
        id: {
          operator: '=',
          value: options.user.id,
        },
      },
      values: {
        email: options.values.email,
        verified_at: null,
      },
      returnCreated: true,
      force: true,
    })) as StoredUser;

    await this.verificationService.sendVerification(user);
  }
}
