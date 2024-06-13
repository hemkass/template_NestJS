import { Expose } from 'class-transformer';
import { DateType } from '../date.type';

export class EntityBaseDTO {
  isDeleted?: boolean;

  deleteDate?: DateType | null;

  @Expose()
  updatedAt?: DateType | null;

  @Expose()
  createdAt?: DateType;
}
