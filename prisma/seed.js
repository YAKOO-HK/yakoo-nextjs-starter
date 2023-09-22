const { randomBytes, scryptSync } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function createPasswordHash(password) {
  const salt = randomBytes(16).toString('hex');
  const passwordHash = scryptSync(password, salt, 64).toString('hex');
  return [passwordHash, salt].join('$');
}

const load = async () => {
  try {
    const sysAdminRole = await prisma.adminAuthItem.upsert({
      where: { name: 'sysadmin' },
      create: {
        name: 'sysadmin',
        description: 'System Administrator',
        type: 1,
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
        authAssignments: {
          create: { itemName: sysAdminRole.name },
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
