import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  //await prisma.inspection.deleteMany()
  //await prisma.vehicle.deleteMany()
  //await prisma.account.deleteMany()
  //await prisma.session.deleteMany()
  //await prisma.user.deleteMany()

  // Criação de um usuário e veículo para associar à inspeção
  const users = await Promise.all([
    prisma.user.upsert({
      where: {
        username: 'admin',
      },
      create: {
        username: 'admin',
        email: 'admin@gmail.com',
        password: await hash('#5s2024@', 12),
        name: 'Administrador',
        role: 'ADMIN'
      },
      update: {
      }
    })
  ])

  // Create vehicles
  //const vehicles = await Promise.all([])

  // Criação de uma inspeção
  //const inspection = await Promise.all([])

  console.log({ users });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });