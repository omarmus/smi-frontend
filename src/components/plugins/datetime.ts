export const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
export const monthsShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
export const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export interface Week {
  day: number
  label: string
  week: number
  total: number
}

export const getWeeks = (year: number, month: number) => {
  const daysLastOfMonth = new Date(year, month, 0).getDate()
  const firstOfMonth = new Date(year, month - 1, 1)
  const weeks: Week[] = []
  for (let i = 6 - firstOfMonth.getDay(), count = 1; i < daysLastOfMonth; i += 7, count++) {
    weeks.push({ day: i + 1, label: `Sábado ${i + 1}`, week: count, total: 0 })
  }
  return weeks
}

export const format = (date: string) => {
  if (!date) {
    return null
  }
  const newDate = new Date(date)
  return [newDate.getUTCDate(), newDate.getUTCMonth() + 1, newDate.getUTCFullYear()].join('/')
}

export const normalize = (date: string) => {
  if (!date) {
    return null
  }
  return [date.split('/')[2], date.split('/')[1], date.split('/')[0]].join('-')
}

export const getYears = (add = 0, yearInitial = 2023) => {
  const year = (new Date().getUTCFullYear()) + add
  const years = []
  for (let y = year; y >= yearInitial; y--) {
    years.push(y)
  }
  return years
}
