import { boot } from 'quasar/wrappers'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { storage } from './storage'
import { message } from './message'

const urlBackend = process.env.BACKEND

const auth: Record<string, ((user?: string, password?: string) => void) > = {}

interface UserResponse {
  id: number
  username: string
  email: string
  fullname: string
  idCompany: number
  roles: [],
  menu: []
  permissions: []
  token: string
}
interface ErrorResponse {
  message: string
}
export default boot(({ app, router, store }) => {
  auth.login = (username?: string, password?: string) => {
    return axios.post(`${urlBackend as string}auth/login`, { username, password })
      .then((response: AxiosResponse<UserResponse>) => {
        if (response.data) {
          const user = {
            username: response.data.username,
            email: response.data.email,
            fullname: response.data.fullname,
            idCompany: response.data.idCompany
          }

          storage.setUser(user)
          storage.set('roles', response.data.roles)
          storage.set('menu', response.data.menu)
          storage.set('permissions', response.data.permissions)
          storage.set('token', response.data.token)

          auth.initStore()
          return router.push('/')
        }
      }).catch((error: Error | AxiosError<ErrorResponse>) => {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data?.message as string)
        } else {
          console.log(error)
        }
      })
  }
  auth.cleanStore = () => {
    storage.removeUser()
    storage.remove('roles')
    storage.remove('menu')
    storage.remove('permisos')
    storage.remove('token')
    storage.remove('create')
    store.commit('global/setUser', {})
    store.commit('global/setRoles', [])
    store.commit('global/setMenu', [])
    store.commit('global/setPermisos', [])
    return router.push('/login')
  }
  auth.initStore = () => {
    store.commit('global/setUser', storage.getUser())
    store.commit('global/setRoles', storage.get('roles'))
    store.commit('global/setMenu', storage.get('menu'))
    store.commit('global/setPermisos', storage.get('permisos'))
  }

  auth.logout = () => {
    auth.cleanStore()
  }

  app.config.globalProperties.$auth = auth
})

export { auth }
