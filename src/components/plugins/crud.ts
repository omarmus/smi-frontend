import { Confirm } from '../../boot/modal'
import { http } from '../../boot/http'

export const deleteItem = (update: () => Promise<void>, url: string) => {
  Confirm('¿Está seguro que desea eliminar este registro?', async () => {
    await http.delete(url)
    await update()
  })
}

export const changeState = (update: () => Promise<void>, item: { state: string }, url: string) => {
  Confirm(`¿Está seguro que quiere ${item ? 'activar' : 'desactivar'} el registro?`, async () => {
    await http.put(url, { state: item.state })
    await update()
  }, () => {
    item.state = item.state === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' // eslint-disable-line
  })
}
