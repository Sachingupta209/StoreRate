import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OwnerService } from './owner.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STORE_OWNER')
export class OwnerController {
  constructor(
    private readonly ownerService: OwnerService,
  ) {}

  @Get('dashboard')
  getDashboard(@Req() request: any) {
    return this.ownerService.getDashboard(
      request.user.id,
    );
  }
}