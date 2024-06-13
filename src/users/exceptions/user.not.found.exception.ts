import { RoadersException } from '@/core/exceptions/RoadersException';

export class UserNotFoundException extends RoadersException {
  constructor(message: string) {
    super(message);
  }
}
