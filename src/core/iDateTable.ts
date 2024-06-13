import { DateType } from './date.type';

export interface IDateTable {
  createdAt?: DateType;
  updatedAt?: DateType | null;
}
