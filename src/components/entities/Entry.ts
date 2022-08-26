import { Department } from './Department'
import { User } from './User'

export interface Concept {
  id?: number
  concept: string
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
  concepts: [Concept]
}
