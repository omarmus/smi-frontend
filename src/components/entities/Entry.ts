import { Department } from './Department'
import { User } from './User'
export interface Offering {
  id?: string
  type?: string
  group?: string
  label?: string
  value?: number
}

export interface Concept {
  id?: number
  concept: Offering
  value: number
  observation?: string
}

export interface Entry {
  id?: number
  year: number
  month: number
  total: number
  state: string
  idExpense?: number
  totalExpense?: number
  totalDeposited?: number
  voucherDeposited?: number
  dateDeposited?: string
}

export interface EntryDetail {
  id?: number
  entry: Entry
  department?: Department
  user?: User
  code: string
  type: string
  week: number
  date: Date
  value: number
  observation: string
  concepts: Concept[]
  split?: boolean
}

export interface Option {
  value: string
  label: string
  church?: string
  /* eslint-disable camelcase */
  id_company?: number
  association?: string
  type?: string,
  months?: Record<string, Record<string, Offering>>
  active?: boolean
}

/** Fila del reporte: separador de sección o usuario (para tabla ordenada con secciones). */
export type ReportRow = { type: 'section'; label: string } | { type: 'user'; key: string; user: Option }
