/* eslint-disable */

const hasBlobConstructor = typeof (Blob) !== 'undefined' && (function () {
  try {
    return Boolean(new Blob())
  } catch (e) {
    return false
  }
}())

const hasArrayBufferViewSupport = hasBlobConstructor && typeof (Uint8Array) !== 'undefined' && (function () {
  try {
    return new Blob([new Uint8Array(100)]).size === 100
  } catch (e) {
    return false
  }
}())

const hasToBlobSupport = (typeof HTMLCanvasElement !== 'undefined' ? HTMLCanvasElement.prototype.toBlob : false)

const hasBlobSupport = (hasToBlobSupport || (typeof Uint8Array !== 'undefined' && typeof ArrayBuffer !== 'undefined' && typeof atob !== 'undefined'))

const hasReaderSupport = (typeof FileReader !== 'undefined' || typeof URL !== 'undefined')

export default class ImageTools {
  static resize(file: File, maxDimensions: { width: number, height: number }, callback: (file: File | Blob, state: boolean) => void) {
    if (typeof maxDimensions === 'function') {
      callback = maxDimensions
      maxDimensions = {
        width: 640,
        height: 480
      }
    }

    // let maxWidth = maxDimensions.width
    // let maxHeight = maxDimensions.height

    if (!ImageTools.isSupported() || !file.type.match(/image.*/)) {
      callback(file, false)
      return false
    }

    if (file.type.match(/image\/gif/)) {
      // Not attempting, could be an animated gif
      callback(file, false)
      // TODO: use https://github.com/antimatter15/whammy to convert gif to webm
      return false
    }

    const image = document.createElement('img')

    image.onload = () => {
      let width = image.width
      let height = image.height
      let isTooLarge = false

      if (width >= height && width > maxDimensions.width) {
        // width is the largest dimension, and it's too big.
        height *= maxDimensions.width / width
        width = maxDimensions.width
        isTooLarge = true
      } else if (height > maxDimensions.height) {
        // either width wasn't over-size or height is the largest dimension
        // and the height is over-size
        width *= maxDimensions.height / height
        height = maxDimensions.height
        isTooLarge = true
      }

      if (!isTooLarge) {
        // early exit no need to resize
        callback(file, false)
        return
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(image, 0, 0, width, height)
      }

      if (hasToBlobSupport) {
        canvas.toBlob((blob) => {
          blob && callback(blob, true)
        }, file.type)
      } else {
        const blob = ImageTools._toBlob(canvas, file.type)
        callback(blob, true)
      }
    }
    ImageTools._loadImage(image, file)

    return true
  }

  static _toBlob (canvas: HTMLCanvasElement, type: string): Blob {
    const dataURI = canvas.toDataURL(type)
    const dataURIParts = dataURI.split(',')
    let byteString
    if (dataURIParts[0].indexOf('base64') >= 0) {
      // Convert base64 to raw binary data held in a string:
      byteString = atob(dataURIParts[1])
    } else {
      // Convert base64/URLEncoded data component to raw binary data:
      byteString = decodeURIComponent(dataURIParts[1])
    }
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const intArray = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; i += 1) {
      intArray[i] = byteString.charCodeAt(i)
    }

    const mimeString = dataURIParts[0].split(':')[1].split(';')[0]
    let blob
    if (hasBlobConstructor) {
      blob = new Blob(
        [hasArrayBufferViewSupport ? intArray : arrayBuffer],
        { type: mimeString }
      )
    } else {
      // @ts-ignore: Unreachable code error
      const bb = new BlobBuilder()
      bb.append(arrayBuffer)
      blob = bb.getBlob(mimeString)
    }

    return blob
  }

  static _loadImage (image: HTMLImageElement, file: File, callback?: () => void) {
    if (typeof (URL) === 'undefined') {
      const reader = new FileReader()
      reader.onload = function (evt) {
        if (image) {
          image.src = evt?.target?.result as string
        }
        if (callback) { callback() }
      }
      reader.readAsDataURL(file)
    } else {
      image.src = URL.createObjectURL(file)
      if (callback) { callback() }
    }
  }

  static isSupported () {
    return (
      (typeof (HTMLCanvasElement) !== 'undefined') && hasBlobSupport && hasReaderSupport
    )
  }
}
