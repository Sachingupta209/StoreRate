import { IsIn, IsOptional, IsString } from 'class-validator';

export class StoresQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsIn(['name', 'address', 'rating'])
  sortBy?: 'name' | 'address' | 'rating';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}