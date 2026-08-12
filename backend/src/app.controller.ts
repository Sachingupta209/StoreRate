import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async healthCheck() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      database: 'connected',
      application: 'StoreRate',
    };
  }

  @Get('auth-test')
  @UseGuards(JwtAuthGuard)
  authTest(@Request() request: any) {
    return {
      message: 'JWT authentication successful',
      user: request.user,
    };
  }
}