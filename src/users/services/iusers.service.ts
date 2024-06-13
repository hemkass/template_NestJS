import { refreshTokenData } from '@/authentication/services/models/refreshToken';
import { IBaseService } from '@/core/ibase.service';
import { User } from '@/users/services/models/user';

export interface IUsersService extends IBaseService<User> {
  getUserByEmail(email: string): Promise<User>;
  logicalDelete(idUser: string): Promise<void>;
  existByTokenAndIdUser(data: refreshTokenData): Promise<boolean>;

  getOneByTokenAndIdUser(data: refreshTokenData): Promise<String>;

  deleteByTokenAndIdUser(data: refreshTokenData): Promise<void>;
}
