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
  OrganizationList = 'clearer.organization.list',
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
  Default = 'organization.#organizationId#',

  CoworkerRead = 'organization.#organizationId#.coworker.read',
  CoworkerCreate = 'organization.#organizationId#.coworker.create',
  CoworkerUpdate = 'organization.#organizationId#.coworker.update',
  CoworkerDisable = 'organization.#organizationId#.coworker.disable',

  OrganizationRead = 'organization.#organizationId#.read',
  OrganizationUpdate = 'organization.#organizationId#.update',

  RoleRead = 'organization.#organizationId#.role.read',
  RoleCreate = 'organization.#organizationId#.role.create',
  RoleUpdate = 'organization.#organizationId#.role.update',
  RoleDelete = 'organization.#organizationId#.role.delete',
  RoleAssign = 'organization.#organizationId#.role.assign',

  DeskRead = 'organization.#organizationId#.desk.read',
  DeskCreate = 'organization.#organizationId#.desk.create',
  DeskUpdate = 'organization.#organizationId#.desk.update',
  DeskDelete = 'organization.#organizationId#.desk.disable',

  DeskManagerRead = 'organization.#organizationId#.desk.manager.read',
  DeskManagerCreate = 'organization.#organizationId#.desk.manager.create',
  DeskManagerUpdate = 'organization.#organizationId#.desk.manager.update',
  DeskManagerDisable = 'organization.#organizationId#.desk.manager.disable',
}

export enum PermissionDesk {
  Default = 'desk.#deskId#',

  CoworkerRead = 'desk.#deskId#.coworker.read',
  CoworkerCreate = 'desk.#deskId#.coworker.create',
  CoworkerUpdate = 'desk.#deskId#.coworker.update',
  CoworkerDisable = 'desk.#deskId#.coworker.disable',

  RoleRead = 'desk.#deskId#.role.read',
  RoleCreate = 'desk.#deskId#.role.create',
  RoleUpdate = 'desk.#deskId#.role.update',
  RoleDelete = 'desk.#deskId#.role.delete',
  RoleAssign = 'desk.#deskId#.role.assign',
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
