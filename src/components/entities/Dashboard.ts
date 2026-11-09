export type DashboardScopeLevel = 'ALL' | 'UNION' | 'ASSOCIATION' | 'COMPANY'

export interface DashboardScope {
  level: DashboardScopeLevel
  label: string
  multiCompany: boolean
  idCompany?: number
}

export interface DashboardChurch {
  id: number
  name: string
}

export interface DashboardPeriodSummary {
  year: number
  month: number
  label: string
  income: number
  expense: number
  net: number
}

export interface DashboardTotals {
  income: number
  expense: number
  net: number
}

export interface DashboardMembers {
  total: number
  baptized: number
}

export interface DashboardCards {
  members: DashboardMembers
  departments: number
  pendingReports: number
  /** Iglesias con el mes abierto y todavía sin datos. */
  pendingChurches: number
  /** Iglesias que ni siquiera tienen el mes abierto. */
  noOpenMonth: number
}

export type DashboardCompanyStatus = 'MOVED' | 'OPEN_EMPTY' | 'NO_OPEN_MONTH'

export interface DashboardCompany {
  id: number
  name: string
  acronym?: string
  type?: string
  state?: string
  /** Monto del período de referencia del alcance (el mismo mes para todas). */
  income: number
  expense: number
  net: number
  /** Etiqueta del último mes cerrado con movimientos de la iglesia. */
  lastClosedLabel: string
  /** Etiqueta del mes abierto de la iglesia (null si no tiene). */
  openMonthLabel: string | null
  status: DashboardCompanyStatus
}

export interface Dashboard {
  scope: DashboardScope
  church: DashboardChurch | null
  period: {
    current: DashboardPeriodSummary | null
    previous: DashboardPeriodSummary | null
  }
  balance: DashboardTotals
  series: DashboardPeriodSummary[]
  cards: DashboardCards
  companies: DashboardCompany[]
}
