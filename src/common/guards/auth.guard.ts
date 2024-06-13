import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    //  ℹ️💬 check if request include valid token. Don't check token if public decorator. Use Refresh token guard if refresh token decorator.
    // if no public decorator, no refresh token decorator and no valid token, guard throw an error with 'invalid token' message
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const isRefreshToken = this.reflector.get<boolean>(
      'isRefreshToken',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    if (isRefreshToken) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // to handle error in case of invalid token

    if (err || !user) {
      throw err || new UnauthorizedException('invalid token');
    }

    return user;
  }
}
