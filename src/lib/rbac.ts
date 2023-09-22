import { cache } from 'react';
import { redirect } from 'next/navigation';
import { AdminUser } from '@prisma/client';
import { AUTH_ITEM_TYPE_ROLE, ReadonlyRoleAndPermissions, RoleAndPermissions } from '@/types/rbac';
import { requireAdminUser } from './auth';
import { prisma } from './prisma';
import 'server-only';

async function addAdminPermissions(result: RoleAndPermissions, itemName: string) {
  const authItem = await prisma.adminAuthItem.findUniqueOrThrow({
    where: { name: itemName },
    include: { children: true },
  });
  if (authItem.type === AUTH_ITEM_TYPE_ROLE) {
    result.roles.add(authItem.name);
  } else {
    result.permissions.add(authItem.name);
  }
  for (const child of authItem.children) {
    await addAdminPermissions(result, child.childName);
  }
}

export const getAdminUserPermissions = cache(async function (userId: AdminUser['id']) {
  const result = { roles: new Set<string>(), permissions: new Set<string>() };
  for (const assignment of await prisma.adminAuthAssignment.findMany({
    where: { userId },
  })) {
    // console.log(assignment.item_name);
    await addAdminPermissions(result, assignment.itemName);
  }
  return result as ReadonlyRoleAndPermissions;
});

export const requireAdminRole = cache(async function (role: string | null) {
  const user = await requireAdminUser();
  const roleAndPermissions = await getAdminUserPermissions(user.id);
  if (role && !roleAndPermissions.roles.has(role)) {
    return redirect('/admin/dashboard');
  }
  return { user, roleAndPermissions };
});
