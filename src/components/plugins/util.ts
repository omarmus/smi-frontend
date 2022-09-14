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
