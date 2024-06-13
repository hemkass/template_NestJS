import { Injectable } from '@nestjs/common';
import { UsersService } from '@users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserNotFoundException } from '@users/exceptions/user.not.found.exception';
import { User } from '@/users/services/models/user';
import { IAuthenticationService } from './IAuthenticationService';
import { CryptingData } from '@/common/utils/cryptingData';
import { CalculateDate } from '@/common/utils/calculateDate';
import { refreshTokenData } from './models/refreshToken';
import { UserNotAuthorized } from '../exceptions/not.authorized.exception';
import { DecodedToken } from './models/decoded.token';
import { Authentication } from './models/authentication';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: Authentication): Promise<User> {
    const user = await this.usersService.getUserByEmail(data.email);
    if (!user?.id) {
      throw new UserNotFoundException(`User not found`);
    }

    CryptingData.checkPassword({ user: user, passwordToCheck: data.password });

    return user;
  }

  async login(user: any) {
    const payload = { fisrtname: user.email, sub: user.id };
    const expireDuration = CalculateDate.expireInXHours(4);

    const expireDurationRefresh = CalculateDate.expireInXdays(30);
    const token = await this.jwtService.signAsync(
      {
        exp: expireDuration,
        data: payload,
      },
      {
        secret: process.env.JWTSecretKey,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        exp: expireDurationRefresh,
        data: payload,
      },
      {
        secret: process.env.JWTSecretKey,
      },
    );
    return { token: token, refreshToken: refreshToken };
  }

  async refreshTokenCheck(user: Partial<User>): Promise<string> {
    const expireDuration = CalculateDate.expireInXHours(4);
    const payload = { email: user.email, sub: user.id };

    const token = await this.jwtService.signAsync(
      {
        exp: expireDuration,
        data: payload,
      },
      {
        secret: process.env.JWTSecretKey,
      },
    );

    return token;
  }

  async saveRefreshToken(data: refreshTokenData): Promise<string> {
    const refreshToken = (
      await this.usersService.update({
        id: data.idUser,
        refreshToken: data.refreshToken,
      })
    ).refreshToken!;
    return refreshToken;
  }

  async validateUserWithRefreshToken(data: refreshTokenData): Promise<User> {
    const isTokenValid = await this.usersService.existByTokenAndIdUser(data);

    if (!isTokenValid) {
      throw new UserNotAuthorized('invalid refresh token');
    }
    return await this.usersService.getById(data.idUser);
  }

  async logout(refreshToken: string) {
    const decodedToken = this.jwtService.decode(refreshToken) as DecodedToken;

    await this.usersService.deleteByTokenAndIdUser({
      refreshToken: refreshToken,
      idUser: decodedToken?.data?.sub!,
    });
  }
}
