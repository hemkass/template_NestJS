import { User } from '@users/services/models/user';
import { refreshTokenData } from './models/refreshToken';
import { Authentication } from './models/authentication';

export interface IAuthenticationService {
  validateUser(data: Authentication): Promise<User>;
  login(user: any): any;
  validateUserWithRefreshToken(data: refreshTokenData): Promise<User>;
  saveRefreshToken(data: refreshTokenData): Promise<string>;
  refreshTokenCheck(user: Partial<User>): Promise<string>;
  logout(refreshToken: string): void;
}
