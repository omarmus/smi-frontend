import { Company } from './Company'
import { Option } from './Entity'
import { Entry } from './Entry'

export interface Account {
  id?: number
  name: string
  number: string
  bank: Option | string
  currency: string
  total: number
  state: string
  company?: Company
}

export interface Transaction {
  id?: number
  description: string
  date: Date
  amount: number
  balance: number
  interest: boolean
  type: string
  state: string
  company?: Company
  entry?: Entry
  account?: Account
}
