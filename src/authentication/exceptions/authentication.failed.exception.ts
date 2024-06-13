import { RoadersException } from '@/core/exceptions/RoadersException';

export class AuthenticationFailedException extends RoadersException {
  constructor(message: string) {
    super(message);
  }
}
