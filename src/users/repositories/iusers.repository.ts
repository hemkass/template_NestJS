import { IBaseRepository } from '@/core/ibase.repository';
import { User } from '../services/models/user';
import { refreshTokenData } from '@/authentication/services/models/refreshToken';

export interface IUsersRepository extends IBaseRepository<User> {
  emailAlreadyExists(email: string): Promise<boolean>;
  getByEmail(email: string): Promise<User>;
  logicalDelete(idUser: string): Promise<void>;
  existByTokenAndIdUser(data: refreshTokenData): Promise<boolean>;

  getOneByTokenAndIdUser(data: refreshTokenData): Promise<String>;

  deleteByTokenAndIdUser(data: refreshTokenData): Promise<void>;
}
