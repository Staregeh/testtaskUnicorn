import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

@Index(['owner', 'name'], { unique: true })
@Entity({ name: 'repository' })
export class Repository {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'facebook' })
  @Column()
  owner: string;

  @ApiProperty({ example: 'react' })
  @Column()
  name: string;

  @ApiProperty({ example: 'https://github.com/facebook/react' })
  @Column()
  url: string;

  @ApiProperty({ example: 213000 })
  @Column({ default: 0 })
  stars: number;

  @ApiProperty({ example: 43000 })
  @Column({ default: 0 })
  forks: number;

  @ApiProperty({ example: 1450 })
  @Column({ default: 0, name: 'open_issues' })
  openIssues: number;

  @ApiProperty({
    example: 1589772800,
    description: 'UTC Unix timestamp (seconds or milliseconds)',
  })
  @Column({ type: 'bigint', name: 'created_at_unix' })
  createdAtUnix: number;

  @ManyToMany(() => User, (user) => user.repositories)
  trackedByUsers: User[];

  @ApiProperty({ example: '2024-07-01T12:34:56.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2024-07-01T12:34:56.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
