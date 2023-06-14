import Container from 'typedi';
import { EventEmitter } from '../../../../lib/event/event';
import { VerificationService } from '../../verification/verification.service';
import { StoredUser } from '../../user/user.entity';

const RegistrationEvent = new EventEmitter();

RegistrationEvent.on('registered', async (user: StoredUser) => {
  const verificationService = Container.get(VerificationService);

  await verificationService.sendVerification(user);
});

export { RegistrationEvent };
