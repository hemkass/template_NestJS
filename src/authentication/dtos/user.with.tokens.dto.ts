import { UserDTO } from '@/users/controllers/dtos/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserWithTokensDTO extends UserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  refreshToken: string;
}
