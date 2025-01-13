export const b64toBlob = (b64Data: string, contentType: string, sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType || '' })
}

export const createPdf = (pdf: string, name: string) => {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(b64toBlob(pdf, 'application/pdf'))
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
}

export function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function printHTML (id: string, title = 'Reporte') {
  // Obtiene el contenido de la sección
  const contenido = document.getElementById(id)?.outerHTML || ''

  // Obtiene los estilos CSS de la página
  const estilos = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n')
      } catch (e) {
        return ''
      }
    })
    .join('\n')

  // Crea un documento temporal para imprimir
  const ventanaImpresion = window.open('', '_blank')
  if (ventanaImpresion) {
    ventanaImpresion.document.open()
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${estilos}</style>
      </head>
      <body>
        ${contenido}
      </body>
      </html>
    `)
    ventanaImpresion.document.close()

    // Espera a que se cargue el contenido antes de imprimir
    ventanaImpresion.onload = () => {
      ventanaImpresion.print()
      ventanaImpresion.close()
    }
  }
}
