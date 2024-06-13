import { RoadersException } from './RoadersException';

export class NotImplementedYetException extends RoadersException {
  constructor(message: string) {
    super(message);
  }
}
