import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { StoresQueryDto } from './dto/stores-query.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [users, stores, ratings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.store.count(),
      this.prisma.rating.count(),
    ]);

    return {
      totalUsers: users,
      totalStores: stores,
      totalRatings: ratings,
    };
  }

  async createUser(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        address: dto.address.trim(),
        passwordHash,
        role: dto.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async createStore(dto: CreateStoreDto) {
    const owner = await this.prisma.user.findUnique({
      where: { id: dto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Store owner not found');
    }

    if (owner.role !== 'STORE_OWNER') {
      throw new ConflictException(
        'Selected user is not a Store Owner',
      );
    }

    return this.prisma.store.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        address: dto.address.trim(),
        ownerId: dto.ownerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        ownerId: true,
        createdAt: true,
      },
    });
  }

  async getUsers(query: UsersQueryDto) {
    const {
      name,
      email,
      address,
      role,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    return this.prisma.user.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        }),
        ...(email && {
          email: {
            contains: email,
            mode: 'insensitive',
          },
        }),
        ...(address && {
          address: {
            contains: address,
            mode: 'insensitive',
          },
        }),
        ...(role && {
          role,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stores = user.stores.map((store) => {
      const total = store.ratings.reduce(
        (sum, item) => sum + item.rating,
        0,
      );

      const rating =
        store.ratings.length > 0
          ? Number((total / store.ratings.length).toFixed(1))
          : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating,
      };
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      rating:
        user.role === 'STORE_OWNER'
          ? stores[0]?.rating ?? 0
          : undefined,
      stores,
      createdAt: user.createdAt,
    };
  }

  async getStores(query: StoresQueryDto) {
    const {
      name,
      email,
      address,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    const stores = await this.prisma.store.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        }),
        ...(email && {
          email: {
            contains: email,
            mode: 'insensitive',
          },
        }),
        ...(address && {
          address: {
            contains: address,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    const result = stores.map((store) => {
      const total = store.ratings.reduce(
        (sum, item) => sum + item.rating,
        0,
      );

      const rating =
        store.ratings.length > 0
          ? Number((total / store.ratings.length).toFixed(1))
          : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating,
      };
    });

    result.sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortOrder === 'asc'
          ? fieldA - fieldB
          : fieldB - fieldA;
      }

      return sortOrder === 'asc'
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

    return result;
  }
}