import { EntityBase } from '@/core/entityBase';

export class User extends EntityBase {
  id?: string;
  email: string;
  password: string;
  token?: string | null;
  refreshToken?: string | null;
  lastname: string;
  firstname: string;
  location?: any;
  role?: number | null;
  preferences?: any;
}
