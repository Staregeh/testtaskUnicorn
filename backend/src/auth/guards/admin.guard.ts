import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user?.userId;

    if (!userId) {
      return false;
    }

    const user = await this.userService.findOne(userId);
    return user.is_admin;
  }
}
