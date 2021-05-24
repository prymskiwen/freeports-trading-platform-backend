export enum PermissionClearer {
  Default = 'clearer',

  CoworkerRead = 'clearer.coworker',
  CoworkerCreate = 'clearer.coworker.create',
  CoworkerUpdate = 'clearer.coworker.update',
  CoworkerDisable = 'clearer.coworker.disable',

  RoleRead = 'clearer.role',
  RoleCreate = 'clearer.role.create',
  RoleUpdate = 'clearer.role.update',
  RoleDelete = 'clearer.role.delete',
  RoleAssign = 'clearer.role.assign',

  OrganizationRead = 'clearer.organization',
  OrganizationCreate = 'clearer.organization.create',
  OrganizationUpdate = 'clearer.organization.#id#.update',
  OrganizationDisable = 'clearer.organization.#id#.disable',

  OrganizationAccountRead = 'clearer.organization.#id#.account',
  OrganizationAccountCreate = 'clearer.organization.#id#.account.create',
  OrganizationAccountDelete = 'clearer.organization.#id#.account.delete',

  OrganizationManagerRead = 'clearer.organization.#id#.manager',
  OrganizationManagerCreate = 'clearer.organization.#id#.manager.create',
  OrganizationManagerUpdate = 'clearer.organization.#id#.manager.update',
  OrganizationManagerDisable = 'clearer.organization.#id#.manager.disable',
}

export enum PermissionOrganization {
  Default = 'organization.#id#',

  OrganizationRead = 'organization.#id#',
  OrganizationUpdate = 'organization.#id#.update',

  RoleRead = 'organization.#id#.role',
  RoleCreate = 'organization.#id#.role.create',
  RoleUpdate = 'organization.#id#.role.update',
  RoleDelete = 'organization.#id#.role.delete',
  RoleAssign = 'organization.#id#.role.assign',

  DeskRead = 'organization.#id#.desk',
  DeskCreate = 'organization.#id#.desk.create',
  DeskUpdate = 'organization.#id#.desk.update',
  DeskDelete = 'organization.#id#.desk.disable',

  DeskManagerRead = 'organization.#id#.desk-manager',
  DeskManagerCreate = 'organization.#id#.desk-manager.create',
  DeskManagerUpdate = 'organization.#id#.desk-manager.update',
  DeskManagerDisable = 'organization.#id#.desk-manager.disable',
}

export enum PermissionDesk {
  Default = 'desk.#id#',

  CoworkerRead = 'desk.#id#.coworker',
  CoworkerCreate = 'desk.#id#.coworker.create',
  CoworkerUpdate = 'desk.#id#.coworker.update',
  CoworkerDisable = 'desk.#id#.coworker.disable',

  RoleRead = 'desk.#id#.role',
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
