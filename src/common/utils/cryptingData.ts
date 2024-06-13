import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from '@/users/services/models/user';
import { AuthenticationFailedException } from '@/authentication/exceptions/authentication.failed.exception';
import { ArgumentRequireException } from '@/core/exceptions/argument.require.exception';
const scrypt = promisify(_scrypt);

export interface DataHashedPassword {
  salt: string;
  password: string;
}

export class CryptingData {
  static async generateHashedPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return result;
  }

  static async testHashedPassword(data: DataHashedPassword) {
    const salt = data.salt;
    const hash = (await scrypt(data.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return result;
  }

  static generateRandomPassword(length: number) {
    if (typeof length === 'undefined') {
      length = 8;
    }
    let c = 'abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ12345679',
      n = c.length,
      /* p : chaîne de caractères spéciaux */
      p = '!@#$+-*&_',
      o = p.length,
      r = '',
      /* s : determine la position du caractère spécial dans le mdp */
      s = Math.floor(Math.random() * (p.length - 1));

    for (let i = 0; i < length; ++i) {
      if (s == i) {
        /* on insère à la position donnée un caractère spécial aléatoire */
        r += p.charAt(Math.floor(Math.random() * o));
      } else {
        /* on insère un caractère alphanumérique aléatoire */
        r += c.charAt(Math.floor(Math.random() * n));
      }
    }
    return r;
  }
  static generateRandomToken(length: number) {
    if (typeof length === 'undefined') {
      length = 8;
    }
    let c = 'abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ12345679',
      n = c.length,
      r = '';

    for (let i = 0; i < length; ++i) {
      /* on insère un caractère alphanumérique aléatoire */
      r += c.charAt(Math.floor(Math.random() * n));
    }
    return r;
  }

  static async checkPassword(data: {
    user: User;
    passwordToCheck: string;
  }): Promise<User> {
    const { user, passwordToCheck } = data;
    if (user?.password) {
      const hashedPassword = user.password;
      const [salt, storedHash] = hashedPassword.split('.');

      const hashToCheck = (await scrypt(passwordToCheck, salt, 32)) as Buffer;

      if (hashToCheck) {
        if (storedHash === hashToCheck.toString('hex')) {
          return user;
        } else {
          throw new AuthenticationFailedException('invalid password');
        }
      } else {
        throw new AuthenticationFailedException('crypting or Buffer issues');
      }
    }
    throw new ArgumentRequireException('password Mandatory');
  }
}
