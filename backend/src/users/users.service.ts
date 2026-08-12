import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoresQueryDto } from './dto/stores-query.dto';
import { RatingDto } from './dto/rating.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getStores(
    userId: number,
    query: StoresQueryDto,
  ) {
    const {
      name,
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
            userId: true,
          },
        },
      },
    });

    const result = stores.map((store) => {
      const total = store.ratings.reduce(
        (sum, item) => sum + item.rating,
        0,
      );

      const overallRating =
        store.ratings.length > 0
          ? Number(
              (total / store.ratings.length).toFixed(1),
            )
          : 0;

      const userRating =
        store.ratings.find(
          (item) => item.userId === userId,
        )?.rating ?? null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating,
        userRating,
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

  async submitRating(
    userId: number,
    storeId: number,
    dto: RatingDto,
  ) {
    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const rating = await this.prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        rating: dto.rating,
      },
      create: {
        userId,
        storeId,
        rating: dto.rating,
      },
    });

    return {
      message: 'Rating submitted successfully',
      rating,
    };
  }
}