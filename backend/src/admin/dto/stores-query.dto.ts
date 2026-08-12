import { IsIn, IsOptional, IsString } from 'class-validator';

export class StoresQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsIn(['name', 'email', 'address', 'rating'])
  sortBy?: 'name' | 'email' | 'address' | 'rating';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}