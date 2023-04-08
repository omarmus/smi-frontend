export interface Role {
  id?: number
  name: string
  slug: string
  state: string
}

export interface Permission {
  id?: number
  name: string
  slug: string
  state?: string
}

export enum RoleSlug {
  SUPERADMINISTRATOR='SUPERADMINISTRATOR',
  ADMINISTRATOR_UNION='ADMINISTRATOR_UNION',
  ADMINISTRATOR_ASSOCIATION='ADMINISTRATOR_ASSOCIATION',
  SECRETARY='SECRETARY',
  TREASURER='TREASURER',
  WORKER='WORKER'
}
