import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class user implements User {
  @ApiProperty({ example: true, description: 'admin 여부' })
  @IsNotEmpty()
  isAdmin: boolean;

  @ApiProperty({ example: '1', description: 'user id' })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 'email@email.com', description: 'email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'password', example: 'aalksjd!' })
  @IsNotEmpty()
  password: string;
}
