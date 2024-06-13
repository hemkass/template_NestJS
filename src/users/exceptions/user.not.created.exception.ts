import { RoadersException } from '@/core/exceptions/RoadersException';

export class UserNotCreatedException extends RoadersException {
  constructor(message: string) {
    super(message);
  }
}
