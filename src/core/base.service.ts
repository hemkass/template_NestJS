import { Inject } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { RoadersException } from './exceptions/RoadersException';
import { IBaseService } from './ibase.service';
import { IBaseRepository } from './ibase.repository';

export abstract class BaseService<T> implements IBaseService<T> {
  constructor(
    @Inject(BaseRepository)
    private repository: IBaseRepository<T>,
  ) {}
  abstract create(entity: T): Promise<T>;

  async getAll(): Promise<T[]> {
    return await this.repository.getAll();
  }

  async getById(id: string): Promise<T> {
    return await this.repository.getById(id);
  }

  abstract delete(id: string): Promise<void>;

  abstract update(entity: Partial<T>): Promise<T>;

  abstract exist(id: string): Promise<boolean>;

  async checkExistenceOrThrow<TException extends RoadersException>(
    id: string,
    exception: new (msg: string) => TException,
  ): Promise<void> {
    const exist = await this.exist(id);

    if (!exist) {
      throw new exception(`No entity found with id ${id}`);
    }
  }
}
