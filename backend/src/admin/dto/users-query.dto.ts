import { IsIn, IsOptional, IsString } from 'class-validator';

export class UsersQueryDto {
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
  @IsIn(['ADMIN', 'USER', 'STORE_OWNER'])
  role?: 'ADMIN' | 'USER' | 'STORE_OWNER';

  @IsOptional()
  @IsIn(['name', 'email', 'address', 'role'])
  sortBy?: 'name' | 'email' | 'address' | 'role';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}