import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SignInDto } from './sign-in.dto';

export class SignUpDto extends SignInDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;
}
