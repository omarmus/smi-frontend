import { boot } from 'quasar/wrappers'
import { Dialog } from 'quasar'

const Confirm = (message = 'Mensaje', callbackOk: ((() => Promise<void>) | (() => void)), callbackCancel?: ((() => Promise<void>) | (() => void)), title = 'Confirmar', labelOk = 'Aceptar', labelCancel = 'Cancelar') => {
  Dialog.create({
    title,
    message,
    ok: {
      // Azul corporativo de la marca (el color por defecto del diálogo se
      // deja explícito: los botones de acción son de marca).
      color: 'primary',
      label: labelOk,
      noCaps: true,
      padding: '8px 20px',
      icon: 'check'
    },
    cancel: {
      // Negro corporativo de la marca. Antes era `color: 'white'` con
      // `text-color: 'secondary'`: en dark mode el texto quedaba claro
      // sobre fondo blanco (ilegible) y en claro tampoco era un color de
      // marca.
      color: 'secondary',
      label: labelCancel,
      noCaps: true,
      padding: '8px 20px',
      icon: 'cancel'
    },
    persistent: true,
    html: true
  }).onOk(() => {
    if (typeof callbackOk === 'function') {
      void (async () => {
        await callbackOk()
      })()
    }
  }).onCancel(() => {
    if (typeof callbackCancel === 'function') {
      void (async () => {
        await callbackCancel()
      })()
    }
  })
}

export default boot(({ app }) => {
  app.config.globalProperties.$confirm = Confirm
})

export { Confirm }
