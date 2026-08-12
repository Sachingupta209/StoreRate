import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    UsersModule,
    OwnerModule,
  ],
})
export class AppModule {}