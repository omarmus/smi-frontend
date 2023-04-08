export interface Position {
  id?: number
  description: string
  level: string
  type: string
  state: string
}

export interface PositionUser {
  id: number
  begin: number
  end: number
  remuneration: boolean
  fulltime: boolean
  state: string
  position: Position
  // id_company: number
  // id_user: number
  // id_position: number
}
