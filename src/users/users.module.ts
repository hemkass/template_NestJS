import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersRepository } from '@users/repositories/users.repository';
import { UsersController } from '@users/controllers/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
