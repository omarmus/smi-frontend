/**
 * Plantillas de reporte: columnas ordenadas por (form, type).
 * Identificadores en inglés, etiquetas de UI en español.
 */

export type ColumnKind = 'number' | 'text'

export interface ReportColumn {
  /** Slug inglés, único dentro de la plantilla. */
  key: string
  /** Etiqueta visible en español. */
  label: string
  kind: ColumnKind
  /** Participa en la suma de totales (solo columnas numéricas). */
  total: boolean
}

export enum FormKind {
  WORK = 'work',
  EXPENSE = 'expense'
}

export enum FormType {
  PASTOR = 'pastor',
  ADMINISTRATIVE = 'administrative',
  BIBLICAL_WORKER = 'biblical_worker'
}

export enum TemplateState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface ReportTemplate {
  id?: number
  form: string
  type: string
  columns: ReportColumn[]
  state?: TemplateState
}

/** Claves derivadas: nunca se guardan, se calculan al render. */
export const DERIVED_KEYS = ['day', 'date', 'total']

export const formLabels: Record<string, string> = {
  [FormKind.WORK]: 'Trabajo',
  [FormKind.EXPENSE]: 'Descargo'
}

export const typeLabels: Record<string, string> = {
  [FormType.PASTOR]: 'Pastor',
  [FormType.ADMINISTRATIVE]: 'Administrativo',
  [FormType.BIBLICAL_WORKER]: 'Obrero bíblico'
}

export const stateLabels: Record<string, string> = {
  [TemplateState.ACTIVE]: 'ACTIVO',
  [TemplateState.INACTIVE]: 'INACTIVO'
}

export const kindLabels: Record<ColumnKind, string> = {
  number: 'Número',
  text: 'Texto'
}

export const emptyColumn = (): ReportColumn => ({
  key: '',
  label: '',
  kind: 'number',
  total: false
})

export const newTemplate = (): ReportTemplate => ({
  form: FormKind.WORK,
  type: FormType.PASTOR,
  columns: [],
  state: TemplateState.ACTIVE
})
