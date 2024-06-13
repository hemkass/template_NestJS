import { Serialize } from '@/common/interceptors/serialize.interceptor';
import { UserDTO } from '@/users/controllers/dtos/user.dto';
import { UserNotFoundException } from '@/users/exceptions/user.not.found.exception';
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from '@/common/decorators/public.decorator';
import { authenticationCreate } from 'swagger/examples/authentication/authentication';
import { AuthenticationDTO } from '../dtos/authentication.dto';
import { AuthenticationFailedException } from '../exceptions/authentication.failed.exception';
import { AuthenticationService } from '../services/authentication.service';
import { IAuthenticationService } from '../services/IAuthenticationService';
import { UserWithTokensDTO } from '../dtos/user.with.tokens.dto';
import { UserWithToken } from '../services/models/user.with.token';
import { RefreshToken } from '@/common/decorators/refresh.token.decorator';
import { RefreshAuthGuard } from '@/common/guards/refresh.token.guard';

@ApiTags('authentication')
@Controller('v1/authentication')
export class AuthenticationController {
  constructor(
    @Inject(AuthenticationService)
    private authenticationService: IAuthenticationService,
  ) {}

  @Public()
  @Serialize(UserWithTokensDTO)
  @ApiOperation({ summary: 'Log into an account' })
  @Post('login')
  @ApiBody({
    type: AuthenticationDTO,
    description: 'classic auth with password + email',
    examples: authenticationCreate,
  })
  async login(@Body() body: AuthenticationDTO): Promise<UserWithTokensDTO> {
    const data = { email: body.email, password: body.password };
    //  ℹ️💬 check user and password, create session, create 30days refresh token and 1h access token
    try {
      const user = await this.authenticationService.validateUser(data);

      if (!user || !user?.id) {
        throw new BadRequestException('Invalid email / password');
      } else {
        const tokens = await this.authenticationService.login(user);

        let validatedUser: UserWithToken = {
          ...user,
          token: tokens.token,
          refreshToken: tokens.refreshToken,
        };

        await this.authenticationService.saveRefreshToken({
          idUser: user.id,
          refreshToken: tokens.refreshToken,
        });

        return validatedUser;
      }
    } catch (error) {
      console.error(error);
      if (
        error instanceof UserNotFoundException ||
        error instanceof AuthenticationFailedException
      ) {
        console.error(error);
        throw new BadRequestException('Invalid email / password');
      }
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Log out' })
  @Get('/logout')
  async logout(@Res() response: Response, @Req() req: Request) {
    const refreshToken = req.get('Authorization')!.replace('Bearer', '').trim();

    await this.authenticationService.logout(refreshToken);
    response.status(200).send({
      message: `disconnected`,
    });
  }

  @RefreshToken()
  @UseGuards(RefreshAuthGuard)
  @Get('/token/refresh/')
  async refreshTokenCheck(@Req() req: Request) {
    try {
      //  ℹ️💬 periodically ( usually choose between One hour and four hour) access token expire .  This method check if refresh token included in session is still valid and give back new access token

      const user = req.user;

      return await this.authenticationService.refreshTokenCheck(user!);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException();
    }
  }
}
