import { Module } from '@nestjs/common';

import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@authentication/services/jwt.strategy';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { JwtStrategyRefresh } from './services/jwt.strategy.refresh.token';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${process.env.JWTSecretKey}`,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, JwtStrategyRefresh],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
