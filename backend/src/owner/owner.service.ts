import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OwnerService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(ownerId: number) {
    const owner = await this.prisma.user.findUnique({
      where: {
        id: ownerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        stores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                id: true,
                rating: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!owner) {
      throw new NotFoundException('Store owner not found');
    }

    const stores = owner.stores.map((store) => {
      const total = store.ratings.reduce(
        (sum, item) => sum + item.rating,
        0,
      );

      const averageRating =
        store.ratings.length > 0
          ? Number(
              (total / store.ratings.length).toFixed(1),
            )
          : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings: store.ratings.length,
        ratings: store.ratings.map((item) => ({
          id: item.id,
          rating: item.rating,
          submittedAt: item.createdAt,
          user: item.user,
        })),
      };
    });

    return {
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
      },
      stores,
    };
  }
}