import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (
      user &&
      (await this.userService.validatePassword(password, user.password))
    ) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(signInDto: SignInDto) {
    const user = await this.userService.findByUsername(signInDto.username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.userService.validatePassword(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        username: user.username,
        is_admin: user.is_admin,
        email: user.email,
      },
    };
  }

  async register(signUpDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.userService.create({
      ...signUpDto,
      password: hashedPassword,
    });
    const { password: _, ...result } = user;
    return result;
  }
}
