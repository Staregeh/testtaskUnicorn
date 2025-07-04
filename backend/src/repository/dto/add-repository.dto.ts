import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRepositoryDto {
  @ApiProperty({
    example: 'facebook/react',
    description: 'GitHub path in format of "owner/name"',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;
}
