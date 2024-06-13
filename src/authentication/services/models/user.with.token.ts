import { User } from '@/users/services/models/user';
import { Expose } from 'class-transformer';

export class UserWithToken extends User {
  token: string;

  refreshToken: string;
}
