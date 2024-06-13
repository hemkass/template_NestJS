import { RoadersException } from '@/core/exceptions/RoadersException';

export class UserAlreadyExistsException extends RoadersException {
  constructor(message: string) {
    super(message);
  }
}
