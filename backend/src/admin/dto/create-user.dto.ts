import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
    {
      message:
        'Password must contain at least one uppercase letter and one special character',
    },
  )
  password: string;

  @IsEnum(['ADMIN', 'USER', 'STORE_OWNER'])
  role: 'ADMIN' | 'USER' | 'STORE_OWNER';
}