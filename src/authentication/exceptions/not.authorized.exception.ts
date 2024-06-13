import { RoadersException } from '@/core/exceptions/RoadersException';

export class UserNotAuthorized extends RoadersException {
  constructor(message: string) {
    super(message);
  }
}
