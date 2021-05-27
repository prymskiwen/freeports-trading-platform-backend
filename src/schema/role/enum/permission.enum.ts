export enum PermissionClearer {
  Default = 'clearer',

  CoworkerRead = 'clearer.coworker.read',
  CoworkerCreate = 'clearer.coworker.create',
  CoworkerUpdate = 'clearer.coworker.update',
  CoworkerDisable = 'clearer.coworker.disable',

  RoleRead = 'clearer.role.read',
  RoleCreate = 'clearer.role.create',
  RoleUpdate = 'clearer.role.update',
  RoleDelete = 'clearer.role.delete',
  RoleAssign = 'clearer.role.assign',

  OrganizationRead = 'clearer.organization.read',
  OrganizationCreate = 'clearer.organization.create',
  OrganizationUpdate = 'clearer.organization.update',
  OrganizationDisable = 'clearer.organization.disable',

  OrganizationAccountRead = 'clearer.organization.account.read',
  OrganizationAccountCreate = 'clearer.organization.account.create',
  OrganizationAccountDelete = 'clearer.organization.account.delete',

  OrganizationManagerRead = 'clearer.organization.manager.read',
  OrganizationManagerCreate = 'clearer.organization.manager.create',
  OrganizationManagerUpdate = 'clearer.organization.manager.update',
  OrganizationManagerDisable = 'clearer.organization.manager.disable',
}

export enum PermissionOrganization {
  Default = 'organization.#id#',

  OrganizationRead = 'organization.#id#.read',
  OrganizationUpdate = 'organization.#id#.update',

  RoleRead = 'organization.#id#.role.read',
  RoleCreate = 'organization.#id#.role.create',
  RoleUpdate = 'organization.#id#.role.update',
  RoleDelete = 'organization.#id#.role.delete',
  RoleAssign = 'organization.#id#.role.assign',

  DeskRead = 'organization.#id#.desk.read',
  DeskCreate = 'organization.#id#.desk.create',
  DeskUpdate = 'organization.#id#.desk.update',
  DeskDelete = 'organization.#id#.desk.disable',

  DeskManagerRead = 'organization.#id#.desk-manager.read',
  DeskManagerCreate = 'organization.#id#.desk-manager.create',
  DeskManagerUpdate = 'organization.#id#.desk-manager.update',
  DeskManagerDisable = 'organization.#id#.desk-manager.disable',
}

export enum PermissionDesk {
  Default = 'desk.#id#',

  CoworkerRead = 'desk.#id#.coworker.read',
  CoworkerCreate = 'desk.#id#.coworker.create',
  CoworkerUpdate = 'desk.#id#.coworker.update',
  CoworkerDisable = 'desk.#id#.coworker.disable',

  RoleRead = 'desk.#id#.role.read',
  RoleCreate = 'desk.#id#.role.create',
  RoleUpdate = 'desk.#id#.role.update',
  RoleDelete = 'desk.#id#.role.delete',
  RoleAssign = 'desk.#id#.role.assign',
}

export const Permission = {
  ...PermissionClearer,
  ...PermissionOrganization,
  ...PermissionDesk,
};

export type Permission =
  | PermissionClearer
  | PermissionOrganization
  | PermissionDesk;

// export type Permission = typeof Permission;
