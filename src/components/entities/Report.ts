export interface Report {
  id?: number
  title: string
  description?: string
  observation?: string
  content: string
  metadata: string
  year: number
  month: number
  type: string
  userCreated?: number
  userUpdated?: number
  createAt?: Date
  updateAt?: Date
}

export interface ReportResponse {
  rows: Report[]
  count: number
}

export interface DataQuarter {
  name: string
  previous?: number
  values: number[]
  total: number
  totalExpense?: number
  totalGlobal?: number
}

export interface TableQuarter {
  header: string[],
  body: Record<number, DataQuarter>,
  footer: number[]
}

export interface ReportQuarter {
  GLOBAL: {
    entries: TableQuarter,
    expenses: TableQuarter
  },
  LOCAL: {
    entries: TableQuarter,
    expenses: TableQuarter
  }
}
