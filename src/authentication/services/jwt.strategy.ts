import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from '@users/services/iusers.service';
import { UsersService } from '@users/services/users.service';
import { UserNotFoundException } from '@users/exceptions/user.not.found.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(UsersService)
    private userService: IUsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSecretKey,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getById(payload.sub);
    if (!user?.id) {
      throw new UserNotFoundException(`User not found`);
    }
    return user;
  }
}
