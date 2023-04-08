import { Permission, Role } from 'src/components/entities/Permission'
import { User } from '../../components/entities/User'

export interface Menu {
  label: string
}

export interface UserStateInterface {
  user: User,
  menu: Menu[],
  permissions: Permission[],
  roles: Role[],
  role: Role,
}

function state (): UserStateInterface {
  return {
    user: {
      username: ''
    },
    menu: [],
    permissions: [],
    roles: [],
    role: {
      name: '',
      slug: '',
      state: ''
    }
  }
}

export default state
