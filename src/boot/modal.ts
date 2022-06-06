import { boot } from 'quasar/wrappers'
import { Dialog } from 'quasar'

const Confirm = (message = 'Mensaje', callbackOk: ((() => Promise<void>) | (() => void)), callbackCancel?: ((() => Promise<void>) | (() => void)), title = 'Confirmar', labelOk = 'Aceptar', labelCancel = 'Cancelar') => {
  Dialog.create({
    title,
    message,
    ok: {
      // color: 'primary',
      label: labelOk,
      noCaps: true,
      padding: '8px 20px',
      icon: 'check'
    },
    cancel: {
      color: 'white',
      'text-color': 'secondary',
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
