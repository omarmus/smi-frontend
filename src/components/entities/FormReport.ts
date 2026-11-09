/**
 * Informes mensuales: snapshot de columnas + días sparse + totales server-side.
 * El frontend NUNCA calcula totales ni días: los recibe del backend.
 */
import { ReportColumn } from './ReportTemplate'

/**
 * Estado del informe en el flujo de revisión.
 *
 * - `DRAFT`: el dueño lo está armando (editable).
 * - `SUBMITTED`: enviado a revisión (solo lectura hasta que se reabra).
 * - `OBSERVED`: la administración devolvió observaciones (editable: el dueño
 *   corrige y lo vuelve a enviar).
 * - `APPROVED`: aprobado (solo lectura).
 * - `INHABILITADO`: retirado por la administración (solo lectura y fuera del
 *   flujo; el informe NO se borra: conserva su historial).
 */
export enum ReportReviewState {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  OBSERVED = 'OBSERVED',
  APPROVED = 'APPROVED',
  INHABILITADO = 'INHABILITADO'
}

/** Acciones de la revisión (las elige la administración en el modal). */
export enum ReportReviewAction {
  APPROVE = 'approve',
  OBSERVE = 'observe',
  REVERT = 'revert'
}

export const reviewStateLabels: Record<string, string> = {
  [ReportReviewState.DRAFT]: 'Borrador',
  [ReportReviewState.SUBMITTED]: 'Enviado',
  [ReportReviewState.OBSERVED]: 'Observado',
  [ReportReviewState.APPROVED]: 'Aprobado',
  [ReportReviewState.INHABILITADO]: 'Inhabilitado'
}

/**
 * Tonos con texto blanco accesible (>=4.5:1): los tonos claros de Quasar
 * ('grey-6', 'blue', 'warning', 'positive') quedan entre 2.6:1 y 4.6:1.
 */
export const reviewStateColors: Record<string, string> = {
  [ReportReviewState.DRAFT]: 'grey-7',
  [ReportReviewState.SUBMITTED]: 'blue-9',
  [ReportReviewState.OBSERVED]: 'deep-orange-10',
  [ReportReviewState.APPROVED]: 'green-9',
  [ReportReviewState.INHABILITADO]: 'dark'
}

export const reviewActionLabels: Record<string, string> = {
  [ReportReviewAction.APPROVE]: 'Aprobar (queda en solo lectura)',
  [ReportReviewAction.OBSERVE]: 'Observar (enviar observaciones)',
  [ReportReviewAction.REVERT]: 'Revertir aprobación (vuelve a borrador)'
}

/** Estados en los que el informe se puede editar (DRAFT y OBSERVED). */
export const EDITABLE_REVIEW_STATES: ReportReviewState[] = [
  ReportReviewState.DRAFT,
  ReportReviewState.OBSERVED
]

/** Un informe enviado o aprobado no se puede editar (la UI y el server lo bloquean). */
export const isReadOnly = (report?: { reviewState?: string }): boolean =>
  !EDITABLE_REVIEW_STATES.includes((report?.reviewState || ReportReviewState.DRAFT) as ReportReviewState)

export interface FormReport {
  id?: number
  form: string
  type: string
  month: number
  year: number
  /** Snapshot de columnas copiado de la plantilla al crear. */
  columns: ReportColumn[]
  /** Plantilla de origen (solo id+nombre en la lista); null si se eliminó. */
  template?: { id?: number, name?: string } | null
  /** Nombre del propietario: quien creó el informe (columna de la lista). */
  ownerName?: string
  /** Id del usuario creador (auditoría `_user_created`). */
  userCreated?: number
  /** Estado de la revisión de la administración. */
  reviewState?: ReportReviewState
  /** Comentario de la última revisión (lo lee el obrero). */
  reviewComment?: string
  /** Cuándo se escribió el comentario. */
  reviewCommentAt?: string
  /** Quién escribió el comentario (usuario de la administración). */
  reviewCommentBy?: number
}

export interface FormReportDay {
  day: number
  /** { [columnKey]: value } — sin claves derivadas. */
  values: Record<string, unknown>
}

/** Respuesta de GET api/form-reports/:id (llenado Y impresión). */
export interface FormReportDetail extends FormReport {
  days: FormReportDay[]
  totals: Record<string, number>
  /** Días del mes derivados en el server (leap-aware). */
  daysInMonth: number
  /** Nombre completo del dueño del informe (línea NOMBRE de la impresión). */
  ownerName: string
  /** Nombre de quien escribió el último comentario de revisión. */
  reviewerName: string
}
