import { ApiProperty } from '@nestjs/swagger';

export class RepositoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'facebook' })
  owner: string;

  @ApiProperty({ example: 'react' })
  name: string;

  @ApiProperty({ example: 'https://github.com/facebook/react' })
  url: string;

  @ApiProperty({ example: 213000 })
  stars: number;

  @ApiProperty({ example: 43000 })
  forks: number;

  @ApiProperty({ example: 1450 })
  openIssues: number;

  @ApiProperty({ example: 1589772800 })
  createdAtUnix: number;
}
