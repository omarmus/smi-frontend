/* eslint-disable camelcase */

import { Department } from './Department'

export interface Expense {
  id?: number
  year: number
  month: number
  total: number
  state: string
}

export interface ExpenseDetail {
  id?: number
  date: Date
  value: number
  concept: string
  documentType: string
  document_type: string
  documentNumber: string
  supplier: string
  expense: Expense
  department?: Department
  idDepartment: number
  type?: string
}
