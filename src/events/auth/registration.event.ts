import { EventEmitter } from '../../../lib/event/event';
import { StoredUser } from '../../modules/user/user.entity';
import Container from 'typedi';
import { VerificationService } from '../../modules/verification/verification.service';

const RegistrationEvent = new EventEmitter();

RegistrationEvent.on('registered', async (user: StoredUser) => {
  const verificationService = Container.get(VerificationService);

  await verificationService.sendVerification(user);
});

export { RegistrationEvent };
