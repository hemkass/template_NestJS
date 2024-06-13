// common
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Serialize } from '@/common/interceptors/serialize.interceptor';

//services
import { UsersService } from '../services/users.service';
import { IUsersService } from '../services/iusers.service';

//swagger
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

//models and Dtos
import { UserDTO } from './dtos/user.dto';
import { UserAlreadyExistsException } from '../exceptions/user.already.existing.exception';
import { UserNotFoundException } from '../exceptions/user.not.found.exception';
import { User } from '../services/models/user';
import { ArgumentRequireException } from '@/core/exceptions/argument.require.exception';
import { Response } from 'express';
import { Public } from '@/common/decorators/public.decorator';
import { createUser } from 'swagger/users/users';

@Public()
@ApiTags('users')
@Serialize(UserDTO)
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private usersService: IUsersService) {}

  @ApiBody({
    description: 'Objet représentant un nouvel utilisateur',
    examples: createUser,
  })
  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async create(@Body() user: UserDTO) {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException();
      }
      if (error instanceof ArgumentRequireException) {
        throw new BadRequestException();
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Retreive information about a specific user' })
  @Get('/:idUser')
  async getUserById(@Param('idUser') idUser: string): Promise<User> {
    try {
      const user = await this.usersService.getById(idUser);

      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Retreive information about every existing user' })
  @Get()
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.usersService.getAll();
    } catch (error) {
      console.error(error);
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  @ApiBody({
    type: UserDTO,
  })
  @ApiOperation({ summary: "Modify a user's data" })
  @Patch('/:idUser')
  async updateUser(
    @Body() body: Partial<UserDTO>,
    @Param('idUser') idUser: string,
  ) {
    try {
      return await this.usersService.update({ id: idUser, ...body });
    } catch (error) {
      console.error(error);
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException();
      }
      if (error instanceof ArgumentRequireException) {
        throw new BadRequestException();
      }
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException();
      }

      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Delete a user' })
  @Delete('/:idUser')
  async deleteUser(@Param('idUser') idUser: string, @Res() response: Response) {
    try {
      await this.usersService.logicalDelete(idUser);

      response.status(200).send({
        message: `User ${idUser} has been succesfully suppressed`,
      });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException();
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
