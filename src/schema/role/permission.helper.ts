export const PermissionClearer = {
  default: 'clearer',

  coworkerRead: 'clearer.coworker.read',
  coworkerCreate: 'clearer.coworker.create',
  coworkerUpdate: 'clearer.coworker.update',
  coworkerDisable: 'clearer.coworker.disable',

  roleRead: 'clearer.role.read',
  roleCreate: 'clearer.role.create',
  roleUpdate: 'clearer.role.update',
  roleDelete: 'clearer.role.delete',
  roleAssign: 'clearer.role.assign',

  organizationRead: 'clearer.organization.read',
  organizationCreate: 'clearer.organization.create',
  organizationUpdate: 'clearer.organization.update',
  organizationDisable: 'clearer.organization.disable',

  accountRead: 'clearer.account.read',
  accountCreate: 'clearer.account.create',
  accountUpdate: 'clearer.account.update',
  accountDelete: 'clearer.account.delete',
  accountAssign: 'clearer.account.assign',

  organizationManagerRead: 'clearer.organization.manager.read',
  organizationManagerCreate: 'clearer.organization.manager.create',
  organizationManagerUpdate: 'clearer.organization.manager.update',
  organizationManagerDisable: 'clearer.organization.manager.disable',
} as const;

export const PermissionClearerGroup = [
  {
    name: 'Coworker',
    permissions: [
      {
        name: 'Read',
        code: PermissionClearer.coworkerRead,
      },
      {
        name: 'Create',
        code: PermissionClearer.coworkerCreate,
      },
      {
        name: 'Update',
        code: PermissionClearer.coworkerUpdate,
      },
      {
        name: 'Disable',
        code: PermissionClearer.coworkerDisable,
      },
    ],
  },
  {
    name: 'Role',
    permissions: [
      {
        name: 'Read',
        code: PermissionClearer.roleRead,
      },
      {
        name: 'Create',
        code: PermissionClearer.roleCreate,
      },
      {
        name: 'Update',
        code: PermissionClearer.roleUpdate,
      },
      {
        name: 'Delete',
        code: PermissionClearer.roleDelete,
      },
      {
        name: 'Assign',
        code: PermissionClearer.roleAssign,
      },
    ],
  },
  {
    name: 'Organization',
    permissions: [
      {
        name: 'Read',
        code: PermissionClearer.organizationRead,
      },
      {
        name: 'Create',
        code: PermissionClearer.organizationCreate,
      },
      {
        name: 'Update',
        code: PermissionClearer.organizationUpdate,
      },
      {
        name: 'Disable',
        code: PermissionClearer.organizationDisable,
      },
    ],
  },
  {
    name: 'Account',
    permissions: [
      {
        name: 'Read',
        code: PermissionClearer.accountRead,
      },
      {
        name: 'Create',
        code: PermissionClearer.accountCreate,
      },
      {
        name: 'Update',
        code: PermissionClearer.accountUpdate,
      },
      {
        name: 'Delete',
        code: PermissionClearer.accountDelete,
      },
      {
        name: 'Assign',
        code: PermissionClearer.accountAssign,
      },
    ],
  },
  {
    name: 'Organization manager',
    permissions: [
      {
        name: 'Read',
        code: PermissionClearer.organizationManagerRead,
      },
      {
        name: 'Create',
        code: PermissionClearer.organizationManagerCreate,
      },
      {
        name: 'Update',
        code: PermissionClearer.organizationManagerUpdate,
      },
      {
        name: 'Disable',
        code: PermissionClearer.organizationManagerDisable,
      },
    ],
  },
];

export const PermissionOrganization = {
  default: 'organization.#organizationId#',

  coworkerRead: 'organization.#organizationId#.coworker.read',
  coworkerCreate: 'organization.#organizationId#.coworker.create',
  coworkerUpdate: 'organization.#organizationId#.coworker.update',
  coworkerDisable: 'organization.#organizationId#.coworker.disable',

  organizationRead: 'organization.#organizationId#.read',
  organizationUpdate: 'organization.#organizationId#.update',

  roleRead: 'organization.#organizationId#.role.read',
  roleCreate: 'organization.#organizationId#.role.create',
  roleUpdate: 'organization.#organizationId#.role.update',
  roleDelete: 'organization.#organizationId#.role.delete',
  roleAssign: 'organization.#organizationId#.role.assign',

  deskRead: 'organization.#organizationId#.desk.read',
  deskCreate: 'organization.#organizationId#.desk.create',
  deskUpdate: 'organization.#organizationId#.desk.update',
  deskDisable: 'organization.#organizationId#.desk.disable',

  deskUserRead: 'organization.#organizationId#.desk.user.read',
  deskUserCreate: 'organization.#organizationId#.desk.user.create',
  deskUserUpdate: 'organization.#organizationId#.desk.user.update',
  deskUserDisable: 'organization.#organizationId#.desk.user.disable',
} as const;

