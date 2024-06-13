import { RoadersException } from './exceptions/RoadersException';
import { FindAllParams } from './find.all.params';
import { IBaseRepository } from './ibase.repository';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected _model;

  constructor(model: any) {
    this._model = model;
  }

  async getAll(params?: FindAllParams) {
    return await this._model.findMany(params);
  }

  abstract create(entity: T): Promise<T>;

  abstract getById(id: string): Promise<T>;

  async findById<TException extends RoadersException>(
    id: string,
    exception: new (msg: string) => TException,
  ): Promise<T> {
    const entity = await this._model.findUnique({ where: { id: id } });
    if (!entity?.id || entity?.isDeleted === true) {
      throw new exception(`No entity found with id ${id}`);
    } else return entity;
  }

  abstract delete(id: string): Promise<void>;

  abstract update(entity: Partial<T>): Promise<T>;

  abstract exist(id: string): Promise<boolean>;
}
