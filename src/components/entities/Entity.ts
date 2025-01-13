export interface Result<E> {
  rows: [E]
  count: number
}

export interface Response<T> {
  data?: T
  code: number
  message: string
}

export interface Option {
  value: number
  label: string
}
