export interface RoleAndPermissions {
  roles: Set<string>;
  permissions: Set<string>;
}
export interface ReadonlyRoleAndPermissions {
  readonly roles: ReadonlySet<string>;
  readonly permissions: ReadonlySet<string>;
}

export const AUTH_ITEM_TYPE_ROLE = 1;
export const AUTH_ITEM_TYPE_PERMISSION = 2;
