import crypto from 'crypto';
import { EventEmitter } from '../../../lib/event/event';
import { StoredUser } from '../../modules/user/user.entity';
import { verificationTokenResource } from '../../modules/verification-token/verification-token.resource';

const RegistrationEvent = new EventEmitter();

RegistrationEvent.on('registered', async (user: StoredUser) => {
  const token = crypto.randomBytes(24).toString('hex');

  await verificationTokenResource.service.store({
    token,
    user_id: user.id,
  });
});

export { RegistrationEvent };
