import { boot } from 'quasar/wrappers'
import { Dark } from 'quasar'

/**
 * Modo oscuro.
 *
 * La preferencia se guarda en `localStorage` con el prefijo de la app
 * (`app_dark`) y se aplica en el MONTAJE de la app, no en el boot: los boot
 * files corren ANTES de que Quasar instale sus plugins, y el plugin de modo
 * oscuro reescribe la clase del body durante la instalación. Aplicarla en el
 * montaje garantiza que gane la preferencia del usuario, y como el montaje
 * ocurre antes del primer pintado, la página no llega a verse en claro.
 *
 * Sin preferencia guardada se respeta el sistema operativo
 * (`prefers-color-scheme: dark`).
 */
const KEY = 'app_dark'

export const darkEnabled = (): boolean => {
  const stored = localStorage.getItem(KEY)
  if (stored !== null) {
    return stored === 'true'
  }
  return !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

/** Guarda la preferencia y la aplica al instante. */
export const setDark = (value: boolean): void => {
  localStorage.setItem(KEY, String(value))
  Dark.set(value)
}

export default boot(({ app }) => {
  const apply = () => Dark.set(darkEnabled())

  const mount = app.mount.bind(app)
  app.mount = (...args: Parameters<typeof app.mount>) => {
    const result = mount(...args)
    apply()
    return result
  }
})
