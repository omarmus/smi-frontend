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
  idAssociation?: number
  idUnion?: number
  idCompany?: number
  info?: Info
}
