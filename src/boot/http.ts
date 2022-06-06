import { Loading } from 'quasar'
import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance, Method, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { storage } from './storage'
import { message } from './message'
import { auth } from './auth'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

const urlBase = process.env.API
const codeErrorsLogout = [401]
const messages: Record<string, string> = {
  'jwt expired': 'La sesión caducó, ingrese otra vez al sistema',
  Unauthorized: 'La sesión caducó, ingrese otra vez al sistema'
}

const http: Record<string, any> = {}
let headers: Record<string, string> = {}

interface ErrorResponse {
  message: string
}

export default boot(({ app, router }) => {
  const _http = (method: Method, url: string, data: unknown, loading = true, headersCustom: Record<string, string> = {}) => {
    return new Promise((resolve, reject) => {
      if (loading) {
        Loading.show({
          // spinner: QSpinnerGears,
          message: 'Cargando...'
        })
      }
      url = `${urlBase || ''}${url}`

      if (storage.exist('token')) {
        headers.Authorization = `Bearer ${storage.get('token') as string}`
      }

      headers = Object.assign({}, headers, headersCustom)

      const config: AxiosRequestConfig = {
        method,
        url,
        data,
        headers
      }

      axios(config)
        .then((response: AxiosResponse) => {
          resolve(response.data)
        })
        .catch(async (error: Error | AxiosError<ErrorResponse>) => {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
              return router.push('/404')
            }
            if (codeErrorsLogout.includes(error.response?.status as number)) {
              auth.logout()
            }
            message.error(messages[error.response?.data?.message as string] || 'Ocurrio un error desconocido.')
            reject(error.response?.data?.message as string)
          } else {
            message.error(error.message || 'Ocurrio un error desconocido.')
            reject(error.message || 'Ocurrio un error desconocido.')
          }
        })
        .finally(() => {
          if (loading) {
            Loading.hide()
          }
        })
    })
  }

  const get = (url: string, loading = true, headers: Record<string, string>) => {
    return _http('get', url, null, loading, headers)
  }

  const post = (url: string, data: unknown, loading = true, headers: Record<string, string>) => {
    return _http('post', url, data, loading, headers)
  }

  const put = (url: string, data: unknown, loading = true, headers: Record<string, string>) => {
    return _http('put', url, data, loading, headers)
  }

  const patch = (url: string, data: unknown, loading = true, headers: Record<string, string>) => {
    return _http('patch', url, data, loading, headers)
  }

  const deleteItem = (url: string, loading = true, headers: Record<string, string>) => {
    return _http('delete', url, null, loading, headers)
  }

  const convertQuery = (url: string, query?: Record<string, string>) => {
    const string: string[] = []
    for (const key in query) {
      string.push(key + '=' + query[key])
    }
    let params: string = string.join('&')
    if (url.includes('?')) {
      params = query ? '&' + params : ''
    } else {
      params = query ? '?' + params : ''
    }
    return url + params
  }

  http.get = get
  http.post = post
  http.put = put
  http.patch = patch
  http.delete = deleteItem
  http.convertQuery = convertQuery

  app.config.globalProperties.$http = http
  app.config.globalProperties.$axios = axios
})

export { axios, http }
