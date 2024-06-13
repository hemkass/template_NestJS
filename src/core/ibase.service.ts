export interface IBaseService<T> {
  create(entity: T | Partial<T>): Promise<T>;
  getById(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  update(id: Partial<T>): Promise<T>;
  exist(id: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}
