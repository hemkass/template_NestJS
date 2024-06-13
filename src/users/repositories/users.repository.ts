import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { IUsersRepository } from './iusers.repository';
import { BaseRepository } from '@/core/base.repository';
import { User } from '@users/services/models/user';
import { ArgumentRequireException } from '@/core/exceptions/argument.require.exception';
import { UserNotCreatedException } from '../exceptions/user.not.created.exception';
import { UserNotFoundException } from '../exceptions/user.not.found.exception';
import { refreshTokenData } from '@/authentication/services/models/refreshToken';
import { RefreshTokenNotFoundException } from '../exceptions/refresh.token.not.found.exception';

@Injectable()
export class UsersRepository
  extends BaseRepository<User>
  implements IUsersRepository
{
  constructor(private prisma: PrismaService) {
    super(prisma.user);
  }

  getAll(): Promise<User[]> {
    return super.getAll({ where: { isDeleted: false } });
  }
  getById(id: string): Promise<User> {
    return super.findById(id, UserNotFoundException);
  }

  async create(user: User): Promise<User> {
    if (!user?.password) {
      throw new ArgumentRequireException('password mandatory');
    }
    const newUser = await this.prisma.user.create({ data: user });
    if (!newUser?.id) {
      throw new UserNotCreatedException('User not created');
    }
    return newUser;
  }

  async exist(idUser: string): Promise<boolean> {
    const user = await this.prisma.user.count({
      where: { AND: { id: idUser, isDeleted: false } },
    });
    return user === 1;
  }

  async emailAlreadyExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.count({
      where: { AND: { email: email, isDeleted: false } },
    });
    return user >= 1;
  }

  async getByEmail(email: string): Promise<User> {
    if (!email) {
      throw new ArgumentRequireException('Email required');
    }
    const user = await this.prisma.user.findFirst({
      where: { AND: { email: email, isDeleted: false } },
    });

    if (!user) {
      throw new UserNotFoundException(`No user ${email} found`);
    }
    return user;
  }

  async update(data: Partial<User>): Promise<User> {
    if (!data?.id) {
      throw new ArgumentRequireException(`Id mandatory`);
    }
    const idUser = data.id;
    delete data.id;
    data.updatedAt = new Date();

    const user = await this.prisma.user.update({
      where: { id: idUser },
      data: data,
    });

    if (!user?.id || user?.isDeleted) {
      throw new UserNotFoundException(`User ${data.id} not found`);
    } else {
      return user;
    }
  }

  async logicalDelete(idUser: string): Promise<void> {
    let user: Partial<User> = {};
    user.updatedAt = new Date();
    user.deleteDate = new Date();
    user.isDeleted = true;

    await this.prisma.user.update({
      where: { id: idUser },
      data: user,
    });
  }

  async delete(idUser: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: idUser },
    });
  }

  async existByTokenAndIdUser(data: refreshTokenData): Promise<boolean> {
    const token = await this.prisma.user.count({
      where: { AND: { id: data.idUser, refreshToken: data.refreshToken } },
    });
    return token === 1;
  }
  async getOneByTokenAndIdUser(data: refreshTokenData): Promise<String> {
    const token = await this.prisma.user.findFirst({
      where: {
        AND: { id: data.idUser, refreshToken: data.refreshToken },
      },
      select: {
        refreshToken: true,
      },
    });
    if (!token) {
      throw new RefreshTokenNotFoundException(
        `No refresh token found for this user ${data.idUser} and this token ${data.refreshToken}`,
      );
    } else {
      return data.refreshToken;
    }
  }
  async deleteByTokenAndIdUser(data: refreshTokenData): Promise<void> {
    const token = await this.getOneByTokenAndIdUser(data);

    await this.prisma.user.delete({
      where: { id: data.idUser },
    });
  }
}
