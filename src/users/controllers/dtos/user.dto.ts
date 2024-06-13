import { EntityBaseDTO } from '@/core/dtos/entity.base.dto';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDTO extends EntityBaseDTO {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  email: string;

  @ApiProperty()
  @IsString()
  @Expose()
  firstname: string;

  @ApiProperty()
  @IsString()
  @Expose()
  lastname: string;

  @ApiProperty()
  @IsString()
  password: string;
}
