import { boot } from 'quasar/wrappers'
const prefix = 'app'

const storage = {
  get (keyName: string): unknown {
    return this.exist(keyName)
  },
  existUser () {
    return this.exist('user')
  },
  removeUser () {
    this.remove('user')
  },
  remove (key: string) {
    localStorage.removeItem(`${prefix}_${key}`)
  },
  destroy (key: string) {
    this.remove(`${prefix}_${key}`)
  },
  set (keyName: string, keyValue: unknown) {
    localStorage.setItem(`${prefix}_${keyName}`, JSON.stringify(keyValue))
  },
  setUser (user: unknown) {
    this.set('user', user)
  },
  getUser (): unknown {
    return this.get('user')
  },
  exist (keyName: string): unknown {
    const data = localStorage.getItem(`${prefix}_${keyName}`)
    if (data) {
      try {
        return JSON.parse(data)
      } catch (e) {
        // console.error('Storage JSON', e)
      }
    } else {
      return false
    }
  },
  clearAll () {
    localStorage.clear()
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$storage = storage
})

export { storage }
