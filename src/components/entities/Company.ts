export interface Contact {
  name: string
  phone: string
}
export interface Info {
  contacts: Contact[]
}

export interface Company {
  id?: number
  name: string
  description?: string
  acronym?: string
  money?: string
  type?: string
  state?: string
  /** Coordenadas de la iglesia (elegidas en el mapa). */
  latitude?: number | null
  longitude?: number | null
  /** Ubicación administrativa de la iglesia. */
  country?: string
  department?: string
  province?: string
  idAssociation?: number
  idUnion?: number
  idCompany?: number
  info?: Info
}
