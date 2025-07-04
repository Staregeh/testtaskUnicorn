import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RepositoryService } from '../services/repository.service';
import { RepositoryResponseDto } from '../dto/repository-response.dto';
import { CreateRepositoryDto } from '../dto/add-repository.dto';
import { AuthenticatedUser, User } from 'src/auth/decorators/user.decorator';

@ApiTags('Repositories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tracked repositories for the current user',
  })
  @ApiResponse({ status: 200, type: [RepositoryResponseDto] })
  async getUserRepositories(@User() user: AuthenticatedUser) {
    return this.repositoryService.findAllByUser(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new GitHub repository to tracking list' })
  @ApiResponse({ status: 201, type: RepositoryResponseDto })
  async addRepository(
    @Body() dto: CreateRepositoryDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.repositoryService.addRepositoryForUser(dto, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a repository from user tracking list' })
  @ApiResponse({ status: 204, description: 'Repository removed successfully' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthenticatedUser,
  ) {
    return this.repositoryService.removeRepositoryForUser(id, user.userId);
  }

  @Patch(':id/refresh')
  @ApiOperation({ summary: 'Refresh repository data from GitHub' })
  @ApiResponse({
    status: 200,
    description: 'Repository data refreshed successfully',
  })
  async refresh(@Param('id', ParseIntPipe) id: number) {
    return this.repositoryService.refreshRepository(id);
  }
}
