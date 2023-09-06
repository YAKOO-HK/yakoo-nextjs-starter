const { randomBytes, scryptSync } = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function createPasswordHash(password) {
  const salt = randomBytes(16).toString('hex');
  const passwordHash = scryptSync(password, salt, 64).toString('hex');
  return [passwordHash, salt].join('$');
}

const load = async () => {
  try {
    const role = await prisma.adminRole.upsert({
      where: { name: 'admin' },
      create: {
        name: 'admin',
        description: 'System Administrator',
      },
      update: {},
    });

    await prisma.adminUser.upsert({
      where: { username: 'admin' },
      create: {
        username: 'admin',
        name: 'Administrator',
        email: 'admin@test.com',
        passwordHash: createPasswordHash('abcd1234'),
        status: 10,
        roles: {
          connect: { name: role.name },
        },
      },
      update: {},
    });

    await prisma.frontendUser.upsert({
      where: { username: 'test' },
      create: {
        username: 'test',
        name: 'Frontend User',
        email: 'test@test.com',
        passwordHash: createPasswordHash('abcd1234'),
        status: 10,
      },
      update: {},
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
load();
