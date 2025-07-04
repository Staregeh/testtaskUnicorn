import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as RepoEntity } from '../entities/repository.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateRepositoryDto } from '../dto/add-repository.dto';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(RepoEntity)
    private readonly repositoryRepo: Repository<RepoEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAllByUser(userId: number): Promise<RepoEntity[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['repositories'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.repositories;
  }

  async addRepositoryForUser(
    dto: CreateRepositoryDto,
    userId: number,
  ): Promise<RepoEntity> {
    const [owner, name] = dto.fullName.split('/');
    if (!owner || !name)
      throw new BadRequestException('Invalid repository format');

    let repo = await this.repositoryRepo.findOne({
      where: { owner, name },
    });

    if (!repo) {
      const url = `https://api.github.com/repos/${owner}/${name}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as {
        stargazers_count: number;
        forks_count: number;
        open_issues_count: number;
        created_at: string;
        html_url: string;
      };

      repo = this.repositoryRepo.create({
        owner,
        name,
        url: data.html_url,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        createdAtUnix: new Date(data.created_at).getTime(),
      });

      repo = await this.repositoryRepo.save(repo);
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['repositories'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const alreadyTracking = user.repositories.some((r) => r.id === repo.id);

    if (!alreadyTracking) {
      user.repositories.push(repo);
      await this.userRepo.save(user);
    }

    return repo;
  }

  async removeRepositoryForUser(
    repositoryId: number,
    userId: number,
  ): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['repositories'],
    });

    if (!user) throw new NotFoundException('User not found');

    user.repositories = user.repositories.filter(
      (repo) => repo.id !== repositoryId,
    );
    await this.userRepo.save(user);
    return;
  }

  async refreshRepository(repositoryId: number): Promise<RepoEntity> {
    const repo = await this.repositoryRepo.findOne({
      where: { id: repositoryId },
    });

    if (!repo) throw new NotFoundException('Repository not found');

    const url = `https://api.github.com/repos/${repo.owner}/${repo.name}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as {
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
      created_at: string;
    };

    repo.stars = data.stargazers_count;
    repo.forks = data.forks_count;
    repo.openIssues = data.open_issues_count;
    repo.createdAtUnix = new Date(data.created_at).getTime();

    return this.repositoryRepo.save(repo);
  }
}
