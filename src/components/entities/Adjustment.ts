import { Department } from './Department'

export enum AdjustmentType {
  ENTRY = 'ENTRY',
  EXPENSE = 'EXPENSE'
}

/**
 * CORRECTION — se registró mal: el usuario indica el monto CORRECTO y la
 *              línea que se corrigió; el backend calcula la diferencia.
 * OMISSION   — se olvidó registrar la operación: el usuario indica el monto
 *              que faltaba.
 * REVERSAL   — anulación de un ajuste anterior (la genera el sistema).
 */
export enum AdjustmentKind {
  CORRECTION = 'CORRECTION',
  OMISSION = 'OMISSION',
  REVERSAL = 'REVERSAL'
}

export enum AdjustmentState {
  DRAFT = 'DRAFT',
  APPLIED = 'APPLIED',
  REVERSED = 'REVERSED'
}

/* eslint-disable camelcase */
export interface AdjustmentDetail {
  id?: number
  id_adjustment: number
  value: number
  originalValue?: number
  originalDetailId?: number
  concept?: string
  observations?: string
  department?: Department
}

export interface Adjustment {
  id?: number
  year: number
  month: number
  type: AdjustmentType
  kind: AdjustmentKind
  reason: string
  reference: string
  state: AdjustmentState
  applied_year?: number
  applied_month?: number
  id_entry?: number
  id_expense?: number
  id_reversal_of?: number
  company?: { id: number }
  adjustmentsDetails?: AdjustmentDetail[]
}
