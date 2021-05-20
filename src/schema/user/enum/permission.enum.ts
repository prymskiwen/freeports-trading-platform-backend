export type Permission =
  | PermissionClearer
  | PermissionOrganization
  | PermissionDesk;

export enum PermissionClearer {
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
  OrganizationRead = 'organization.#id#',
  OrganizationUpdate = 'organization.#id#.update',

  DeskRead = 'organization.#id#.desk',
  DeskCreate = 'organization.#id#.desk.create',
  DeskUpdate = 'organization.desk.#id#.update',
  DeskDelete = 'organization.desk.#id#.disable',

  DeskManagerRead = 'organization.desk.#id#.manager',
  DeskManagerCreate = 'organization.desk.#id#.manager.create',
  DeskManagerUpdate = 'organization.desk.#id#.manager.update',
  DeskManagerDisable = 'organization.desk.#id#.manager.disable',
}

export enum PermissionDesk {
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
