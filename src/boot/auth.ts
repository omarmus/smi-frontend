import { boot } from 'quasar/wrappers'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { storage } from './storage'
import { message } from './message'
import { useStore } from '../store'
import { Response } from '../components/entities/Entity'
import { Role } from 'src/components/entities/Permission'
import { Company } from 'src/components/entities/Company'

const urlBackend = process.env.BACKEND

const auth: Record<string, ((user?: string, password?: string) => void) > = {}

interface UserResponse {
  id: number
  username: string
  email: string
  fullname: string
  company: Company
  roles: Role[],
  role: Role,
  menu: []
  permissions: []
  token: string,
  initial: boolean
}

export default boot(({ app, router, store }) => {
  auth.login = (username?: string, password?: string) => {
    return axios.post(`${urlBackend as string}api/auth/login`, { username, password })
      .then((response: AxiosResponse<Response<UserResponse>>) => {
        if (response.data?.data) {
          const data = response.data.data
          const user = {
            username: data.username,
            email: data.email,
            fullname: data.fullname,
            company: {
              id: data.company.id,
              name: data.company.name,
              id_association: data.company.idAssociation,
              id_union: data.company.idUnion,
              money: data.company.money
            }
          }

          storage.setUser(user)
          storage.set('roles', data.roles)
          storage.set('role', data.role)
          storage.set('menu', data.menu)
          storage.set('permissions', data.permissions)
          storage.set('token', data.token)
          storage.set('initial', data.initial)

          auth.initStore()
          return router.push('/')
        }
      }).catch((error: Error | AxiosError<Response<any>>) => {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data?.message as string)
        } else {
          // console.log(error)
        }
      })
  }
  auth.cleanStore = () => {
    if (!store) {
      store = useStore()
    }
    storage.removeUser()
    storage.remove('roles')
    storage.remove('role')
    storage.remove('menu')
    storage.remove('permissions')
    storage.remove('token')
    storage.remove('initial')
    // store.commit('global/setOpen', false)
    store.commit('user/setUser', {})
    store.commit('user/setRoles', [])
    store.commit('user/setRole', {})
    store.commit('user/setMenu', [])
    store.commit('user/setPermissions', [])
    return router.push('/login')
  }
  auth.initStore = () => {
    if (!store) {
      store = useStore()
    }
    store.commit('user/setUser', storage.getUser())
    store.commit('user/setRoles', storage.get('roles'))
    store.commit('user/setRole', storage.get('role'))
    store.commit('user/setMenu', storage.get('menu'))
    store.commit('user/setPermissions', storage.get('permissions'))
    store.commit('global/setInitial', storage.get('initial'))
  }

  auth.logout = () => {
    auth.cleanStore()
  }

  app.config.globalProperties.$auth = auth
})

export { auth, UserResponse }
