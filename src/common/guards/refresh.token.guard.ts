import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshAuthGuard extends PassportAuthGuard('jwt-refresh') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // to handle error in case of invalid refresh token

    if (err || !user) {
      console.error('error', err, user);
      // ℹ️💬 necessary to avoid infinite loop from front end. Don't change this message
      throw new UnauthorizedException('invalid refresh token');
    }

    return user;
  }
}
