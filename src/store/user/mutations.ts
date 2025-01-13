import { MutationTree } from 'vuex'
import { UserStateInterface, Menu } from './state'
import { User } from '../../components/entities/User'
import { Role } from 'src/components/entities/Permission'

const mutation: MutationTree<UserStateInterface> = {
  setUser (state, user: User) {
    state.user = user
  },
  setRoles (state, roles: Role[]) {
    state.roles = roles
  },
  setRole (state, role: Role) {
    state.role = role
  },
  setMenu (state, menu: Menu[]) {
    state.menu = menu
  },
  setPermissions (state, permissions: string[]) {
    state.permissions = permissions
  }
}

export default mutation
