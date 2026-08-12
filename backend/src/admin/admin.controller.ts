import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { StoresQueryDto } from './dto/stores-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  @Post('stores')
  createStore(@Body() dto: CreateStoreDto) {
    return this.adminService.createStore(dto);
  }

  @Get('users')
  getUsers(@Query() query: UsersQueryDto) {
    return this.adminService.getUsers(query);
  }

  @Get('users/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserById(id);
  }

  @Get('stores')
  getStores(@Query() query: StoresQueryDto) {
    return this.adminService.getStores(query);
  }
}