import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { Request } from 'express';

import { AuthenticationService } from './authentication.service';

import { JwtService } from '@nestjs/jwt';
import { DecodedToken } from './models/decoded.token';
import { IAuthenticationService } from './IAuthenticationService';
import { UserNotAuthorized } from '../exceptions/not.authorized.exception';

@Injectable()
export class JwtStrategyRefresh extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(AuthenticationService)
    private authenticationService: IAuthenticationService,
    @Inject(JwtService)
    private JwtService: JwtService,
  ) {
    super({
      secretOrKey: `${process.env.JWTSecretKey}`,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: any) {
    // ℹ️💬 passport strategy only to refresh token method on authentication controller. Check if there is a valid refresh token on the request authorization
    const refreshToken = req.get('Authorization')!.replace('Bearer', '').trim();

    const decodedToken = this.JwtService.decode(refreshToken) as DecodedToken;
    const jwtIdUser = decodedToken?.data?.sub!;

    const validatedUser =
      await this.authenticationService.validateUserWithRefreshToken({
        refreshToken: refreshToken,
        idUser: jwtIdUser,
      });

    if (!validatedUser?.id) {
      throw new UserNotAuthorized('invalid refresh token');
    }
    req.user = validatedUser;

    return validatedUser;
  }
}
