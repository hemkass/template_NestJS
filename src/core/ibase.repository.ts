export interface IBaseRepository<T> {
  create(entity: T): Promise<T>;
  getById(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  update(entity: Partial<T>): Promise<T>;
  exist(id: string): Promise<boolean>;
  delete(idUser: string): Promise<void>;
}
