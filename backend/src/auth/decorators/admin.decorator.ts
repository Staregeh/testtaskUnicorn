import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';

export const IS_ADMIN_KEY = 'isAdmin';
export const Admin = () =>
  applyDecorators(SetMetadata(IS_ADMIN_KEY, true), UseGuards(AdminGuard));
