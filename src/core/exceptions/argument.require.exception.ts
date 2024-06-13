import { RoadersException } from './RoadersException';

export class ArgumentRequireException extends RoadersException {
  constructor(message: string) {
    super(message);
  }
}
