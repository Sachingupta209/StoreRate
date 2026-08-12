import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { StoresQueryDto } from './dto/stores-query.dto';
import { RatingDto } from './dto/rating.dto';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('USER')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getStores(
    @Req() request: any,
    @Query() query: StoresQueryDto,
  ) {
    return this.usersService.getStores(
      request.user.id,
      query,
    );
  }

  @Post(':storeId/rating')
  submitRating(
    @Req() request: any,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() dto: RatingDto,
  ) {
    return this.usersService.submitRating(
      request.user.id,
      storeId,
      dto,
    );
  }
}