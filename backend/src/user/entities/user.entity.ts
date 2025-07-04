import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Repository } from 'src/repository/entities/repository.entity';

@Entity({ name: 'user' })
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  @Column({ type: 'varchar', unique: true, length: 255 })
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'hashedPassword123',
  })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@example.com',
  })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty({
    description: 'Whether the user has admin privileges',
    example: false,
  })
  @Column({
    default: false,
  })
  is_admin: boolean;

  @ManyToMany(() => Repository, (repo) => repo.trackedByUsers)
  @JoinTable()
  repositories: Repository[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
