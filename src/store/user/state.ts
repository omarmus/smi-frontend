import { User } from '../../components/entities/User'

export interface Menu {
  label: string
}
export interface Permission {
  idRol: number
}
export interface Role {
  name: string
}

export interface UserStateInterface {
  user: User,
  menu: Menu[],
  permissions: Permission[],
  roles: Role[],
}

function state (): UserStateInterface {
  return {
    user: {
      username: ''
    },
    menu: [],
    permissions: [],
    roles: []
  }
}

export default state
