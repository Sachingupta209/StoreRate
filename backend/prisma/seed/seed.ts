import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  const prisma = new PrismaClient({ adapter });

  const adminPassword = await bcrypt.hash('Admin@1234', 12);
  const ownerPassword = await bcrypt.hash('Owner@1234', 12);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@storerate.local',
    },
    update: {
      role: 'ADMIN',
    },
    create: {
      name: 'StoreRate System Administrator',
      email: 'admin@storerate.local',
      passwordHash: adminPassword,
      address: 'Pune, Maharashtra, India',
      role: 'ADMIN',
    },
  });

  const owner = await prisma.user.upsert({
    where: {
      email: 'owner@storerate.local',
    },
    update: {
      role: 'STORE_OWNER',
    },
    create: {
      name: 'StoreRate Store Owner',
      email: 'owner@storerate.local',
      passwordHash: ownerPassword,
      address: 'Pune, Maharashtra, India',
      role: 'STORE_OWNER',
    },
  });

  console.log('Seed completed successfully.');
  console.log(`Admin: ${admin.email}`);
  console.log(`Store Owner: ${owner.email}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});