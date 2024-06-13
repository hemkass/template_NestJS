import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { User } from '@/users/services/models/user';
import { BaseService } from '@/core/base.service';
import { IUsersService } from '@/users/services/iusers.service';
import { ArgumentRequireException } from '@/core/exceptions/argument.require.exception';
import { HandleString } from '@utils/handle.string';
import { CryptingData } from '@utils/cryptingData';
import { UsersRepository } from '../repositories/users.repository';
import { IUsersRepository } from '../repositories/iusers.repository';
import { UserAlreadyExistsException } from '../exceptions/user.already.existing.exception';
import { UserNotFoundException } from '../exceptions/user.not.found.exception';
import { refreshTokenData } from '@/authentication/services/models/refreshToken';

@Injectable()
export class UsersService extends BaseService<User> implements IUsersService {
  constructor(
    @Inject(UsersRepository)
    private usersRepository: IUsersRepository,
  ) {
    super(usersRepository);
  }

  async create(user: User): Promise<User> {
    if (!user?.email || !user.password) {
      throw new ArgumentRequireException('Email and password required');
    }

    // email have to be unique
    await this.throwIfEmailAlreadyExists(user.email);

    user.lastname = HandleString.capitalizeFirstLetter(user.lastname);

    const hashedPassword = await CryptingData.generateHashedPassword(
      user.password,
    );

    user.password = hashedPassword;

    const newUser = await this.usersRepository.create(user);

    return newUser;
  }

  async getById(idUser: string): Promise<User> {
    return super.getById(idUser);
  }

  async getUserByEmail(email: string): Promise<User> {
    if (!email) {
      throw new ArgumentRequireException('Email Mandatory');
    }
    const user = await this.usersRepository.getByEmail(email);

    return user;
  }

  private async throwIfEmailAlreadyExists(email: string): Promise<void> {
    const existence = await this.usersRepository.emailAlreadyExists(email);

    if (existence) {
      throw new UserAlreadyExistsException(`Email ${email} is already taken`);
    }
  }

  async getAll(): Promise<User[]> {
    return super.getAll();
  }

  async existByTokenAndIdUser(data: refreshTokenData): Promise<boolean> {
    return await this.usersRepository.existByTokenAndIdUser(data);
  }
  async getOneByTokenAndIdUser(data: refreshTokenData): Promise<String> {
    return await this.usersRepository.getOneByTokenAndIdUser(data);
  }
  async deleteByTokenAndIdUser(data: refreshTokenData): Promise<void> {
    await this.usersRepository.deleteByTokenAndIdUser(data);
  }

  async logicalDelete(idUser: string): Promise<void> {
    await this.checkExistenceOrThrow(idUser, UserNotFoundException);
    this.usersRepository.logicalDelete(idUser);
  }

  async delete(id: string): Promise<void> {
    await this.checkExistenceOrThrow(id, UserNotFoundException);
    return this.usersRepository.delete(id);
  }

  async update(entity: Partial<User>): Promise<User> {
    return this.usersRepository.update(entity);
  }
  async exist(id: string): Promise<boolean> {
    return await this.usersRepository.exist(id);
  }
}
