import { MutationTree } from 'vuex'
import { UserStateInterface, Menu, Permission, Role } from './state'
import { User } from '../../components/entities/User'

const mutation: MutationTree<UserStateInterface> = {
  setUser (state, user: User) {
    state.user = user
  },
  setRoles (state, roles: Role[]) {
    state.roles = roles
  },
  setMenu (state, menu: Menu[]) {
    state.menu = menu
  },
  setPermissions (state, permissions: Permission[]) {
    state.permissions = permissions
  }
}

export default mutation
