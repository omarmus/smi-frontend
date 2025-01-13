import { Company } from './Company'
import { Department } from './Department'

export interface Flow {
  id?: number
  year: number
  month: number
  total: number
  netTotal?: number
  type: string
  typeTreasury: string
  state: string
  department: Department,
  company: Company
}
