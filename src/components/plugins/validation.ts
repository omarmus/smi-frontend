'use strict'

export default {
  email: (v: string) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return re.test(String(v).toLowerCase()) || !v || 'El correo no es válido.'
  },
  url: (v: string) => {
    return /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/.test(v) || !v || 'Introduzca una URL válida'
  },
  date: (v: string) => {
    return /^((0?[1-9]|[12][0-9]|3[01])[- /.](0?[1-9]|1[012])[- /.](19|20)?[0-9]{2})*$/.test(v) || !v || 'Introduzca una fecha válida'
  },
  password: (v: string) => v.length >= 6 || !v || 'Debe tener al menos 6 carácteres.',
  required: (v: string) => !!v || 'El campo es requerido.',
  phone: (v: string) => {
    const re = /^[0-9]/
    return (re.test(String(v).toLowerCase()) && v.length === 8) || !v || 'Introduzca un número de celular válido.'
  },
  alphabet: (v: string) => {
    const re = /^[a-zñÑáéíóú]/
    return re.test(String(v).toLowerCase()) || !v || 'Solo se permiten letras.'
  },
  number: (v: string) => {
    const re = /^\d+$/g
    return re.test(String(v)) || !v || 'Solo se permiten números enteros.'
  },
  decimal: (v: string) => {
    const re = /^\d*\.?\d*$/g
    return re.test(String(v)) || !v || 'Use el punto (.) para los decimales.'
  }
}

export function validateDecimal (valor: string) {
  return /^\d*\.?\d*$/.test(valor)
}
