import { EventEmitter } from 'node:events';
import { StoredUser } from '../../modules/user/user.entity';

class RegisteredEvent extends EventEmitter {}

const registeredEvent = new RegisteredEvent();

registeredEvent.on('registered', (user: StoredUser) => {
  // send verification email (queue)
});

export { registeredEvent };