export const PermissionOrganizationGroup = [
  {
    name: 'Organization',
    permissions: [
      {
        name: 'Read',
        code: PermissionOrganization.organizationRead,
      },
      {
        name: 'Update',
        code: PermissionOrganization.organizationUpdate,
      },
    ],
  },
  {
    name: 'Coworker',
    permissions: [
      {
        name: 'Read',
        code: PermissionOrganization.coworkerRead,
      },
      {
        name: 'Create',
        code: PermissionOrganization.coworkerCreate,
      },
      {
        name: 'Update',
        code: PermissionOrganization.coworkerUpdate,
      },
      {
        name: 'Disable',
        code: PermissionOrganization.coworkerDisable,
      },
    ],
  },
  {
    name: 'Role',
    permissions: [
      {
        name: 'Read',
        code: PermissionOrganization.roleRead,
      },
      {
        name: 'Create',
        code: PermissionOrganization.roleCreate,
      },
      {
        name: 'Update',
        code: PermissionOrganization.roleUpdate,
      },
      {
        name: 'Delete',
        code: PermissionOrganization.roleDelete,
      },
      {
        name: 'Assign',
        code: PermissionOrganization.roleAssign,
      },
    ],
  },
  {
    name: 'Desk',
    permissions: [
      {
        name: 'Read',
        code: PermissionOrganization.deskRead,
      },
      {
        name: 'Create',
        code: PermissionOrganization.deskCreate,
      },
      {
        name: 'Update',
        code: PermissionOrganization.deskUpdate,
      },
      {
        name: 'Disable',
        code: PermissionOrganization.deskDisable,
      },
    ],
  },
  {
    name: 'Desk user',
    permissions: [
      {
        name: 'Read',
        code: PermissionOrganization.deskUserRead,
      },
      {
        name: 'Create',
        code: PermissionOrganization.deskUserCreate,
      },
      {
        name: 'Update',
        code: PermissionOrganization.deskUserUpdate,
      },
      {
        name: 'Disable',
        code: PermissionOrganization.deskUserDisable,
      },
    ],
  },
];

export const PermissionDesk = {
  default: 'desk.#deskId#',

  coworkerRead: 'desk.#deskId#.coworker.read',
  coworkerCreate: 'desk.#deskId#.coworker.create',
  coworkerUpdate: 'desk.#deskId#.coworker.update',
  coworkerDisable: 'desk.#deskId#.coworker.disable',

  roleRead: 'desk.#deskId#.role.read',
  roleCreate: 'desk.#deskId#.role.create',
  roleUpdate: 'desk.#deskId#.role.update',
  roleDelete: 'desk.#deskId#.role.delete',
  roleAssign: 'desk.#deskId#.role.assign',
} as const;

export const PermissionDeskGroup = [
  {
    name: 'Coworker',
    permissions: [
      {
        name: 'Read',
        code: PermissionDesk.coworkerRead,
      },
      {
        name: 'Create',
        code: PermissionDesk.coworkerCreate,
      },
      {
        name: 'Update',
        code: PermissionDesk.coworkerUpdate,
      },
      {
        name: 'Disable',
        code: PermissionDesk.coworkerDisable,
      },
    ],
  },
  {
    name: 'Role',
    permissions: [
      {
        name: 'Read',
        code: PermissionDesk.roleRead,
      },
      {
        name: 'Create',
        code: PermissionDesk.roleCreate,
      },
      {
        name: 'Update',
        code: PermissionDesk.roleUpdate,
      },
      {
        name: 'Delete',
        code: PermissionDesk.roleDelete,
      },
      {
        name: 'Assign',
        code: PermissionDesk.roleAssign,
      },
    ],
  },
];

export const PermissionAny = [
  ...Object.values(PermissionClearer),
  ...Object.values(PermissionOrganization),
  ...Object.values(PermissionDesk),
] as const;

export type PermissionClearer = typeof PermissionClearer[keyof typeof PermissionClearer];
export type PermissionOrganization = typeof PermissionOrganization[keyof typeof PermissionOrganization];
export type PermissionDesk = typeof PermissionDesk[keyof typeof PermissionDesk];
export type PermissionAny = typeof PermissionAny[number];

// TODO: retrieve permissions from group object if it is possible to keep type
// export const permissionClearer = iterateGroup(PermissionClearerGroup);
// export const permissionOrganization = iterateGroup(PermissionOrganizationGroup);
// export const permissionDesk = iterateGroup(PermissionDeskGroup);

// function iterateGroup(obj: any): Array<string> {
//   return Object.keys(obj).reduce((prev, key) => {
//     if (typeof obj[key] === 'object') {
//       return [...prev, ...iterateGroup(obj[key])];
//     }

//     if (key === 'code') {
//       return [...prev, obj[key]];
//     }

//     return prev;
//   }, []);
// }
