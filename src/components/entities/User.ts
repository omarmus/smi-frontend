import { Company } from './Company'

export interface Person {
  id?: number
  firstName: string
  lastName: string
  secondLastName?: string
  fullname?: string
  birthday?: string
  christeningDate?: string
  acceptanceDate?: string
  nationality?: string
  documentNumber?: string
}

export interface User {
  id?: number
  username: string
  fullname?: string
  photo?: string
  type?: string
  state?: string
  person?: Person
  company?: Company
  association?: Company
  idAssociation?: number
  idUnion?: number
}
