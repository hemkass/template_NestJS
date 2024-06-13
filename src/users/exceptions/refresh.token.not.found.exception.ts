import { RoadersException } from '@/core/exceptions/RoadersException';

export class RefreshTokenNotFoundException extends RoadersException {
  constructor(message: string) {
    super(message);
  }
}
